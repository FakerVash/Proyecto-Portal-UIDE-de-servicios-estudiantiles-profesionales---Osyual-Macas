import { CarritoController } from '../controllers/carrito.controller.js';
import { addToCarritoSchema, getCarritoSchema, deleteCarritoSchema } from '../schemas/carrito.schema.js';

export default async function carritoRoutes(fastify, opts) {
    const controller = new CarritoController(fastify);

    fastify.post('/', {
        schema: addToCarritoSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.add(req, rep));

    fastify.get('/', {
        schema: getCarritoSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.getMine(req, rep));

    fastify.delete('/:id', {
        schema: deleteCarritoSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.remove(req, rep));
}
