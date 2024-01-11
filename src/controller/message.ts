import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messageService } from '@gateway/services/message';


class MessageController {

  public async getMessageById  (req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const respone  = await messageService.getMessageById(id);
    res.status(StatusCodes.OK).json(respone);
  };

  public async getAllMessages  (req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: [] });
  };

  public async createMessage (req: Request, res: Response): Promise<void>{
    const { name , age , content } = req.body;
    res.status(StatusCodes.OK).json({ name , age , content });
  }

}

export const messageController: MessageController = new MessageController();


