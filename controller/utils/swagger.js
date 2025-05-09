const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenAPI Specification - BizdevSync',
      version: '1.0.0',
      description: 'OpenAPI documentation for the BizdevSync project',
      termsOfService: 'https://dodibo.com/terms',
      contact: {
        name: 'jotsamikael',
        email: 'jotsamikael@gmail.com',
        url: 'https://dodibo.com/'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8885/api',
        description: 'Local ENV.'
      },
      {
        url: 'https://your-production-url.com/api',
        description: 'Production ENV.'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      }
    }
  },
  apis: ['./routes/*.js', './controller/*.js'], // Swagger annotations source
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // JSON spec output (like Swagger JSON)
  app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
