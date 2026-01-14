import { ChatController } from '../controllers/chat.controller.js';
import { sendMessageSchema, getConversacionesSchema } from '../schemas/chat.schema.js';

export default async function chatRoutes(fastify, opts) {
    const controller = new ChatController(fastify);

    fastify.post('/mensaje', {
        schema: sendMessageSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.sendMessage(req, rep));

    fastify.get('/conversaciones', {
        schema: getConversacionesSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.getConversaciones(req, rep));
}
