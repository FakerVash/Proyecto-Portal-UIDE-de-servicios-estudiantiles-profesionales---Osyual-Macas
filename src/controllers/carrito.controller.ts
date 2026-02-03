import { FastifyReply, FastifyRequest } from 'fastify';
import { CarritoDTO } from '../models/carrito.js';

export const CarritoController = {
    async getMyItems(request: FastifyRequest, reply: FastifyReply) {
        // En producción usar ID del token decodificado
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        return await request.server.prisma.carrito.findMany({
            where: { id_cliente: id_usuario },
            include: { servicio: true }
        });
    },

    async addOrUpdate(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as CarritoDTO;
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        // FORZAR ID del usuario autenticado
        body.id_cliente = id_usuario;

        // UPSERT: Si ya existe el mismo servicio en el carrito del usuario, actualizamos cantidad
        const existing = await request.server.prisma.carrito.findFirst({
            where: { id_cliente: id_usuario, id_servicio: body.id_servicio }
        });

        if (existing) {
            return await request.server.prisma.carrito.update({
                where: { id_carrito: existing.id_carrito },
                data: { horas: (existing.horas || 1) + (body.horas || 1) }
            });
        }

        return await request.server.prisma.carrito.create({ data: body });
    },

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        // VERIFICAR que el item del carrito pertenezca al usuario
        const item = await request.server.prisma.carrito.findUnique({
            where: { id_carrito: parseInt(id) }
        });

        if (!item) return reply.status(404).send({ message: 'Item no encontrado' });

        if (item.id_cliente !== id_usuario) {
            return reply.status(403).send({ message: 'No puedes eliminar items de otro usuario' });
        }

        await request.server.prisma.carrito.delete({
            where: { id_carrito: parseInt(id) }
        });
        return reply.status(204).send();
    },

    async clear(request: FastifyRequest, reply: FastifyReply) {
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');
        await request.server.prisma.carrito.deleteMany({
            where: { id_cliente: id_usuario }
        });
        return reply.status(204).send();
    }
};
