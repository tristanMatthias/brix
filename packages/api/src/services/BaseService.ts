import { BuildOptions } from 'sequelize';

import { ErrorResourceNotFound, handleSequelizeError } from '../errors';
import { BaseModel } from '../models/BaseModel';


/** * Base GraphQL service class. */
export class BaseService<
  T extends BaseModel<any>,
  CreateInput,
  UpdateInput extends { id: string, [key: string]: any },
  FindAllArgs = { id: string },
  > {
  constructor(
    public model: typeof BaseModel
  ) { }

  /**
   * Find a resource by running `findOne` method on the model.
   * @param id ID of the resource
   * @param throwError Throws an `ErrorResourceNotFound` if resource is not found
   */
  async findById(id: string, throwError = true): Promise<T | null> {
    const resource = await this.model.findOne({
      where: { id }
    });
    if (!resource && throwError) throw new ErrorResourceNotFound(this.model.name, id);
    // @ts-ignore
    return resource;
  }

  /**
   * Finds all resources by running `findAll` method on the model.
   */
  async findAll({ }: FindAllArgs) {
    return await this.model.findAll() as T[];
  }

  /**
   * Creates a new resource with the supplied Sequelize model
   * @param input Data to create new resource with
   * @param opts Sequelize `BuildOptions`
   */
  async create(input: CreateInput, opts?: BuildOptions) {
    try {
      return await new this.model(input as unknown as object, opts).save() as T;
    } catch (e) {
      throw await handleSequelizeError(e);
    }
  }


  /**
   * Updates a resource by it's ID
   * @param update Update properties
   */
  async updateOne({ id, ...input }: UpdateInput) {
    const updated = await this.model.update(input, {
      where: { id },
      limit: 1,
      returning: true
    });

    if (updated[1]) return updated[1][0] as T;
    return null;
  }
}
