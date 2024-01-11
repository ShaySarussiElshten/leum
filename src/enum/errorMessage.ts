import { SERVER_PORT } from '@gateway/server';

export enum ErrorMessage {
    MONGO_NOT_INIT = 'MongoDBDAO is not initialized',
    COLLECTION_NOT_INIT = 'Collection is not initialized',
    INVALID_OBJECT_MONGO_ID = 'Invalid ObjectId'
}

export enum SuccessMessage {
    MONGO_CONNECTION_DB = 'Connected to Database',
}

export enum ServerMessage{
    START_HTTP_SERVER_EROOR = 'startHttpServer() error method:',
    START_SERVER_EROOR = 'startServer() error method:',
    SERVER_RUNINNG = `running on port ${SERVER_PORT}`,
    SERVER_RUNINNG_PROCESS_ID = 'server has started with process id',
    ENDPOINT_NOT_EXIST = 'endpoint does not exist',
    GENERAL_ERROR = 'Error occurred.',
    DATABAE_CONNECTION = 'databaseConnection() method error'
}