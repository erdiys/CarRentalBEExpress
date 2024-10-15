const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Car Rental",
    description: "API for car rental service",
    version: "1.0.0"
  },
  host: "http://localhost:3000/api/v1",
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const outputFile = "../../swagger-autogen.json";
const routes = ["../../index.js"];

swaggerAutogen(outputFile, routes, doc);
