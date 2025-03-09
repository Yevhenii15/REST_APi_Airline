import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

/**
 * Setup Swagger documentation
 * @param app
 */
export function setupDocs(app: Application) {
  // swagger definition
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Title",
      version: "1.0.0",
      description: "Description",
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
          name: "auth-token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            password: { type: "string" },
            dateOfBirth: { type: "string" },
          },
        },
        Route: {
          type: "object",
          properties: {
            route_id: { type: "string" },
            departureAirport_id: { type: "string" },
            arrivalAirport_id: { type: "string" },
            duration: { type: "string" },
          },
        },
        Flight: {
          type: "object",
          properties: {
            flightNumber: { type: "string" },
            departureTime: { type: "string", format: "date-time" },
            arrivalTime: { type: "string", format: "date-time" },
            status: { type: "string" },
            seatsAvailable: { type: "integer" },
            route: { $ref: "#/components/schemas/Route" },
            aircraft_id: { type: "string" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            totalPrice: { type: "number" },
            bookingDate: { type: "string", format: "date-time" },
            numberOfTickets: { type: "integer" },
            bookingStatus: { type: "string" },
            tickets: { type: "array", items: { type: "object" } },
            user_id: { type: "string" },
          },
        },
        Ticket: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            ticketPrice: { type: "number" },
            gender: { type: "string" },
            seat: { type: "object" },
            flight_id: { type: "string" },
          },
        },
      },
    },
  };

  // swagger options
  const options = {
    swaggerDefinition,
    // Path to the files containing OpenAPI definitions
    apis: ["**/*.ts"],
  };

  // swagger spec
  const swaggerSpec = swaggerJSDoc(options);

  // create docs route
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
