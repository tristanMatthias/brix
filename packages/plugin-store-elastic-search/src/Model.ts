import { BrixStoreModel, BrixStoreModelFindOptions } from '@brix/model';
import { Client, ApiResponse, } from '@elastic/elasticsearch';

interface SearchResponse<T> {
  hits: {
    hits: { _source: T; _id: string }[]
  };
}

export class ElasticModel<T> implements BrixStoreModel<T> {

  constructor(
    private _index: string,
    private _client: Client) { }

  async findAll() {
    return this._parseMany(this._client.search({ index: this._index, q: '*', }));
  }

  async create(data: T) {
    const res = await this._client.index({
      index: this._index,
      body: data
    });

    return {
      id: res.body._id,
      ...data
    };
  }

  async bulkCreate(data: Partial<T>[]) {
    const body = data.flatMap(doc => [{ index: { _index: this._index } }, doc]);


    const { body: res } = await this._client.bulk({
      index: this._index,
      refresh: 'wait_for',
      body
    });
    const ids = res.items.map((doc: any) => doc.index._id);

    return this._parseMany(this._client.search({
      body: { query: { ids: { values: ids } } }
    }));
  }

  async findById(id: string) {
    return (await this._parseMany(this._client.search({
      body: { query: { ids: { values: id } } }
    })))[0];
  }

  async findOne(options: BrixStoreModelFindOptions<T>) {
    const res: ApiResponse<T> = await this._client.search({
      index: this._index,
      body: {
        query: options.where
      }
    });
    return res.body;
  }

  async deleteById(id: string) {
    await this._client.delete({
      id,
      index: this._index
    });
    return true;
  }

  async updateById(id: string, values: Partial<T>) {
    await this._client.update({
      id,
      index: this._index,
      body: { doc: values }
    });
    return this.findById(id);
  }

  private async _parseMany(func: Promise<ApiResponse<SearchResponse<T>>>) {
    const { body } = await func;
    return body.hits.hits.map(h => {
      return { id: h._id, ...h._source };
    });
  }
}
