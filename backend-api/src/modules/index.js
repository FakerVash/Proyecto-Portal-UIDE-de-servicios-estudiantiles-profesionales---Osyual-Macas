import authRoutes from './auth/auth.routes.js';

export default async function modules(fastify, opts) {
    // Registrar módulos con sus prefijos
    await fastify.register(authRoutes, { prefix: '/api/auth' });

    // Futuros módulos:
    // await fastify.register(serviciosRoutes, { prefix: '/api/servicios' });
    // await fastify.register(pedidosRoutes, { prefix: '/api/pedidos' });
}
