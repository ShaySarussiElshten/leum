import { Db, MongoClient } from 'mongodb';
import { config } from '@gateway/config';
import { Logger } from 'winston';
import { LogLevel, ServerMessage, SuccessMessage } from '@gateway/enum';

import { winstonLogger } from './logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'DbConnection', 'debug');
export class DbConnection {

  private dbName: string;
  private readonly mongoHost:string = 'db';
  private connectionUrl:string;

  constructor(dbName:string){
    this.dbName = dbName;
    this.connectionUrl = `mongodb://${this.mongoHost}:27017/${this.dbName}`;
  }

  public async createMongoConnection(): Promise<Db | null> {
    try {
      const client = await MongoClient.connect(this.connectionUrl);
      log.info(SuccessMessage.MONGO_CONNECTION_DB);
      
      return client.db(this.dbName);
    } catch (error) {
      log.log(LogLevel.ERROR, ServerMessage.DATABAE_CONNECTION, error);
    }

    return null;
  }
      
    
}
