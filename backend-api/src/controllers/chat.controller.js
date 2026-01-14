import { ChatService } from '../services/chat.service.js';

export class ChatController {
    constructor(fastify) {
        this.chatService = new ChatService(fastify.prisma);
    }

    async sendMessage(request, reply) {
        try {
            const mensaje = await this.chatService.sendMessage(request.user.id, request.body);
            reply.code(201).send(mensaje);
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }

    async getConversaciones(request, reply) {
        try {
            const conversaciones = await this.chatService.getConversaciones(request.user.id);
            return conversaciones;
        } catch (error) {
            reply.code(500).send({ message: error.message });
        }
    }
}
