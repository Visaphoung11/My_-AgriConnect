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
        // Represents a user along with the roles assigned to them
        UserWithRoles: {
          type: "object",
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
            email: { type: "string", example: "user@example.com" },
            username: { type: "string", example: "john_doe" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            age: { type: "number", example: 25 },
            phone: { type: "string", example: "+85512345678" },
            createdAt: { type: "string", example: "2024-06-01T12:00:00.000Z" },
            updatedAt: { type: "string", example: "2024-06-15T08:30:00.000Z" },
            roles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "675f1a2b3c4d5e6f7a8b9c0e" },
                  name: { type: "string", example: "ADMIN" },
                },
              },
            },
          },
        },
        // Request body for assigning or removing a role from a user
        AssignRoleRequest: {
          type: "object",
          required: ["userId", "roleId"],
          properties: {
            userId: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
            roleId: { type: "string", example: "675f1a2b3c4d5e6f7a8b9c0e" },
          },
        },
        // Role entity
        Role: {
          type: "object",
          properties: {
            _id: { type: "string", example: "675f1a2b3c4d5e6f7a8b9c0e" },
            name: { type: "string", example: "ADMIN" },
            createdAt: { type: "string", example: "2024-06-01T12:00:00.000Z" },
            updatedAt: { type: "string", example: "2024-06-15T08:30:00.000Z" },
          },
        },
        // Request body for creating a role
        RoleInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "STAFF" },
            description: { type: "string", example: "Staff role" },
          },
        },
        // Response shape for create role
        RoleResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Role created successfully" },
            role: { $ref: "#/components/schemas/Role" },
          },
        },
        // Generic error response
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Something went wrong" },
            status: { type: "integer", example: 400 },
            error: { type: "string", example: "Role already exists" },
          },
        },
        // Product entity used in product routes
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "689f1a2b3c4d5e6f7a8b9c0f" },
            name: { type: "string", example: "Organic Mango" },
            description: {
              type: "string",
              example: "Sweet and fresh organic mangoes",
            },
            price: { type: "number", example: 5.99 },
            stock: { type: "integer", example: 120 },
            categoryId: { type: "string", example: "688f1a2b3c4d5e6f7a8b9c0e" },
            images: {
              type: "array",
              items: {
                type: "string",
                example: "https://example.com/image.jpg",
              },
            },
            createdAt: { type: "string", example: "2024-06-01T12:00:00.000Z" },
            updatedAt: { type: "string", example: "2024-06-15T08:30:00.000Z" },
          },
        },
        // Category entity used in category routes
        Category: {
          type: "object",
          properties: {
            _id: { type: "string", example: "688f1a2b3c4d5e6f7a8b9c0e" },
            name: { type: "string", example: "Fruits" },
            description: { type: "string", example: "Fresh fruit products" },
            createdAt: { type: "string", example: "2024-06-01T12:00:00.000Z" },
            updatedAt: { type: "string", example: "2024-06-15T08:30:00.000Z" },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
