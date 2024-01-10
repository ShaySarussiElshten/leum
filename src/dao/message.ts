import { DbConnection } from '@gateway/general-utils/db';
import { InternalServerError, ServerError } from '@gateway/general-utils/error-handler';
import { Collection, Db, ObjectId, FindOneAndUpdateOptions } from 'mongodb';


export class MongoDBDAO {
  private collection: Collection | undefined;
  private db: Db | null = null;

  constructor(private collectionName: string) {}

  async initialize(): Promise<void> {
    const dbConnection = new DbConnection("myDbName");
    this.db = await dbConnection.createMongoConnection();
    if (!this.db) 
       throw new ServerError('Database connection failed', 'MongoDBDAO');
    
    this.collection = this.db.collection(this.collectionName);
  }

  async insertOne(document: object): Promise<ObjectId> {
    if (!this.collection) 
        {throw new ServerError('Collection is not initialized','MongoDBDAO');}
    
    const result = await this.collection.insertOne(document);
    return result.insertedId;
  }

  async findOneAndUpdate(
    filter: object, 
    update: object, 
    options?: FindOneAndUpdateOptions
  ): Promise<object | null> {
    if (!this.collection) {
        throw new InternalServerError('Collection is not initialized','MongoDBDAO');
    }
    const result = await this.collection.findOneAndUpdate(
      filter, 
      { $set: update }, 
      { ...options, returnDocument: 'after' }
    );
    return result;
  }

  async updateById(id: string, newValues: object): Promise<object | null> {
    if (!ObjectId.isValid(id)) 
      {throw new ServerError('Invalid ObjectId','MongoDBDAO');} 
    
    
    // Using the findOneAndUpdate method within the updateById method
    const result = await this.findOneAndUpdate(
      { _id: new ObjectId(id) }, 
      newValues, 
      { returnDocument: 'after' }
    );
    return result;
  }

  async findOne(document: object): Promise<object | null> {
    if (!this.collection) 
        {throw new InternalServerError('Collection is not initialized','MongoDBDAO');}
    
    return await this.collection.findOne(document);
  }

  async findAll(): Promise<object[]> {
    if (!this.collection) 
        {throw new InternalServerError('Collection is not initialized','MongoDBDAO');}
    
    return await this.collection.find().toArray();
  }

  async findById(id: string): Promise<object | null> {
    if (!ObjectId.isValid(id)) 
        {throw new ServerError('Invalid ObjectId','MongoDBDAO');}
    
    if (!this.collection) 
        {throw new InternalServerError('Collection is not initialized','MongoDBDAO');}
    
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async deleteById(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) 
        {throw new ServerError('Invalid ObjectId','MongoDBDAO');} 

    if (!this.collection) 
        {throw new InternalServerError('Collection is not initialized','MongoDBDAO');}
    
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}


