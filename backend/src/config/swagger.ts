import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Club Socios API',
      version: '1.0.0',
      description: 'API para la gestión de socios del Club',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      schemas: {
        Socio: {
          type: 'object',
          required: ['dni', 'nombre', 'apellido', 'fechaIngreso', 'estado', 'tipo'],
          properties: {
            id: { type: 'string', description: 'ID único del socio (UUID)' },
            dni: { type: 'string', description: 'DNI del socio' },
            nombre: { type: 'string', description: 'Nombre del socio' },
            apellido: { type: 'string', description: 'Apellido del socio' },
            email: { type: 'string', description: 'Email del socio' },
            telefono: { type: 'string', description: 'Teléfono del socio' },
            fechaNacimiento: { type: 'string', format: 'date', description: 'Fecha de nacimiento' },
            direccion: { type: 'string', description: 'Dirección del socio' },
            fechaIngreso: { type: 'string', format: 'date', description: 'Fecha de ingreso al club' },
            estado: { type: 'string', enum: ['activo', 'inactivo', 'suspendido'], description: 'Estado actual' },
            tipo: { type: 'string', enum: ['activo', 'adherente'], description: 'Categoría del socio' },
            numeroSocio: { type: 'string', description: 'Número de socio asignado' },
            foto: { type: 'string', description: 'URL de la foto del socio' },
            observaciones: { type: 'string', description: 'Notas adicionales' },
            revisionMedicaVigente: { type: 'boolean', description: 'Si tiene la revisión médica al día' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
