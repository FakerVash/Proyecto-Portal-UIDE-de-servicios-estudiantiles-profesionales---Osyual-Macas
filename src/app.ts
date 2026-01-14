import fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { handleError } from './utils/errors.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { serviceRoutes } from './modules/services/service.routes.js';
import { transactionRoutes } from './modules/transactions/transaction.routes.js';

export const buildApp = async () => {
    const app = fastify({
        logger: true,
    }).withTypeProvider<TypeBoxTypeProvider>();

    // Register JWT
    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    });

    // Register Swagger
    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'UIDE Student Services Portal API',
                description: 'API for UIDE Student Services Portal',
                version: '1.0.0',
            },
        },
    });

    app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    });

    // Global Error Handler
    app.setErrorHandler((error, request, reply) => {
        const { statusCode, body } = handleError(error);
        reply.status(statusCode).send(body);
    });

    // Health check
    app.get('/health', async () => {
        return { status: 'ok' };
    });

    // Modules registration
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(userRoutes, { prefix: '/api/users' });
    app.register(serviceRoutes, { prefix: '/api/services' });
    app.register(transactionRoutes, { prefix: '/api/transactions' });

    return app;
};
