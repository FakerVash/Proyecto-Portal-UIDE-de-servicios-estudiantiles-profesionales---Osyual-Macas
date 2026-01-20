import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { CategoriaController } from '../controllers/categoria.controller.js';
import { getCategoriasSchema, createCategoriaSchema, deleteCategoriaSchema } from '../schemas/categoria.schema.js';

export default async function categoriaRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const controller = new CategoriaController(fastify);

    // Ver categorías (Público)
    fastify.get('/', {
        schema: getCategoriasSchema
    }, (req, rep) => controller.getAll(req as any, rep));

    // Crear categoría (Solo Admin)
    fastify.post('/', {
        schema: createCategoriaSchema,
        onRequest: [fastify.authenticate, (fastify as any).checkRoles(['ADMIN'])]
    }, (req, rep) => controller.create(req as any, rep));

    // Eliminar categoría (Solo Admin)
    fastify.delete('/:id', {
        schema: deleteCategoriaSchema,
        onRequest: [fastify.authenticate, (fastify as any).checkRoles(['ADMIN'])]
    }, (req, rep) => controller.delete(req as any, rep));
}
