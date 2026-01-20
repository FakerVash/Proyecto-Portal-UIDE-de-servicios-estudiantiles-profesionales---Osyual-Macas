import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { CarritoController } from '../controllers/carrito.controller.js';
import { addToCarritoSchema, getCarritoSchema, deleteCarritoSchema } from '../schemas/carrito.schema.js';

export default async function carritoRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const controller = new CarritoController(fastify);

    fastify.post('/', {
        schema: addToCarritoSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.add(req as any, rep));

    fastify.get('/', {
        schema: getCarritoSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.getMine(req as any, rep));

    fastify.delete('/:id', {
        schema: deleteCarritoSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.remove(req as any, rep));
}
