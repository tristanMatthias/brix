import { BrixModelFieldMetadata, BrixStoreModel, BrixStoreModelFindOptions, FieldType } from '@brix/model';
import { ApiResponse, Client } from '@elastic/elasticsearch';
import merge from 'deepmerge';

interface SearchResponse<T> {
  hits: {
    hits: { _source: T; _id: string }[]
  };
}

export class ElasticModel<T> implements BrixStoreModel<T> {

  constructor(
    private _index: string,
    private _fields: BrixModelFieldMetadata[],
    private _client: Client) { }

  async findAll(options: any = {}) {
    return this._parseMany(this._client.search(merge({
      index: this._index,
      q: options ? undefined : '*'
    }, options)));
  }

  async create(data: T, options: any = {}) {
    const res = await this._client.index(merge({
      index: this._index,
      body: data
    }, options));

    return this._serialize({
      id: res.body._id,
      ...data
    });
  }

  async bulkCreate(data: Partial<T>[], options: any = {}) {
    const body = data.flatMap(doc => [{ index: { _index: this._index } }, doc]);

    const { body: res } = await this._client.bulk(merge({
      index: this._index,
      refresh: 'wait_for',
      body
    }, options));
    const ids = res.items.map((doc: any) => doc.index._id);

    return this._parseMany(this._client.search({
      body: { query: { ids: { values: ids } } }
    }));
  }

  async findById(id: string, options: any = {}) {
    return (await this._parseMany(this._client.search(merge({
      body: { query: { ids: { values: id } } }
    }, options))))[0];
  }

  async findOne(options: BrixStoreModelFindOptions<T>, adapterOptions: any = {}) {
    const res = await this._client.search(merge({
      index: this._index,
      body: {
        query: options.where
      }
    }, adapterOptions));
    if (!res.body.hits.hits.length) return null;
    return this._serialize(res.body.hits.hits[0]._source);
  }

  async deleteById(id: string, options: any = {}) {
    await this._client.delete(merge({
      id,
      index: this._index
    }, options));
    return true;
  }

  async updateById(id: string, values: Partial<T>, options: any = {}) {
    await this._client.update(merge({
      id,
      index: this._index,
      body: { doc: values }
    }, options));
    return this.findById(id);
  }

  private async _parseMany(func: Promise<ApiResponse<SearchResponse<T>>>) {
    const { body } = await func;
    this._fields;
    return body.hits.hits.map(h => {
      return { id: h._id, ...this._serialize(h._source) };
    });
  }

  private _serialize(obj: T): T {
    this._fields
      .forEach(f => {
        const n = f.name as keyof T;
        const v = obj[n];
        if (typeof v === 'string' && f.type === FieldType.DATE) obj[n] = new Date(v) as any;
      });
    return obj;
  }
}
