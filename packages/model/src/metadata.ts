import { FieldType, ModelFieldOptions } from './decorators/Field';

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

/**
 * Data to collect for building models.
 * Passed to `BrixStore.build()` from `ModelBuilder`
 */
export interface BrixModelMetadata {
  /** Class the decorator applies to */
  target: Function | object;
  /** Name for the model */
  name: string;
  /** Fields collected by `ModelBuilder` using the `@Field` decorator */
  fields?: BrixModelFieldMetadata[];
}

/**
 * Data to collect for building fields and assigning to models.
 * Passed to `BrixStore.build()` from `ModelBuilder`
 */
export interface BrixModelFieldMetadata extends ModelFieldOptions {
  /** Class the decorator applies to. Used to match fields to models */
  target: Function | object;
  /** Name of the field */
  name: string;
  /** Datatype of the field */
  type: FieldType;
}

/** Type of model relation */
export enum BrixModelRelationType {
  belongsTo = 'belongsTo',
  hasOne = 'hasOne',
  hasMany = 'hasMany'
}

/** Thunk for resolving a relation target */
export type BrixModelThunkRelation = () => Function;

/**
 * Data to collect for building model relations.
 * Passed to `BrixStore.build()` from `ModelBuilder`
 */
export interface BrixModelRelationMetadata {
  type: BrixModelRelationType;
  from: Function;
  to: BrixModelThunkRelation;
}
