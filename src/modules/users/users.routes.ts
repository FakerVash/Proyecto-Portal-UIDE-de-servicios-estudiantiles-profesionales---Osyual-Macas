import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import {
    ListUsersQuerySchema,
    ListUsersResponseSchema,
    UpdateUserBodySchema,
    UserResponseSchema,
    type ListUsersQuery,
    type UpdateUserBody,
} from './users.schemas.js';
import { IdParamSchema, SuccessResponseSchema, type IdParam } from '../../types/index.js';
import { authenticate, getCurrentUser, requireRole } from '../../utils/auth.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';

export const usersRoutes: FastifyPluginAsync = async (server) => {
    // List users (admin only)
    server.get<{ Querystring: ListUsersQuery }>(
        '/',
        {
            onRequest: [authenticate],
            schema: {
                description: 'List all users with pagination and filters (admin only)',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                querystring: ListUsersQuerySchema,
                response: {
                    200: SuccessResponseSchema(ListUsersResponseSchema),
                },
            },
        },
        async (request, reply) => {
            requireRole(request, 'ADMIN');

            const { page = 1, limit = 20, rol, activo } = request.query;
            const skip = (page - 1) * limit;

            const where = {
                ...(rol && { rol }),
                ...(activo !== undefined && { activo }),
            };

            const [users, total] = await Promise.all([
                server.prisma.usuario.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        carrera: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                    orderBy: { fechaRegistro: 'desc' },
                }),
                server.prisma.usuario.count({ where }),
            ]);

            return reply.send({
                success: true,
                data: {
                    users: users.map((user) => ({
                        ...user,
                        fechaRegistro: user.fechaRegistro.toISOString(),
                    })),
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                },
            });
        }
    );

    // Get user by ID
    server.get<{ Params: IdParam }>(
        '/:id',
        {
            schema: {
                description: 'Get user by ID',
                tags: ['Users'],
                params: IdParamSchema,
                response: {
                    200: SuccessResponseSchema(UserResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;

            const user = await server.prisma.usuario.findUnique({
                where: { id },
                include: {
                    carrera: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
            });

            if (!user) {
                throw new NotFoundError('User not found');
            }

            return reply.send({
                success: true,
                data: {
                    ...user,
                    fechaRegistro: user.fechaRegistro.toISOString(),
                },
            });
        }
    );

    // Update user
    server.put<{ Params: IdParam; Body: UpdateUserBody }>(
        '/:id',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Update user profile (own profile or admin)',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                params: IdParamSchema,
                body: UpdateUserBodySchema,
                response: {
                    200: SuccessResponseSchema(UserResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const currentUser = getCurrentUser(request);

            if (currentUser.id !== id && currentUser.rol !== 'ADMIN') {
                throw new ForbiddenError('You can only update your own profile');
            }

            const user = await server.prisma.usuario.update({
                where: { id },
                data: request.body,
                include: {
                    carrera: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
            });

            return reply.send({
                success: true,
                data: {
                    ...user,
                    fechaRegistro: user.fechaRegistro.toISOString(),
                },
            });
        }
    );

    // Deactivate user (admin only)
    server.delete<{ Params: IdParam }>(
        '/:id',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Deactivate user (admin only)',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                params: IdParamSchema,
                response: {
                    200: SuccessResponseSchema(Type.Object({ message: Type.String() })),
                },
            },
        },
        async (request, reply) => {
            requireRole(request, 'ADMIN');

            const { id } = request.params;

            await server.prisma.usuario.update({
                where: { id },
                data: { activo: false },
            });

            return reply.send({
                success: true,
                data: { message: 'User deactivated successfully' },
            });
        }
    );
};
