import { FastifyPluginAsync } from 'fastify';
import { NotificacionController } from '../controllers/notificacion.controller.js';

const notificacionRoutes: FastifyPluginAsync = async (fastify, opts) => {
    // GET /notificaciones
    fastify.get('/', {
        schema: {
            description: 'Obtener mis notificaciones',
            tags: ['Notificaciones'],
            response: {
                200: {
                    type: 'array',
                    items: { $ref: 'Notificacion#' }
                }
            }
        }
    }, NotificacionController.getMyNotificaciones);

    // PATCH /notificaciones/:id/leido
    fastify.patch('/:id/leido', {
        schema: {
            description: 'Marcar notificación como leída',
            tags: ['Notificaciones'],
            params: { type: 'object', properties: { id: { type: 'integer' } } },
            response: { 200: { $ref: 'Notificacion#' } }
        }
    }, NotificacionController.markAsRead);

    // DELETE /notificaciones/:id
    fastify.delete('/:id', {
        schema: {
            description: 'Eliminar notificación',
            tags: ['Notificaciones'],
            params: { type: 'object', properties: { id: { type: 'integer' } } },
            response: { 204: { type: 'null' } }
        }
    }, NotificacionController.delete);
};

export default notificacionRoutes;
