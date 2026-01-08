import { FastifyPluginAsync } from 'fastify';
import {
    CategoriaResponseSchema,
    FacultadResponseSchema,
    CarreraResponseSchema,
} from './catalogos.schemas.js';
import { SuccessResponseSchema, IdParamSchema, type IdParam } from '../../types/index.js';
import { Type } from '@sinclair/typebox';

export const catalogosRoutes: FastifyPluginAsync = async (server) => {
    // List Categorias
    server.get(
        '/categorias',
        {
            schema: {
                description: 'List all service categories',
                tags: ['Catalogs'],
                response: {
                    200: SuccessResponseSchema(Type.Array(CategoriaResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const categorias = await server.prisma.categoria.findMany({
                orderBy: { nombre: 'asc' },
            });
            return reply.send({ success: true, data: categorias });
        }
    );

    // List Facultades
    server.get(
        '/facultades',
        {
            schema: {
                description: 'List all facultades',
                tags: ['Catalogs'],
                response: {
                    200: SuccessResponseSchema(Type.Array(FacultadResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const facultades = await server.prisma.facultad.findMany({
                orderBy: { nombre: 'asc' },
            });
            return reply.send({ success: true, data: facultades });
        }
    );

    // List Carreras by Facultad
    server.get<{ Params: IdParam }>(
        '/facultades/:id/carreras',
        {
            schema: {
                description: 'List all carreras for a specific facultad',
                tags: ['Catalogs'],
                params: IdParamSchema,
                response: {
                    200: SuccessResponseSchema(Type.Array(CarreraResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const carreras = await server.prisma.carrera.findMany({
                where: { facultadId: id },
                orderBy: { nombre: 'asc' },
            });
            return reply.send({ success: true, data: carreras });
        }
    );

    // List all Carreras
    server.get(
        '/carreras',
        {
            schema: {
                description: 'List all carreras',
                tags: ['Catalogs'],
                response: {
                    200: SuccessResponseSchema(Type.Array(CarreraResponseSchema)),
                },
            },
        },
        async (request, reply) => {
            const carreras = await server.prisma.carrera.findMany({
                orderBy: { nombre: 'asc' },
            });
            return reply.send({ success: true, data: carreras });
        }
    );
};
