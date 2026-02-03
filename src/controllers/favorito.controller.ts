import { FastifyReply, FastifyRequest } from 'fastify';
import { FavoritoDTO } from '../models/favorito.js';

export const FavoritoController = {
    async getMyFavorites(request: FastifyRequest, reply: FastifyReply) {
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');
        return await request.server.prisma.favorito.findMany({
            where: { id_usuario },
            include: { servicio: true }
        });
    },

    async toggle(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as FavoritoDTO;
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        // FORZAR ID del usuario autenticado
        body.id_usuario = id_usuario;

        const existing = await request.server.prisma.favorito.findFirst({
            where: { id_usuario: id_usuario, id_servicio: body.id_servicio }
        });

        if (existing) {
            await request.server.prisma.favorito.delete({
                where: {
                    id_usuario_id_servicio: {
                        id_usuario: id_usuario,
                        id_servicio: body.id_servicio
                    }
                }
            });
            return { message: 'Eliminado de favoritos' };
        }

        const nuevo = await request.server.prisma.favorito.create({
            data: {
                id_usuario: id_usuario,
                id_servicio: body.id_servicio
            }
        });
        return nuevo;
    }
};
