import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import {
    CreateServicioBodySchema,
    UpdateServicioBodySchema,
    ListServiciosQuerySchema,
    ServicioResponseSchema,
    ListServiciosResponseSchema,
    type CreateServicioBody,
    type UpdateServicioBody,
    type ListServiciosQuery,
} from './servicios.schemas.js';
import { IdParamSchema, SuccessResponseSchema, type IdParam } from '../../types/index.js';
import { authenticate, getCurrentUser, isEstudiante } from '../../utils/auth.js';
import { ForbiddenError } from '../../utils/errors.js';

export const serviciosRoutes: FastifyPluginAsync = async (server) => {
    // List servicios (public with filters)
    server.get<{ Querystring: ListServiciosQuery }>(
        '/',
        {
            schema: {
                description: 'List servicios with filters and pagination',
                tags: ['Servicios'],
                querystring: ListServiciosQuerySchema,
                response: {
                    200: SuccessResponseSchema(ListServiciosResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const {
                page = 1,
                limit = 20,
                categoriaId,
                carreraId,
                facultadId,
                precioMin,
                precioMax,
                activo = true,
                search,
            } = request.query;

            const skip = (page - 1) * limit;

            // Build where clause
            const where: any = {
                activo,
                ...(categoriaId && { categoriaId }),
                ...(precioMin !== undefined || precioMax !== undefined
                    ? {
                        precio: {
                            ...(precioMin !== undefined && { gte: precioMin }),
                            ...(precioMax !== undefined && { lte: precioMax }),
                        },
                    }
                    : {}),
                ...(search && {
                    OR: [
                        { titulo: { contains: search } },
                        { descripcion: { contains: search } },
                    ],
                }),
            };

            // Filter by carrera or facultad
            if (carreraId || facultadId) {
                where.usuario = {
                    ...(carreraId && { carreraId }),
                    ...(facultadId && {
                        carrera: {
                            facultadId,
                        },
                    }),
                };
            }

            const [servicios, total] = await Promise.all([
                server.prisma.servicio.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        categoria: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                apellido: true,
                                fotoPerfil: true,
                                carrera: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        facultad: {
                                            select: {
                                                id: true,
                                                nombre: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { fechaPublicacion: 'desc' },
                }),
                server.prisma.servicio.count({ where }),
            ]);

            return reply.send({
                success: true,
                data: {
                    servicios: servicios.map((s) => ({
                        ...s,
                        precio: s.precio.toString(),
                        fechaPublicacion: s.fechaPublicacion.toISOString(),
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

    // Get servicio by ID
    server.get<{ Params: IdParam }>(
        '/:id',
        {
            schema: {
                description: 'Get servicio detail',
                tags: ['Servicios'],
                params: IdParamSchema,
                response: {
                    200: SuccessResponseSchema(ServicioResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;

            const servicio = await server.prisma.servicio.findUniqueOrThrow({
                where: { id },
                include: {
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            fotoPerfil: true,
                            carrera: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    facultad: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return reply.send({
                success: true,
                data: {
                    ...servicio,
                    precio: servicio.precio.toString(),
                    fechaPublicacion: servicio.fechaPublicacion.toISOString(),
                },
            });
        }
    );

    // Get my services (estudiante only)
    server.get(
        '/my-services',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Get authenticated student\'s services',
                tags: ['Servicios'],
                security: [{ bearerAuth: [] }],
                response: {
                    200: SuccessResponseSchema(Type.Array(ServicioResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const currentUser = getCurrentUser(request);

            if (!isEstudiante(request)) {
                throw new ForbiddenError('Only estudiantes can have services');
            }

            const servicios = await server.prisma.servicio.findMany({
                where: { usuarioId: currentUser.id },
                include: {
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            fotoPerfil: true,
                            carrera: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    facultad: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { fechaPublicacion: 'desc' },
            });

            return reply.send({
                success: true,
                data: servicios.map((s) => ({
                    ...s,
                    precio: s.precio.toString(),
                    fechaPublicacion: s.fechaPublicacion.toISOString(),
                })),
            });
        }
    );

    // Create servicio (estudiante only)
    server.post<{ Body: CreateServicioBody }>(
        '/',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Create new servicio (estudiante only)',
                tags: ['Servicios'],
                security: [{ bearerAuth: [] }],
                body: CreateServicioBodySchema,
                response: {
                    201: SuccessResponseSchema(ServicioResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const currentUser = getCurrentUser(request);

            if (!isEstudiante(request)) {
                throw new ForbiddenError('Only estudiantes can create services');
            }

            const servicio = await server.prisma.servicio.create({
                data: {
                    ...request.body,
                    usuarioId: currentUser.id,
                },
                include: {
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            fotoPerfil: true,
                            carrera: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    facultad: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return reply.status(201).send({
                success: true,
                data: {
                    ...servicio,
                    precio: servicio.precio.toString(),
                    fechaPublicacion: servicio.fechaPublicacion.toISOString(),
                },
            });
        }
    );

    // Update servicio (owner or admin)
    server.put<{ Params: IdParam; Body: UpdateServicioBody }>(
        '/:id',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Update servicio (owner or admin)',
                tags: ['Servicios'],
                security: [{ bearerAuth: [] }],
                params: IdParamSchema,
                body: UpdateServicioBodySchema,
                response: {
                    200: SuccessResponseSchema(ServicioResponseSchema),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const currentUser = getCurrentUser(request);

            const existingServicio = await server.prisma.servicio.findUniqueOrThrow({
                where: { id },
            });

            if (existingServicio.usuarioId !== currentUser.id && currentUser.rol !== 'ADMIN') {
                throw new ForbiddenError('You can only update your own services');
            }

            const servicio = await server.prisma.servicio.update({
                where: { id },
                data: request.body,
                include: {
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            fotoPerfil: true,
                            carrera: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    facultad: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return reply.send({
                success: true,
                data: {
                    ...servicio,
                    precio: servicio.precio.toString(),
                    fechaPublicacion: servicio.fechaPublicacion.toISOString(),
                },
            });
        }
    );

    // Delete servicio (owner or admin)
    server.delete<{ Params: IdParam }>(
        '/:id',
        {
            onRequest: [authenticate],
            schema: {
                description: 'Delete servicio (owner or admin)',
                tags: ['Servicios'],
                security: [{ bearerAuth: [] }],
                params: IdParamSchema,
                response: {
                    200: SuccessResponseSchema(Type.Object({ message: Type.String() })),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const currentUser = getCurrentUser(request);

            const existingServicio = await server.prisma.servicio.findUniqueOrThrow({
                where: { id },
            });

            if (existingServicio.usuarioId !== currentUser.id && currentUser.rol !== 'ADMIN') {
                throw new ForbiddenError('You can only delete your own services');
            }

            await server.prisma.servicio.delete({
                where: { id },
            });

            return reply.send({
                success: true,
                data: { message: 'Servicio deleted successfully' },
            });
        }
    );
};
