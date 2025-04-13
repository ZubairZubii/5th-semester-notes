const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User API',
    description: 'API for managing users, their watchlists, and more.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Server URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/user_Routes.js', './routes/auth_Routes.js'], // Path to your API routes files
};

const swaggerSpec = swaggerJSDoc(options);

// Use swagger UI to serve the documentation
module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
