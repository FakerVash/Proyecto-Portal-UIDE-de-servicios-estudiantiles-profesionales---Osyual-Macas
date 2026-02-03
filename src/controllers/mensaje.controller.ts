import { FastifyReply, FastifyRequest } from 'fastify';
import { MensajeDTO } from '../models/mensaje.js';

export const MensajeController = {
    async getMyConversations(request: FastifyRequest, reply: FastifyReply) {
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        // REGLA DE ORO: Privacidad del Chat
        // Solo ver donde soy emisor o receptor
        const mensajes = await request.server.prisma.mensaje.findMany({
            where: {
                OR: [
                    { id_emisor: id_usuario },
                    { id_receptor: id_usuario }
                ]
            },
            orderBy: { fecha_envio: 'asc' },
            include: {
                emisor: { select: { nombre: true, apellido: true } },
                receptor: { select: { nombre: true, apellido: true } }
            }
        });

        return mensajes;
    },

    async send(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as MensajeDTO;
        const id_usuario_auth = parseInt(request.headers['x-usuario-id'] as string || '0');

        // Seguridad básica: El emisor debe ser el usuario autenticado
        if (body.id_emisor !== id_usuario_auth) {
            return reply.status(403).send({ message: 'No puedes enviar mensajes como otro usuario' });
        }

        // Convertir boolean a number para Prisma (TinyInt)
        const data = {
            id_emisor: body.id_emisor,
            id_receptor: body.id_receptor,
            contenido: body.contenido,
            leido: body.leido ? 1 : 0
        };

        return await request.server.prisma.mensaje.create({ data });
    }
};
