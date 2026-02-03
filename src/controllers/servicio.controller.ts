import { FastifyReply, FastifyRequest } from 'fastify';
import { ServicioDTO } from '../models/servicio.js';

export const ServicioController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { categoria, buscar } = request.query as { categoria?: string, buscar?: string };

        return await request.server.prisma.servicio.findMany({
            where: {
                activo: true,
                id_categoria: categoria ? parseInt(categoria) : undefined,
                OR: buscar ? [
                    { titulo: { contains: buscar } },
                    { descripcion: { contains: buscar } }
                ] : undefined
            },
            include: {
                usuario: { select: { nombre: true, apellido: true } },
                categoria: true
            }
        });
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as ServicioDTO;
        const nuevoServicio = await request.server.prisma.servicio.create({
            data: {
                id_usuario: body.id_usuario,
                id_categoria: body.id_categoria,
                titulo: body.titulo,
                descripcion: body.descripcion,
                precio: body.precio,
                tiempo_entrega: body.tiempo_entrega,
                imagen_portada: body.imagen_portada
            }
        });
        return reply.status(201).send(nuevoServicio);
    },

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const id_usuario_auth = parseInt(request.headers['x-usuario-id'] as string || '0');
        const body = request.body as Partial<ServicioDTO>;

        // REGLA: Solo el dueño puede editar su servicio
        const servicio = await request.server.prisma.servicio.findUnique({
            where: { id_servicio: parseInt(id) }
        });

        if (!servicio || servicio.id_usuario !== id_usuario_auth) {
            return reply.status(403).send({ message: 'No tienes permiso para editar este servicio' });
        }

        return await request.server.prisma.servicio.update({
            where: { id_servicio: parseInt(id) },
            data: body
        });
    },

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        await request.server.prisma.servicio.delete({
            where: { id_servicio: parseInt(id) }
        });
        return reply.status(204).send();
    }
};
