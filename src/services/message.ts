import { MongoDBDAO } from '@gateway/dao/message';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class MessageService {
  private collectionName: string;
  private mongoDBDAO: MongoDBDAO | null = null;

  constructor(collectionName: string){
    this.collectionName = collectionName;
    this.mongoDBDAO = new MongoDBDAO(this.collectionName);
  }

  async initialize(): Promise<void> {
    if (this.mongoDBDAO) {
      await this.mongoDBDAO.initialize();
    } else {
      throw new Error('MongoDBDAO is not initialized');
    }
  }

  async getMessageById(id: string): Promise<string> {
    return `${id}%%%%%%%%%`; 
  }

  async getAllMessages(req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: [] });
  }
}

export const messageService = new MessageService('messages');
messageService.initialize();


