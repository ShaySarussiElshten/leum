import { Application } from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


export const swaggerConfiguration = (app: Application): void => {
    const options = {
      definition: {
        openapi: '3.0.0',
        
        info: {
          title: 'My API',
          version: '1.0.0',
        },
        components: {
          schemas: {
            Message: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                name: {
                  type: 'string',
                  example: 'John Doe',
                },
                age: {
                  type: 'integer',
                  example: 30,
                },
                content: {
                  type: 'string',
                  example: 'Hello, World!',
                },
              },
            },
          },
        },
        
      },
      // Path to the API docs
      apis: ['./src/controller/*.ts'], // change this path to where your route files are
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log(JSON.stringify(swaggerSpec, null, 2));


  };