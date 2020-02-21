import { BrixConfig } from '@brix/core';
import { ErrorNoStoreyRegistered, ErrorStoreAlreadyRegistered } from './errors';
import { BrixStore, setStore } from './Store';
import { BrixModelFieldMetadata, BrixModelMetadata, BrixModelRelationMetadata } from './metadata';

/**
 * Brix object to collect all decorator metadata for models, fields relations, etc
 * and generate a `BrixStore`
 */
export abstract class ModelBuilder {
  /** Metadata collected fromm the `@Model` decorator */
  static modelMetadata: BrixModelMetadata[] = [];
  /** Metadata collected fromm the `@Field` decorator */
  static fieldMetadata: BrixModelFieldMetadata[] = [];
  /** Metadata collected fromm the `@Relation` decorator */
  static relationMetadata: BrixModelRelationMetadata[] = [];

  private static _store: BrixStore;


  /**
   * Register a store plugin for the brix environment to use as the main database.
   * Can only be run once! Once a store type is registered, all of Brix will use
   * that store, therefore multiple stores are not supported.
   * @param store Brix store to register (EG: Sequelize, MongoDB, etc)
   */
  static registerStore(store: BrixStore) {
    if (this._store) throw new ErrorStoreAlreadyRegistered();
    this._store = store;

    setStore(this._store);
  }


  /**
   * Pass all metadata to the BrixStore for it to build the models
   */
  static async build() {
    if (!this._store) throw new ErrorNoStoreyRegistered();

    this.modelMetadata.forEach(m => {
      m.fields = this.fieldMetadata.filter(f => f.target === m.target);
    });

    return this._store.build({
      models: this.modelMetadata,
      fields: this.fieldMetadata
    });
  }

  /**
   * Connect to a store/database
   * @param config Store connection details
   */
  static connect(config: BrixConfig['dbConnection']) {
    this._store.connect(config);
  }
  /**
   * Disconnect from a store/database
   */
  static disconnect() {
    this._store.disconnect();
  }

  /** Collect model data to pass onto the BrixStore on `build()`. Typically used by the `@Model` decorator */
  static collectModelMetadata(model: BrixModelMetadata) {
    this.modelMetadata.push(model);
  }

  /** Collect field data to pass onto the BrixStore on `build()`. Typically used by the `@Field` decorator */
  static collectModelFieldMetadata(field: BrixModelFieldMetadata) {
    this.fieldMetadata.push(field);
  }

  /** Collect relation data to pass onto the BrixStore on `build()`. Typically used by the `@Relation` decorator */
  static collectRelationMetadata(field: BrixModelRelationMetadata) {
    this.relationMetadata.push(field);
  }
}
