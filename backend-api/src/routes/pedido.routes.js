import { PedidoController } from '../controllers/pedido.controller.js';
import { createPedidoSchema, createResenaSchema } from '../schemas/pedido.schema.js';

export default async function pedidoRoutes(fastify, opts) {
    const controller = new PedidoController(fastify);

    // Crear pedido (Cualquier usuario autenticado puede contratar)
    fastify.post('/', {
        schema: createPedidoSchema,
        onRequest: [fastify.authenticate, fastify.checkRoles(['CLIENTE'])]
    }, (req, rep) => controller.create(req, rep));

    // Dejar reseña a un pedido
    fastify.post('/:id/resena', {
        schema: createResenaSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.createResena(req, rep));
}
