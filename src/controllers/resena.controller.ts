import { FastifyReply, FastifyRequest } from 'fastify';

export const ResenaController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        return await request.server.prisma.resena.findMany({
            include: {
                pedido: true,
                servicio: true
            }
        });
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as any;

        // REGLA: Solo puede reseñar si tiene un pedido COMPLETADO para ese servicio
        const pedidoCompletado = await request.server.prisma.pedido.findFirst({
            where: {
                id_cliente: body.id_cliente,
                id_servicio: body.id_servicio,
                estado: 'completado'
            }
        });

        if (!pedidoCompletado) {
            return reply.status(403).send({
                message: 'Solo puedes reseñar servicios que has comprado y están completados'
            });
        }

        return await request.server.prisma.resena.create({ data: body });
    },

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        await request.server.prisma.resena.delete({
            where: { id_resena: parseInt(id) }
        });
        return reply.status(204).send();
    }
};
