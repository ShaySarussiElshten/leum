import http from 'http';

import 'express-async-errors';
import { winstonLogger } from '@gateway/general-utils/logger';
import { Application, Request, Response, json, urlencoded, NextFunction } from 'express';
import { Logger } from 'winston';
import compression from 'compression';
import { config } from '@gateway/config';
import { appRoutes } from '@gateway/app-routes';
import {  ServerConfig, ServerMessage, LogLevel } from '@gateway/enum';
import { securityMiddleware } from '@gateway/configuration/security';
import { swaggerConfiguration } from '@gateway/configuration/swagger';
import { errorHandler } from '@gateway/configuration/errorHandler';


export const SERVER_PORT = 4000;
export const DEFAULT_ERROR_CODE = 500;
export const SERVER_NAME = 'GatewayService';
export const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');


export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.security(this.app);
    this.standardMiddleware(this.app);
    this.swaggerConfig(this.app);
    this.routesMiddleware(this.app);
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private security(app: Application): void {
    securityMiddleware(app)

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

  private swaggerConfig = (app: Application): void => {
     swaggerConfiguration(app)

  };
 

  private errorHandler(app: Application): void {
     errorHandler(app)
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


