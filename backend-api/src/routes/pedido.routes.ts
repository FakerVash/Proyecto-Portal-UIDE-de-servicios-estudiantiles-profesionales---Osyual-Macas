import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PedidoController } from '../controllers/pedido.controller.js';
import { createPedidoSchema, createResenaSchema } from '../schemas/pedido.schema.js';

export default async function pedidoRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const controller = new PedidoController(fastify);

    // Crear pedido (Cualquier usuario autenticado puede contratar)
    fastify.post('/', {
        schema: createPedidoSchema,
        onRequest: [fastify.authenticate, (fastify as any).checkRoles(['CLIENTE'])]
    }, (req, rep) => controller.create(req as any, rep));

    // Dejar reseña a un pedido
    fastify.post('/:id/resena', {
        schema: createResenaSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.createResena(req as any, rep));
}
