import { Application } from 'express';
import { messageRoutes } from '@gateway/routes/message';


const BASE_PATH = '/api/v1';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH , messageRoutes());
};

export { appRoutes };