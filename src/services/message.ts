import { MongoDBDAO } from '@gateway/dao/message';
import { ErrorMessage } from '@gateway/enum';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


const COLLECTION_NAME = 'messages';
const DB_NAME = 'myDbName';

class MessageService {

  private mongoDBDAO: MongoDBDAO | null = null;

  constructor(mongoDBDAO: MongoDBDAO) {
    this.mongoDBDAO = mongoDBDAO;
  }

  public async initializeDb(): Promise<void> {
    if (this.mongoDBDAO) {
      await this.mongoDBDAO.initialize(DB_NAME);
    } else {
      throw new Error(ErrorMessage.MONGO_NOT_INIT);
    }
  }

  public async getMessageById(id: string): Promise<string> {
    return `${id}%%%%%%%%%`;
  }

  public async getAllMessages(req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: [] });
  }
}

export const messageService = new MessageService(
  new MongoDBDAO(COLLECTION_NAME),
);
messageService.initializeDb();


