import { FastifyPluginAsync } from 'fastify';
import {
    CreatePedidoBodySchema,
    UpdatePedidoStatusBodySchema,
    PedidoResponseSchema,
    CreateResenaBodySchema,
    ResenaResponseSchema,
    type CreatePedidoBody,
    type UpdatePedidoStatusBody,
    type CreateResenaBody,
} from './pedidos.schemas.js';
import { SuccessResponseSchema, IdParamSchema, type IdParam } from '../../types/index.js';
import { authenticate, getCurrentUser } from '../../utils/auth.js';
import { ForbiddenError, NotFoundError, BadRequestError } from '../../utils/errors.js';
import { Type } from '@sinclair/typebox';

export const pedidosRoutes: FastifyPluginAsync = async (server) => {
    // List my orders (as client)
    server.get(
        '/my-orders',
        {
            onRequest: [authenticate],
            schema: {
                description: 'List orders placed by the authenticated user',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                response: {
                    200: SuccessResponseSchema(Type.Array(PedidoResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const currentUser = getCurrentUser(request);
            const pedidos = await server.prisma.pedido.findMany({
                where: { clienteId: currentUser.id },
                include: {
                    servicio: {
                        select: { id: true, titulo: true, precio: true },
                    },
                },
                orderBy: { fechaPedido: 'desc' },
            });

            return reply.send({
                success: true,
                data: pedidos.map(p => ({
                    ...p,
                    montoTotal: p.montoTotal.toString(),
                    fechaPedido: p.fechaPedido.toISOString(),
                    fechaEntrega: p.fechaEntrega?.toISOString() || null,
                    servicio: p.servicio ? { ...p.servicio, precio: p.servicio.precio.toString() } : undefined,
                })),
            });
        }
    );

    // List service orders (requested to my services)
    server.get(
        '/service-requests',
        {
            onRequest: [authenticate],
            schema: {
                description: 'List orders requested for services owned by the authenticated student',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                response: {
                    200: SuccessResponseSchema(Type.Array(PedidoResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const currentUser = getCurrentUser(request);
            const pedidos = await server.prisma.pedido.findMany({
                where: {
                    servicio: {
                        usuarioId: currentUser.id,
                    },
                },
                include: {
                    servicio: {
                        select: { id: true, titulo: true, precio: true },
                    },
                    cliente: {
                        select: { id: true, nombre: true, apellido: true },
                    },
                },
                orderBy: { fechaPedido: 'desc' },
            });

            return reply.send({
                success: true,
                data: pedidos.map(p => ({
                    ...p,
                    montoTotal: p.montoTotal.toString(),
                    fechaPedido: p.fechaPedido.toISOString(),
                    fechaEntrega: p.fechaEntrega?.toISOString() || null,
                    servicio: p.servicio ? { ...p.servicio, precio: p.servicio.precio.toString() } : undefined,
                })),
            });
        }
    );

    // Create Pedido
    server.post<{ Body: CreatePedidoBody }>(
        '/',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Create a new order for a service',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                body: CreatePedidoBodySchema,
                response: {
                    201: SuccessResponseSchema(PedidoResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const currentUser = getCurrentUser(request);
            const { servicioId, notas } = request.body;

            const servicio = await server.prisma.servicio.findUnique({
                where: { id: servicioId },
            });

            if (!servicio) throw new NotFoundError('Servicio not found');
            if (!servicio.activo) throw new BadRequestError('Servicio is not active');
            if (servicio.usuarioId === currentUser.id) throw new BadRequestError('You cannot order your own service');

            const pedido = await server.prisma.pedido.create({
                data: {
                    servicioId,
                    clienteId: currentUser.id,
                    montoTotal: servicio.precio,
                    notas,
                },
                include: {
                    servicio: true,
                },
            });

            return reply.status(201).send({
                success: true,
                data: {
                    ...pedido,
                    montoTotal: pedido.montoTotal.toString(),
                    fechaPedido: pedido.fechaPedido.toISOString(),
                    fechaEntrega: pedido.fechaEntrega?.toISOString() || null,
                    servicio: { ...pedido.servicio, precio: pedido.servicio.precio.toString() },
                },
            });
        }
    );

    // Update Pedido Status (only service owner or admin)
    server.patch<{ Params: IdParam; Body: UpdatePedidoStatusBody }>(
        '/:id/status',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Update the status of an order',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                params: IdParamSchema,
                body: UpdatePedidoStatusBodySchema,
                response: {
                    200: SuccessResponseSchema(PedidoResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const { estado } = request.body;
            const currentUser = getCurrentUser(request);

            const pedido = await server.prisma.pedido.findUnique({
                where: { id },
                include: { servicio: true },
            });

            if (!pedido) throw new NotFoundError('Pedido not found');

            // Only service owner or ADMIN can update status
            if (pedido.servicio.usuarioId !== currentUser.id && currentUser.rol !== 'ADMIN') {
                throw new ForbiddenError('You can only update status for orders of your services');
            }

            const updatedPedido = await server.prisma.pedido.update({
                where: { id },
                data: {
                    estado,
                    ...(estado === 'COMPLETADO' ? { fechaEntrega: new Date() } : {}),
                },
            });

            return reply.send({
                success: true,
                data: {
                    ...updatedPedido,
                    montoTotal: updatedPedido.montoTotal.toString(),
                    fechaPedido: updatedPedido.fechaPedido.toISOString(),
                    fechaEntrega: updatedPedido.fechaEntrega?.toISOString() || null,
                },
            });
        }
    );

    // Create Reseña (only client when order is COMPLETADO)
    server.post<{ Body: CreateResenaBody }>(
        '/resenas',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Create a review for a completed order',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                body: CreateResenaBodySchema,
                response: {
                    201: SuccessResponseSchema(ResenaResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const currentUser = getCurrentUser(request);
            const { pedidoId, calificacion, comentario } = request.body;

            const pedido = await server.prisma.pedido.findUnique({
                where: { id: pedidoId },
                include: { resena: true },
            });

            if (!pedido) throw new NotFoundError('Pedido not found');
            if (pedido.clienteId !== currentUser.id) throw new ForbiddenError('You can only review your own orders');
            if (pedido.estado !== 'COMPLETADO') throw new BadRequestError('You can only review completed orders');
            if (pedido.resena) throw new BadRequestError('This order already has a review');

            const resena = await server.prisma.resena.create({
                data: {
                    pedidoId,
                    calificacion,
                    comentario,
                },
            });

            return reply.status(201).send({
                success: true,
                data: {
                    ...resena,
                    fechaResena: resena.fechaResena.toISOString(),
                },
            });
        }
    );
};
