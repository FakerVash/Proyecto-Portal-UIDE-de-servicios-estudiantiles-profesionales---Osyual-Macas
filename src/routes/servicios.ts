import { FastifyPluginAsync } from 'fastify';
import { ServicioController } from '../controllers/servicio.controller.js';
import { checkAdmin, checkEstudiante } from '../plugins/auth.js';

const servicioRoutes: FastifyPluginAsync = async (fastify, opts) => {
    // GET /servicios
    fastify.get('/', {
        schema: {
            description: 'Obtener todos los servicios con filtros',
            tags: ['Servicios'],
            querystring: {
                type: 'object',
                properties: {
                    categoria: { type: 'integer' },
                    buscar: { type: 'string' }
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: { $ref: 'Servicio#' }
                }
            }
        }
    }, ServicioController.getAll);

    // POST /servicios
    fastify.post('/', {
        schema: {
            description: 'Crear un nuevo servicio',
            tags: ['Servicios'],
            body: { $ref: 'Servicio#' },
            response: {
                201: { $ref: 'Servicio#' }
            }
        }
    }, ServicioController.create);

    // PATCH /servicios/:id (Edit my service)
    fastify.patch('/:id', {
        preHandler: [checkEstudiante],
        schema: {
            description: 'Editar mi propio servicio (Dueño)',
            tags: ['Servicios'],
            params: { type: 'object', properties: { id: { type: 'integer' } } },
            body: { $ref: 'Servicio#' },
            response: { 200: { $ref: 'Servicio#' } }
        }
    }, ServicioController.update);

    // DELETE /servicios/:id (Admin Only)
    fastify.delete('/:id', {
        preHandler: [checkAdmin],
        schema: {
            description: 'Eliminar un servicio (Admin)',
            tags: ['Moderación'],
            params: { type: 'object', properties: { id: { type: 'integer' } } },
            response: { 204: { type: 'null' } }
        }
    }, ServicioController.delete);
};

export default servicioRoutes;
