import { CategoriaController } from '../controllers/categoria.controller.js';
import { getCategoriasSchema, createCategoriaSchema, deleteCategoriaSchema } from '../schemas/categoria.schema.js';

export default async function categoriaRoutes(fastify, opts) {
    const controller = new CategoriaController(fastify);

    // Ver categorías (Público)
    fastify.get('/', {
        schema: getCategoriasSchema
    }, (req, rep) => controller.getAll(req, rep));

    // Crear categoría (Solo Admin)
    fastify.post('/', {
        schema: createCategoriaSchema,
        onRequest: [fastify.authenticate, fastify.checkRoles(['ADMIN'])]
    }, (req, rep) => controller.create(req, rep));

    // Eliminar categoría (Solo Admin)
    fastify.delete('/:id', {
        schema: deleteCategoriaSchema,
        onRequest: [fastify.authenticate, fastify.checkRoles(['ADMIN'])]
    }, (req, rep) => controller.delete(req, rep));
}
