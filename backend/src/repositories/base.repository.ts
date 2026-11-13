import {
  Model,
  Document,
  UpdateQuery,
  QueryFilter,
} from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";
import { injectable } from "inversify";

@injectable()
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  find(filter: QueryFilter<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
  
  async updateOne(filter: QueryFilter<T>, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });
  }

}