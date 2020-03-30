import { BrixConfig } from '@brix/core';

import { BrixModelFieldMetadata, BrixModelMetadata } from './metadata';

/**
 * Data to collect for building models.
 * Passed to `BrixStore.build()` from `ModelBuilder`
 */
export interface BrixStoreBuildOptions {
  models?: BrixModelMetadata[];
  fields?: BrixModelFieldMetadata[];
}


/**
 * An standardized instance of a plugin adapter to a database or data store.
 * This is typically used when writing a new database plugin, implementing
 * each of the functions and properties described here so the rest of Brix can
 * interact with the plugin in a standard way.
 */
export interface BrixStore<T extends any = any> {
  db: T;
  /**
   * Called by `ModelBuilder` with the metadata collected
   * @param data Metadata collected from decorators and plugins to build the models
   */
  build(data: BrixStoreBuildOptions): BrixStore<T>;
  /**
   * Connect to the store/database
   * @param config Store connection details
   */
  connect(config: BrixConfig['dbConnection']): any;
  /**
   * Disconnect from the store/database
   */
  disconnect(): any;
  /**
   * Lookup a model on the store
   * @param name Model name
   */
  model<T, AdapterOptions extends BrixStoreAdapterOptions = {}>(name: string): BrixStoreModel<T, AdapterOptions>;
}

export interface BrixStoreAdapterOptions {
  [key: string]: any;
}

/**
 * An standardized instance of an individual model in Brix.
 * Created with the `@Model` decorator
 */
export type BrixStoreModel<T, AdapterOptions extends BrixStoreAdapterOptions = {}> = {
  /** Find all records of the model */
  findAll(adapterOptions?: AdapterOptions): Promise<T[]>
  /** Create a new record */
  create(data: Partial<T>, adapterOptions?: AdapterOptions): Promise<T>
  /** Bulk create new records */
  bulkCreate(values: Partial<T>[], adapterOptions?: AdapterOptions): Promise<T[]>;
  /** Find a record by the primary key */
  findById(id: string, adapterOptions?: AdapterOptions): Promise<T | null>
  /** Find a record with filter options */
  findOne(options: BrixStoreModelFindOptions<T>, adapterOptions?: AdapterOptions): Promise<T | null>;
  /** Delete a record by the ID */
  deleteById(id: string, adapterOptions?: AdapterOptions): Promise<boolean>;
  /** Update a record by the ID */
  updateById(id: string, values: Partial<T>, adapterOptions?: AdapterOptions): Promise<T | null>;
};

/**
 * Options to filter for queries on `BrixStoreModel`
 */
export interface BrixStoreModelFindOptions<T> {
  /** Filter for properties of the Model */
  where: Partial<{
    [key in keyof T]: string | number | boolean
  }>;
}

/**
 * Global store instanced used in Brix
 */
export let Store: BrixStore;

/**
 * Set the global `BrixStore`
 * @param store BrixStore to set as global
 */
export const setStore = (store: BrixStore) => Store = store;
/**
 * Get the global `BrixStore`
 */
export const getStore = <T extends any = any>() => Store as BrixStore<T>;
