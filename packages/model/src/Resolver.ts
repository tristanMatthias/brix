import { capitalize } from 'lodash';
import pluralize from 'pluralize';
import { Arg, Query, Resolver as TResolver, Mutation } from 'type-graphql';

import { getStore } from './Store';
import { Mixin } from 'ts-mixer';

export interface ResolverAuthOptions {
  findById?: boolean;
  findAll?: boolean;
  create?: boolean;
  bulkCreate?: boolean;
  deleteById?: boolean;
  updateById?: boolean;
}

export interface ResolverOptions<T extends any> {
  /** Entity to return from each mutation/query */
  entity: T;
  /** Entity to use as argument for create mutation */
  createInput?: any;
  /** Entity to use as argument for update mutation */
  updateInput?: any;
  /** Enable/disable delete mutation */
  deletable: boolean;
  /** Override the plural name of the entity for the list query */
  plural?: string;
  /** Override the model name to map the resolvers to */
  model?: string;
  auth?: boolean | ResolverAuthOptions;
}

/**
 * Automatically generate a resolver for a resource with queries and mutations,
 * mapped to the Store
 * Generates (for passed name `resource`):
 *  - `resource(id: String!)` query mapped to `findById` on the Store
 *  - `resources()` query mapped to `findAll` on the Store
 *  - `createResource()` mutation mapped to `create` on the Store
 *  - `updateResource()` mutation mapped to `updateById` on the Store
 *  - `deleteResource()` mutation mapped to `deleteById` on the Store
 * @param name Name of the resource/entity
 * @param options Resolver options to configure mutations and queries
 *
 * @usage
 * ```ts
 * export class UserResolver extends Resolver('user', {
 *  entity: EUser,
 *  createInput: ECreateUser,
 *  updateInput: EUpdateUser,
 *  deletable: true
 * })
 * ```
 */
export const Resolver = <T extends any>(name: string, options: ResolverOptions<T>): any => {
  const { entity, createInput, updateInput } = options;
  if (!entity) throw new Error(`Resolver '${name}' needs an entity`);
  const plural = options.plural || pluralize(name);
  const modelName = options.model || capitalize(pluralize.singular(name));


  // tslint:disable function-name

  @TResolver()
  class AutoResolverBase {
    model = getStore().model<T>(modelName);
    @Query(() => entity)
    async [name](
      @Arg('id') id: string
    ) { return this.model.findById(id); }

    @Query(() => [entity])
    async [plural]() { return this.model.findAll(); }

  }
  let returning = AutoResolverBase;

  // Add the `createResource` mutation to the resolver
  if (options.createInput) {
    class Create extends Mixin(returning) {
      model = getStore().model<T>(modelName);

      @Mutation(() => entity)
      async [`create${modelName}`](
        @Arg(name, () => createInput) value: T
      ) { return this.model.create(value); }
    }
    returning = Create;
  }

  // Add the `updateResource` mutation to the resolver
  if (options.updateInput) {
    class Update extends Mixin(returning) {
      model = getStore().model<T>(modelName);

      @Mutation(() => entity)
      async [`update${modelName}`](
        @Arg(name, () => updateInput) value: T
      ) { return this.model.updateById(value.id, value); }
    }
    returning = Update;
  }

  // Add the `deleteResource` mutation to the resolver
  if (options.deletable) {
    class Delete extends Mixin(returning) {
      model = getStore().model<T>(modelName);

      @Mutation(() => Boolean)
      async [`delete${modelName}`](
        @Arg('id') id: string
      ) { return this.model.deleteById(id); }
    }
    returning = Delete;
  }

  return returning;
};
