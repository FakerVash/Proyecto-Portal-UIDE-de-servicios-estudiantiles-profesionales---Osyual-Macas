import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ChatService } from '../services/chat.service.js';

// Interface para definir a estrutura da mensagem enviada
interface SendMessageBody {
    receptorId: number;
    contenido: string;
}

export class ChatController {
    private chatService: ChatService;

    constructor(fastify: FastifyInstance) {
        // Graças ao Module Augmentation feito no início, 
        // o TS reconhece o .prisma aqui.
        this.chatService = new ChatService(fastify.prisma);
    }

    async sendMessage(
        request: FastifyRequest<{ Body: SendMessageBody }>,
        reply: FastifyReply
    ) {
        try {
            // request.user.id vem do plugin @fastify/jwt tipado anteriormente
            const mensaje = await this.chatService.sendMessage(request.user.id as any as number, request.body);
            reply.code(201).send(mensaje);
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    async getConversaciones(request: FastifyRequest, reply: FastifyReply) {
        try {
            const conversaciones = await this.chatService.getConversaciones(request.user.id as any as number);
            return conversaciones;
        } catch (error: any) {
            reply.code(500).send({ message: error.message });
        }
    }
}