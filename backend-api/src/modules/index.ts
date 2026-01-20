import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from './auth/auth.routes.js';

export default async function modules(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    // Registrar módulos con sus prefijos
    await fastify.register(authRoutes, { prefix: '/api/auth' });
}
