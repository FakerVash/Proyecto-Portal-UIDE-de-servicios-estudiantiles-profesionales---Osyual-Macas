import { FastifyReply, FastifyRequest } from 'fastify';
import { PedidoDTO } from '../models/pedido.js';

export const PedidoController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');
        const rol = request.headers['x-rol'];

        // ADMIN ve todo
        if (rol === 'ADMIN') {
            return await request.server.prisma.pedido.findMany({
                include: {
                    servicio: true,
                    cliente: { select: { nombre: true, email: true } }
                }
            });
        }

        // CLIENTE ve sus compras
        if (rol === 'CLIENTE') {
            return await request.server.prisma.pedido.findMany({
                where: { id_cliente: id_usuario },
                include: {
                    servicio: true,
                    cliente: { select: { nombre: true, email: true } }
                }
            });
        }

        // ESTUDIANTE (Vendedor) ve sus ventas Y sus compras
        if (rol === 'ESTUDIANTE') {
            return await request.server.prisma.pedido.findMany({
                where: {
                    OR: [
                        { id_cliente: id_usuario }, // Mis compras
                        { servicio: { id_usuario: id_usuario } } // Mis ventas
                    ]
                },
                include: {
                    servicio: true,
                    cliente: { select: { nombre: true, email: true } }
                }
            });
        }

        return [];
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as PedidoDTO;
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');

        const nuevoPedido = await request.server.prisma.pedido.create({
            data: {
                id_servicio: body.id_servicio,
                id_cliente: id_usuario, // FORZAR ID del usuario autenticado
                monto_total: body.monto_total,
                notas: body.notas,
                fecha_entrega: body.fecha_entrega ? new Date(body.fecha_entrega) : undefined
            }
        });
        return reply.status(201).send(nuevoPedido);
    },

    async updateEstado(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const { estado } = request.body as { estado: any };
        const id_usuario_auth = parseInt(request.headers['x-usuario-id'] as string || '0');

        // REGLA: El vendedor del servicio es quien cambia el estado (o el Admin)
        const pedido = await request.server.prisma.pedido.findUnique({
            where: { id_pedido: parseInt(id) },
            include: { servicio: true }
        });

        if (!pedido) return reply.status(404).send({ message: 'Pedido no encontrado' });

        // REGLA: Jerarquía de Estados
        const rol = request.headers['x-rol'];

        if (rol === 'ESTUDIANTE' || rol === 'ADMIN') {
            // El Vendedor (o Admin) puede completar el trabajo
            if (pedido.servicio.id_usuario === id_usuario_auth || rol === 'ADMIN') {
                // Permitir cambios a 'en proceso' o 'completado'
                if (estado === 'completado' || estado === 'en proceso') {
                    return await request.server.prisma.pedido.update({
                        where: { id_pedido: parseInt(id) },
                        data: { estado }
                    });
                }
            }
        }

        if (rol === 'CLIENTE' || rol === 'ESTUDIANTE') {
            // El Cliente (o el Estudiante actuando como comprador) solo puede CANCELAR
            if (pedido.id_cliente === id_usuario_auth) {
                if (estado === 'cancelado' && pedido.estado === 'pendiente') {
                    return await request.server.prisma.pedido.update({
                        where: { id_pedido: parseInt(id) },
                        data: { estado }
                    });
                } else {
                    return reply.status(403).send({
                        message: 'Solo puedes cancelar pedidos que estén pendientes'
                    });
                }
            }
        }

        return reply.status(403).send({ message: 'No tienes permisos para realizar este cambio de estado' });
    }
};
