import { BrixConfig } from '@brix/core';
import { BrixModelFieldMetadata, BrixStore, BrixStoreBuildOptions, FieldType, BrixStoreModel } from '@brix/model';
import Seq, { BIGINT, DataType, ModelAttributeColumnOptions, ModelAttributes, Sequelize } from 'sequelize';

import { SequelizeModel } from './Model';

// @ts-ignore Workaround for overriding default promise library in Sequelize
Sequelize.Promise = global.Promise;


export class SequelizeStore implements BrixStore {
  db: Sequelize;
  models: { [key: string]: any } = {};
  private _config: BrixStoreBuildOptions;

  build(options: BrixStoreBuildOptions) {
    this._config = options;
    return this;
  }

  private _build(options: Seq.Options) {
    this.db = new Sequelize({
      logging: false,
      define: {
        paranoid: true
      },
      ...options
    });


    if (this._config.models) {
      this._config.models.forEach(m => {
        let fields: ModelAttributes = {};
        if (m.fields) {
          fields = m.fields.reduce((fields, f) => {
            fields[f.name] = fieldMetadataToAttribute(f);
            return fields;
          }, {} as ModelAttributes);
        }

        this.models[m.name] = this.db.define(m.name, fields);
      });
    }
  }

  async connect(options: BrixConfig['dbConnection']) {

    this._build(options);

    this.db.beforeDefine(attrs => {
      // Define default ID on all models
      attrs.id = {
        autoIncrement: true,
        primaryKey: true,
        type: BIGINT
      };
    });

    await this.db.authenticate();
    await this.db.sync({ alter: true });
  }


  async disconnect() {
    if (this.db) await this.db.close();
  }

  model<T>(name: string) {
    const model = this.db.model(name);
    return new SequelizeModel<T>(model) as BrixStoreModel<T>;
  }
}


const fieldMetadataToAttribute = (
  metadata: BrixModelFieldMetadata
): DataType | ModelAttributeColumnOptions => {
  return {
    type: metadataTypeToSeqType(metadata.type),
    defaultValue: metadata.default,
    allowNull: metadata.nullable
  };
};


const metadataTypeToSeqType = (type: FieldType): DataType => {
  switch (type) {
    case FieldType.STRING:
      return Seq.STRING;
    case FieldType.TEXT:
      return Seq.TEXT;
    case FieldType.INTEGER:
      return Seq.INTEGER;
    case FieldType.FLOAT:
      return Seq.FLOAT;
    case FieldType.REAL:
      return Seq.REAL;
    case FieldType.DOUBLE:
      return Seq.DOUBLE;
    case FieldType.DECIMAL:
      return Seq.DECIMAL;
    case FieldType.DATE:
      return Seq.DATE;
    case FieldType.BOOLEAN:
      return Seq.BOOLEAN;
    case FieldType.ENUM:
      return Seq.ENUM;
    case FieldType.JSON:
      return Seq.JSON;
    case FieldType.JSONB:
      return Seq.JSONB;
    case FieldType.BLOB:
      return Seq.BLOB;
    case FieldType.UUID:
      return Seq.UUID;
  }
};
