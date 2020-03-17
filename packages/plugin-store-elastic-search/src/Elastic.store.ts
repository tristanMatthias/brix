import { BrixConfig } from '@brix/core';
import { BrixStore, BrixStoreBuildOptions, BrixStoreModel } from '@brix/model';
import { Client } from '@elastic/elasticsearch';

import { ElasticModel } from './Model';


export class ElasticStore implements BrixStore {
  db: Client;
  models: { [key: string]: any } = {};
  private _config: BrixStoreBuildOptions;

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


    if (this._config.models) {
      await Promise.all(this._config.models.map(async m => {
        await this.db.index({
          index: m.name.toLowerCase(),
          body: {}
        });
      }));
    }
  }

  async connect(options: BrixConfig['dbConnection']) {
    await this._build(options);
    // TODO: Add ID to each insert
  }


  async disconnect() {
    if (this.db) await this.db.close();
  }

  model<T>(name: string) {
    return new ElasticModel<T>(name.toLowerCase(), this.db) as BrixStoreModel<T>;
  }
}
