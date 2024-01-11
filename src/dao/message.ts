import { ErrorMessage } from '@gateway/enum';
import { DbConnection } from '@gateway/general-utils/db';
import { InternalServerError, ServerError } from '@gateway/general-utils/error-handler';
import { Collection, Db, ObjectId, FindOneAndUpdateOptions } from 'mongodb';

const CLASS_NAME = 'MongoDBDAO';
export class MongoDBDAO {
  private collection: Collection | undefined;
  private db: Db | null = null;

  constructor(private collectionName: string) {}

  public async initialize(dbName:string): Promise<void> {
    const dbConnection = new DbConnection(dbName);
    this.db = await dbConnection.createMongoConnection();
    if (!this.db)
    {throw new ServerError(ErrorMessage.COLLECTION_NOT_INIT, CLASS_NAME);}
    
    this.collection = this.db.collection(this.collectionName);
  }

  public async insertOne(document: object): Promise<ObjectId> {
    if (!this.collection)
    {throw new ServerError(ErrorMessage.COLLECTION_NOT_INIT,CLASS_NAME);}
    
    const result = await this.collection.insertOne(document);
    
    return result.insertedId;
  }

  public async findOneAndUpdate(
    filter: object,
    update: object,
    options?: FindOneAndUpdateOptions,
  ): Promise<object | null> {
    if (!this.collection) {
      throw new InternalServerError(ErrorMessage.COLLECTION_NOT_INIT,CLASS_NAME);
    }
    const result = await this.collection.findOneAndUpdate(
      filter,
      { $set: update },
      { ...options, returnDocument: 'after' },
    );
    
    return result;
  }

  public async updateById(id: string, newValues: object): Promise<object | null> {
    if (!ObjectId.isValid(id))
    {throw new ServerError(ErrorMessage.INVALID_OBJECT_MONGO_ID,CLASS_NAME);}
    
    
    // Using the findOneAndUpdate method within the updateById method
    const result = await this.findOneAndUpdate(
      { _id: new ObjectId(id) },
      newValues,
      { returnDocument: 'after' },
    );
    
    return result;
  }

  public async findOne(document: object): Promise<object | null> {
    if (!this.collection)
    {throw new InternalServerError(ErrorMessage.INVALID_OBJECT_MONGO_ID,CLASS_NAME);}
    
    return await this.collection.findOne(document);
  }

  public async findAll(): Promise<object[]> {
    if (!this.collection)
    {throw new InternalServerError(ErrorMessage.INVALID_OBJECT_MONGO_ID,CLASS_NAME);}
    
    return await this.collection.find().toArray();
  }

  public async findById(id: string): Promise<object | null> {
    if (!ObjectId.isValid(id))
    {throw new ServerError(ErrorMessage.INVALID_OBJECT_MONGO_ID,CLASS_NAME);}
    
    if (!this.collection)
    {throw new InternalServerError(ErrorMessage.COLLECTION_NOT_INIT,CLASS_NAME);}
    
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async deleteById(id: string): Promise<void> {
    if (!ObjectId.isValid(id))
    {throw new ServerError(ErrorMessage.INVALID_OBJECT_MONGO_ID,CLASS_NAME);}

    if (!this.collection){
      throw new InternalServerError(ErrorMessage.COLLECTION_NOT_INIT,CLASS_NAME);
    }
    
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}


