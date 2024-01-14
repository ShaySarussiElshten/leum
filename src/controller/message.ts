import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messageService } from '@gateway/services/message';


class MessageController {


  /**
   * @openapi
   * /api/v1/message/{id}:
   *   get:
   *     summary: Get a message by ID
   *     tags:
   *       - Messages
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the message to get.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: The message details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Message'
   */
  public async getMessageById  (req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const respone  = await messageService.getMessageById(id);
    res.status(StatusCodes.OK).json(respone);
  };

  /**
   * @openapi
   * /api/v1/message:
   *   get:
   *     summary: Get all messages
   *     tags:
   *       - Messages
   *     responses:
   *       200:
   *         description: A list of messages.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Message'
   */

  public async getAllMessages  (req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: [] });
  };

  /**
   * @openapi
   * /api/v1/message:
   *   post:
   *     summary: Create a new message
   *     tags:
   *       - Messages
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               age:
   *                 type: number
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: The created message.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Message'
   */

  public async createMessage (req: Request, res: Response): Promise<void>{
    const { name , age , content } = req.body;
    res.status(StatusCodes.OK).json({ name , age , content });
  }

}

export const messageController: MessageController = new MessageController();


