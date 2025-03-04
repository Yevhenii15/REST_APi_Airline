import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

/**
 * Setup Swagger documentation
 * @param app Express application
 */
export function setupDocs(app: Application) {
  // Swagger definition
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Flight Management API",
      version: "1.0.0",
      description: "API documentation for user authentication and flight management",
    },
    servers: [
      {
        url: "http://localhost:4000/api/",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Enter your JWT token as 'Bearer <token>'",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            password: { type: "string" },
            dateOfBirth: { type: "string", format: "date" },
          },
        },
        LoginRequest: {
          type: "object",
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "mypassword123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            token: { type: "string" },
          },
        },
      },
    },
  };

  // Swagger options
  const options = {
    swaggerDefinition,
    apis: ["./routes/*.ts"], // Adjust path to match your route files
  };

  // Generate Swagger spec
  const swaggerSpec = swaggerJSDoc(options);

  // Setup Swagger UI
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("Swagger Docs available at http://localhost:4000/api/docs");
}
