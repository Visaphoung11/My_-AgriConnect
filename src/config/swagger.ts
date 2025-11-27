import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AgriConnect API",
      version: "1.0.0",
      description: "API documentation for AgriConnect",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterUser: {
          type: "object",
          required: [
            "email",
            "password",
            "firstName",
            "lastName",
            "age",
            "phone",
          ],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            age: { type: "number", example: 25 },
            phone: { type: "string", example: "+85512345678" },
          },
        },

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@example.com" },
            password: { type: "string", example: "chang123456" },
          },
        },
      },
    },
  },

 
apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
