import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messageService } from '@gateway/services/message';


class MessageController {

    async getMessageById  (req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const respone  = await messageService.getMessageById(id);
        res.status(StatusCodes.OK).json(respone);
    };

    async getAllMessages  (req: Request, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({ message: []});
    };

}

export const messageController: MessageController = new MessageController();


