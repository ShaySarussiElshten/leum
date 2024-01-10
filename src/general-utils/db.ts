import { Db, MongoClient, } from 'mongodb';
import { config } from '@gateway/config';
import { Logger } from 'winston';

import { winstonLogger } from './logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatDatabaseServer', 'debug');


export class DbConnection {

    private dbName: string;

    constructor(dbName:string){
      this.dbName = dbName;
    }

    async createMongoConnection(): Promise<Db | null> {
        
    
            try {
                const mongoHost = 'db';
                const client = await MongoClient.connect(`mongodb://${mongoHost}:27017/${this.dbName}`);
                log.info('Connected to Database');
                return client.db(this.dbName);
            } catch (error) {
                log.log('error', 'databaseConnection() method error:', error);
            }

            return null;
    }
      
    
}
