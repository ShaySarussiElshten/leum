import { createValidator } from 'express-joi-validation';
import { messageController } from '@gateway/controller/message';
import { ROUTES } from '@gateway/enum';
import express, { Router } from 'express';
import { messageSchema } from '@gateway/schema/message';

const router: Router = express.Router();
const validator = createValidator({});

const messageRoutes = (): Router => {
  router.get(ROUTES.GET_MESSAGE_BY_ID, messageController.getMessageById);
  router.get(ROUTES.GET_ALL_MESSAGES, messageController.getAllMessages);
  router.post(ROUTES.GET_ALL_MESSAGES,validator.body(messageSchema), messageController.createMessage);
  
  return router;
};

export { messageRoutes };