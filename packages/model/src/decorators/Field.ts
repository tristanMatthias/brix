import { ErrorInvalidType } from '../errors';
import { convertPrimitiveType } from '../lib/convertPrimitiveType';
import { ModelBuilder } from '../ModelBuilder';
import { MethodAndPropDecorator } from '../metadata';

export const allowedTypes: Function[] = [String, Number, Date, Boolean];
export const bannedTypes: Function[] = [Promise, Array, Object, Function];


export type ModelFieldOptions = {
  /** Type of data  */
  type?: FieldType
  /** Default value of th field */
  default?: any;
  /** Allow the field to be null */
  nullable?: boolean;
};

export enum FieldType {
  STRING = 'STRING',                       // VARCHAR(255)
  TEXT = 'TEXT',                           // TEXT
  INTEGER = 'INTEGER',                     // INTEGER
  FLOAT = 'FLOAT',                         // FLOAT
  REAL = 'REAL',                           // REAL        PostgreSQL only.
  DOUBLE = 'DOUBLE',                       // DOUBLE
  DECIMAL = 'DECIMAL',                     // DECIMAL
  DATE = 'DATE',                           // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
  BOOLEAN = 'BOOLEAN',                     // TINYINT(1)
  ENUM = 'ENUM',
  JSON = 'JSON',                           // JSON column. PostgreSQL, SQLite and MySQL only.
  JSONB = 'JSONB',                         // JSONB column. PostgreSQL only.
  BLOB = 'BLOB',                           // BLOB (bytea for PostgreSQL)
  UUID = 'UUID'                            // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: UUIDV1 or UUIDV4 to make sequelize generate the ids automatically)
}

export enum MetadataKey {
  /** Type of property */
  property = 'design:type',
  /** Return type of function */
  return = 'design:returntype',
  /** Parameter types */
  params = 'design:paramtypes'
}


/**
 * Assign a database field for a property on a class decorated with the `@Model`
 * decorator
 */
export function ModelField(): MethodAndPropDecorator;
/**
 * Assign a database field for a property on a class decorated with the `@Model`
 * decorator
 * @param type `FieldType` to assign to the database
 */
export function ModelField(type: FieldType): MethodAndPropDecorator;
/**
 * Assign a database field for a property on a class decorated with the `@Model`
 * decorator
 * @param options `ModelFieldOptions` to apply on the field
 */
export function ModelField(options: ModelFieldOptions): MethodAndPropDecorator;
/**
 * Assign a database field for a property on a class decorated with the `@Model`
 * decorator
 * @param type `FieldType` to assign to the database
 * @param options `ModelFieldOptions` to apply on the field
 */
export function ModelField(
  typeOrOptions?: FieldType | ModelFieldOptions,
  maybeOptions?: ModelFieldOptions
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, _descriptor) => {
    let type: FieldType | undefined;
    let options: ModelFieldOptions | undefined;

    if (typeof typeOrOptions === 'string') {
      type = typeOrOptions;
      options = maybeOptions;
    } else if (typeOrOptions) {
      options = typeOrOptions;
      if (options.type) type = options.type;
    }

    if (!type) {
      const reflctedType = Reflect.getMetadata(MetadataKey.property, prototype, propertyKey);
      if (bannedTypes.includes(reflctedType as Function)) {
        throw new ErrorInvalidType(prototype.constructor.name, propertyKey as string, type!);
      } else {
        type = convertPrimitiveType(reflctedType) as FieldType;
      }

    }

    ModelBuilder.collectModelFieldMetadata({
      ...options,
      target: prototype.constructor,
      name: propertyKey as string,
      type: type!
    });
  };
}
