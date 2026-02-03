import { FastifyPluginAsync } from 'fastify';
import { MensajeController } from '../controllers/mensaje.controller.js';

const mensajeRoutes: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/', {
        schema: {
            description: 'Obtener mis conversaciones (Privado)',
            tags: ['Mensajería'],
            headers: { type: 'object', properties: { 'x-usuario-id': { type: 'string' } } },
            response: { 200: { type: 'array', items: { $ref: 'Mensaje#' } } }
        }
    }, MensajeController.getMyConversations);

    fastify.post('/', {
        schema: {
            description: 'Enviar un mensaje',
            tags: ['Mensajería'],
            headers: { type: 'object', properties: { 'x-usuario-id': { type: 'string' } } },
            body: { $ref: 'Mensaje#' },
            response: { 201: { $ref: 'Mensaje#' } }
        }
    }, MensajeController.send);
};

export default mensajeRoutes;
