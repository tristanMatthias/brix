import { ModelBuilder } from '../ModelBuilder';

// tslint:disable function-name
export interface ModelOptions {
  /** Name of the database model */
  name?: string;
}

/**
 * Generate a new database model/table from the class. To be used in combination
 * with the `@Field()` decorator
 */
export function Model(): ClassDecorator;
/**
 * Generate a new database model/table from the class. To be used in combination
 * with the `@Field()` decorator
 * @param options `ModelOptions to apply for the model
 */
export function Model(options: ModelOptions): ClassDecorator;
/**
 * Generate a new database model/table from the class. To be used in combination
 * with the `@Field()` decorator
 * @param name Name of the database model
 * @param options `ModelOptions to apply for the model
 */
export function Model(name?: string, options?: ModelOptions): ClassDecorator;
export function Model(
  nameOrOptions?: string | ModelOptions,
  maybeOptions?: ModelOptions
): ClassDecorator {
  let name: string;
  let options: ModelOptions | undefined;

  if (typeof nameOrOptions === 'string') {
    name = nameOrOptions;
    options = maybeOptions;
  } else if (nameOrOptions) {
    options = nameOrOptions;
    if (options.name) name = options.name;
  }

  return target => {
    if (!name) name = target.name;
    ModelBuilder.collectModelMetadata({
      target,
      name
    });
  };
}
