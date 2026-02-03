import { FastifyReply, FastifyRequest } from 'fastify';

export const NotificacionController = {
    async getMyNotificaciones(request: FastifyRequest, reply: FastifyReply) {
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');
        const notificaciones = await request.server.prisma.notificacion.findMany({
            where: { id_usuario },
            orderBy: { fecha_notificacion: 'desc' }
        });
        return notificaciones;
    },

    async markAsRead(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        const notificacion = await request.server.prisma.notificacion.findUnique({
            where: { id_notificacion: parseInt(id) }
        });

        if (!notificacion) {
            return reply.status(404).send({ message: 'Notificación no encontrada' });
        }

        if (notificacion.id_usuario !== id_usuario) {
            return reply.status(403).send({ message: 'No puedes modificar notificaciones de otro usuario' });
        }

        const updated = await request.server.prisma.notificacion.update({
            where: { id_notificacion: parseInt(id) },
            data: { leido: true }
        });

        return updated;
    },

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        const notificacion = await request.server.prisma.notificacion.findUnique({
            where: { id_notificacion: parseInt(id) }
        });

        if (!notificacion) {
            return reply.status(404).send({ message: 'Notificación no encontrada' });
        }

        if (notificacion.id_usuario !== id_usuario) {
            return reply.status(403).send({ message: 'No puedes eliminar notificaciones de otro usuario' });
        }

        await request.server.prisma.notificacion.delete({
            where: { id_notificacion: parseInt(id) }
        });

        return reply.status(204).send();
    }
};
