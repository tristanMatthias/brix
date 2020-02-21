import { BrixStoreModel, BrixStoreModelFindOptions } from '@brix/model';
import Seq from 'sequelize';
import { FindOptions } from 'sequelize/types';

export class SequelizeModel<T> implements BrixStoreModel<T> {

  constructor(
    private _seqModel: Seq.ModelCtor<Seq.Model<T, any>>) { }

  async findAll() {
    return (await this._seqModel.findAll()) as unknown as T[];
  }

  async create(data: object) {
    return (await this._seqModel.create(data)) as unknown as T;
  }

  async findById(id: string) {
    return (await this._seqModel.findByPk(id)) as unknown as T;
  }

  async findOne(options: BrixStoreModelFindOptions<T>) {
    return (await this._seqModel.findOne(options as FindOptions)) as unknown as T;
  }
}
