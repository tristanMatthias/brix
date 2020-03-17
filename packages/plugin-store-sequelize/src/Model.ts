import { BrixStoreModel, BrixStoreModelFindOptions } from '@brix/model';
import Seq from 'sequelize';
import { FindOptions } from 'sequelize/types';

const globalOptions: FindOptions = { plain: true, raw: true };
export class SequelizeModel<T> implements BrixStoreModel<T> {

  constructor(
    private _seqModel: Seq.ModelCtor<Seq.Model<T, any>>) { }

  async findAll() {
    return (await this._seqModel.findAll()).map(i => i.toJSON()) as unknown as T[];
  }

  async create(data: object) {
    return (await this._seqModel.create(data, globalOptions)).toJSON() as unknown as T;
  }

  async bulkCreate(data: object[]) {
    return (await this._seqModel.bulkCreate(data, globalOptions)).map(r => r.toJSON()) as unknown as T[];
  }

  async findById(id: string) {
    return (await this._seqModel.findByPk(id))?.toJSON() as unknown as T;
  }

  async findOne(options: BrixStoreModelFindOptions<T>) {
    return (await this._seqModel.findOne({
      ...options as FindOptions
    }))?.toJSON() as unknown as T;
  }

  async deleteById(id: string) {
    return Boolean(await this._seqModel.destroy({ where: { id }, ...globalOptions }));
  }

  async updateById(id: string, values: Partial<T>) {
    await this._seqModel.update({ ...values }, { where: { id }, ...globalOptions });
    return this.findById(id);
  }
}
