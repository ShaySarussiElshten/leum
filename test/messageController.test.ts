import { Request, Response } from 'express';
import { messageService } from '@gateway/services/message';
import { messageController } from '@gateway/controller/message';
import { StatusCodes } from 'http-status-codes';
import {expect, jest} from '@jest/globals';



jest.mock('@gateway/services/message', () => ({
  messageService: {
    getMessageById: jest.fn()
  }
}));

describe('MessageController', () => {
  describe('getMessageById', () => {
    it('should return message for given id', async () => {
      const mockRequest = {
        params: { id: '123' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const mockMessage = { id: '123', content: 'Hello' } as never;
      (messageService.getMessageById as jest.Mock).mockResolvedValue(mockMessage);

      await messageController.getMessageById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMessage);
      expect(messageService.getMessageById).toHaveBeenCalledWith('123');
    });
  });
});