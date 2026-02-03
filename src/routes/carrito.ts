import { FastifyPluginAsync } from 'fastify';
import { CarritoController } from '../controllers/carrito.controller.js';

const carritoRoutes: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/', {
        schema: {
            description: 'Obtener mi carrito',
            tags: ['Cliente - Carrito'],
            headers: { type: 'object', properties: { 'x-usuario-id': { type: 'string' } } },
            response: { 200: { type: 'array', items: { $ref: 'Carrito#' } } }
        }
    }, CarritoController.getMyItems);

    fastify.post('/', {
        schema: {
            description: 'Agregar/Actualizar ítem en el carrito',
            tags: ['Cliente - Carrito'],
            body: { $ref: 'Carrito#' },
            response: { 201: { $ref: 'Carrito#' } }
        }
    }, CarritoController.addOrUpdate);

    fastify.delete('/:id', {
        schema: {
            description: 'Quitar ítem del carrito',
            tags: ['Cliente - Carrito'],
            params: { type: 'object', properties: { id: { type: 'integer' } } },
            response: { 204: { type: 'null' } }
        }
    }, CarritoController.delete);

    fastify.delete('/limpiar', {
        schema: {
            description: 'Vaciar mi carrito',
            tags: ['Cliente - Carrito'],
            headers: { type: 'object', properties: { 'x-usuario-id': { type: 'string' } } },
            response: { 204: { type: 'null' } }
        }
    }, CarritoController.clear);
};

export default carritoRoutes;
