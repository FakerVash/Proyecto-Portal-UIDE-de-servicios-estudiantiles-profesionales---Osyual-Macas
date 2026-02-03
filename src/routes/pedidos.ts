import { FastifyPluginAsync } from 'fastify';
import { PedidoController } from '../controllers/pedido.controller.js';

const pedidoRoutes: FastifyPluginAsync = async (fastify, opts) => {
    // GET /pedidos
    fastify.get('/', {
        schema: {
            description: 'Obtener historial de pedidos',
            tags: ['Pedidos'],
            response: {
                200: {
                    type: 'array',
                    items: { $ref: 'Pedido#' }
                }
            }
        }
    }, PedidoController.getAll);

    // POST /pedidos
    fastify.post('/', {
        schema: {
            description: 'Crear un nuevo pedido',
            tags: ['Pedidos'],
            body: { $ref: 'Pedido#' },
            response: {
                201: { $ref: 'Pedido#' }
            }
        }
    }, PedidoController.create);

    // PATCH /pedidos/:id (Actualizar estado)
    fastify.patch('/:id/estado', {
        schema: {
            description: 'Actualizar estado de un pedido',
            tags: ['Pedidos'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer' }
                }
            },
            body: {
                type: 'object',
                required: ['estado'],
                properties: {
                    estado: { type: 'string', enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'] }
                }
            },
            response: {
                200: { $ref: 'Pedido#' }
            }
        }
    }, PedidoController.updateEstado);
};

export default pedidoRoutes;
