import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriConnect API',
      version: '1.0.0',
      description: 'API documentation for AgriConnect - An agricultural products marketplace',
      contact: {
        name: 'AgriConnect Support',
        email: 'support@agriconnect.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        description: 'Current server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
       
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../models/*.ts')
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
