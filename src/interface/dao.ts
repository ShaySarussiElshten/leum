import { Db, ObjectId } from 'mongodb';

export interface IDAO {
  insertOne(document: object): Promise<ObjectId>;
  findOne(document: object): Promise<object | null>;
  findAll(): Promise<object[]>;
  findById(id: string): Promise<object | null>;
  deleteById(id: string): Promise<void>;
  updateById(id: string, newValues: object): Promise<object | null>;
}