const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BarberApp API',
      version: '1.0.0',
      description: 'API para gestión de barbería',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.barberapp.com' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo',
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
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso no válido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensaje: {
                    type: 'string',
                    example: 'No hay token, autorización denegada'
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'No tiene permisos para realizar esta acción',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensaje: {
                    type: 'string',
                    example: 'No tiene permisos para realizar esta acción'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        msg: {
                          type: 'string'
                        },
                        param: {
                          type: 'string'
                        },
                        location: {
                          type: 'string'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        BadRequestError: {
          description: 'Datos inválidos en la petición',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string'
            },
            error: {
              type: 'object'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalCortes: {
              type: 'number'
            },
            ingresoTotal: {
              type: 'number'
            },
            cortesRecientes: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Corte'
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: [],
    }],
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints relacionados con autenticación y autorización'
      },
      {
        name: 'Clientes',
        description: 'Gestión de clientes'
      },
      {
        name: 'Cortes',
        description: 'Gestión de cortes de pelo'
      },
      {
        name: 'Dashboard',
        description: 'Estadísticas y reportes'
      },
      {
        name: 'Perfil',
        description: 'Gestión del perfil de usuario'
      },
      {
        name: 'Sistema',
        description: 'Endpoints del sistema'
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 