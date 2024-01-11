import http from 'http';

import 'express-async-errors';
import { winstonLogger } from '@gateway/general-utils/logger';
import { Application, Request, Response, json, urlencoded, NextFunction } from 'express';
import { Logger } from 'winston';
import cookieSession from 'cookie-session';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import { config } from '@gateway/config';
import { isAxiosError } from 'axios';
import { CustomError, IErrorResponse } from '@gateway/general-utils/error-handler';
import { appRoutes } from '@gateway/app-routes';
import { Enviroments, ServerConfig, ServerMessage, MethodsAPI, LogLevel } from '@gateway/enum';

export const SERVER_PORT = 4000;
const DEFAULT_ERROR_CODE = 500;
const SERVER_NAME = 'GatewayService';
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');


export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [''],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== Enviroments.DEVELOPMENT,
        ...(config.NODE_ENV !== Enviroments.DEVELOPMENT && {
          sameSite: 'none',
        }),
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
      origin: config.CLIENT_URL,
      credentials: true,
      methods: [
        MethodsAPI.GET,
        MethodsAPI.POST,
        MethodsAPI.PUT,
        MethodsAPI.DELETE,
        MethodsAPI.OPTIONS,
      ],
    }));

    app.use((req: Request, _res: Response, next: NextFunction) => {
      //if (req.session?.jwt) {}
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: ServerConfig.BODY_LIMIT }));
    app.use(urlencoded({ extended: true, limit: ServerConfig.BODY_LIMIT }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }
 

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log(LogLevel.ERROR, `${fullUrl} ${ServerMessage.ENDPOINT_NOT_EXIST}`, '');
      res.status(StatusCodes.NOT_FOUND).json({ message: `${fullUrl} ${ServerMessage.ENDPOINT_NOT_EXIST}` });
      next();
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        log.log(LogLevel.ERROR, `${SERVER_NAME} ${error.comingFrom}:`, error);
        res.status(error.statusCode).json(error.serializeErrors());
      }

      if (isAxiosError(error)) {
        log.log(LogLevel.ERROR, `${SERVER_NAME} Axios Error - ${error?.response?.data?.comingFrom}:`, error);
        res.status(error?.response?.data?.statusCode ??
          DEFAULT_ERROR_CODE).json({ message: error?.response?.data?.message ?? ServerMessage.GENERAL_ERROR });
      }

      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.log(LogLevel.ERROR, `${SERVER_NAME} ${ServerMessage.START_HTTP_SERVER_EROOR}`, error);
    }
  }
  

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`${SERVER_NAME} ${ServerMessage.SERVER_RUNINNG_PROCESS_ID} ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`${SERVER_NAME} ${ServerMessage.SERVER_RUNINNG}`);
      });
    } catch (error) {
      log.log(LogLevel.ERROR, `${SERVER_NAME} ${ServerMessage.START_HTTP_SERVER_EROOR}`, error);
    }
  }

}