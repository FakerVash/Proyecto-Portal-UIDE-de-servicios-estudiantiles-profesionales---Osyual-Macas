import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from './auth.routes.js';
import servicioRoutes from './servicio.routes.js';
import pedidoRoutes from './pedido.routes.js';
import categoriaRoutes from './categoria.routes.js';
import carritoRoutes from './carrito.routes.js';
import chatRoutes from './chat.routes.js';

export default async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(servicioRoutes, { prefix: '/api/servicios' });
    await fastify.register(pedidoRoutes, { prefix: '/api/pedidos' });
    await fastify.register(categoriaRoutes, { prefix: '/api/categorias' });
    await fastify.register(carritoRoutes, { prefix: '/api/carrito' });
    await fastify.register(chatRoutes, { prefix: '/api/chat' });
}
