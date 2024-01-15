import cookieSession from "cookie-session";
import { Application } from "express";
import { config } from '@gateway/config';
import { Enviroments, MethodsAPI } from "@gateway/enum";
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';

export const securityMiddleware =(app: Application): void => {
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

}