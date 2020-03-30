import { BrixConfig } from '@brix/core';
import { BrixStore, BrixStoreBuildOptions, BrixStoreModel, ErrorNoModelRegistered } from '@brix/model';
import { Client } from '@elastic/elasticsearch';

import { ElasticModel } from './Model';
import pluralize from 'pluralize';

const modelName = (name: string) => {
  const n = pluralize.singular(name).toLowerCase();
  return (n[0].toUpperCase() + n.slice(1)).toLowerCase();
};


export class ElasticStore implements BrixStore<Client> {
  db: Client;
  models: { [key: string]: any } = {};
  private _config: BrixStoreBuildOptions;
  private _modelCache: { [model: string]: ElasticModel<any> } = {};

  build(options: BrixStoreBuildOptions) {
    this._config = options;
    return this;
  }

  private async _build(options: BrixConfig['dbConnection']) {
    this.db = new Client({
      auth: {
        username: options.username,
        password: options.password
      },
      node: options.host

    });
  }

  async connect(options: BrixConfig['dbConnection']) {
    await this._build(options);
    // TODO: Add ID to each insert
  }


  async disconnect() {
    if (this.db) await this.db.close();
  }

  model<T>(name: string) {
    const n = modelName(name);

    if (!this._config.models || !this._config.models.find(m => modelName(m.name) === n)) {
      throw new ErrorNoModelRegistered(name);
    }
    if (this._modelCache[n]) return this._modelCache[n];

    const m = this._config.models.find(m => modelName(m.name) === n)!;
    const model = new ElasticModel<T>(n, m.fields!, this.db);
    this._modelCache[n] = model;
    return model as BrixStoreModel<T>;
  }
}
