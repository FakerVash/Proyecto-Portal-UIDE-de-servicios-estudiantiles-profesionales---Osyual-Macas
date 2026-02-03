import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';

const authRoutes: FastifyPluginAsync = async (fastify, opts) => {
    // POST /auth/login
    fastify.post('/login', {
        schema: {
            description: 'Iniciar sesión para obtener token',
            tags: ['Auth'],
            body: { $ref: 'Login#' },
            response: {
                200: { $ref: 'AuthResponse#' },
                401: {
                    type: 'object',
                    properties: { message: { type: 'string' } }
                }
            }
        }
    }, AuthController.login);
};

export default authRoutes;
