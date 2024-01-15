import { LogLevel, ServerMessage } from "@gateway/enum";
import { CustomError, IErrorResponse } from "@gateway/general-utils/error-handler";
import { DEFAULT_ERROR_CODE, SERVER_NAME, log } from "@gateway/server";
import { isAxiosError } from "axios";
import { Application } from "express";
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";




export const errorHandler =(app: Application): void => {
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