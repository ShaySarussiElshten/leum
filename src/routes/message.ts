
import { messageController } from '@gateway/controller/message';
import express, { Router } from 'express';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/message/:id', messageController.getAllMessages);
  router.get('/message', messageController.getMessageById);
  return router;
};

export { messageRoutes };