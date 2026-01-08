import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

import prismaPlugin from './plugins/prisma.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { serviciosRoutes } from './modules/servicios/servicios.routes.js';
import { catalogosRoutes } from './modules/catalogos/catalogos.routes.js';
import { pedidosRoutes } from './modules/pedidos/pedidos.routes.js';
import { AppError } from './utils/errors.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = Fastify({
    logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Register JWT
server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey-uide-portal-2025',
});

// Register Swagger
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'UIDE Student Services API',
            description: 'API for UIDE Student Services Portal',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
});

server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

// Register Plugins
server.register(prismaPlugin);

// Register Routes
server.register(usersRoutes, { prefix: '/api/users' });
server.register(serviciosRoutes, { prefix: '/api/servicios' });
server.register(catalogosRoutes, { prefix: '/api/catalogos' });
server.register(pedidosRoutes, { prefix: '/api/pedidos' });

// Error Handler
server.setErrorHandler((error: any, request, reply) => {
    server.log.error(error);

    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            error: {
                message: error.message,
                statusCode: error.statusCode,
                details: error.details,
            },
        });
    }

    if (error.validation) {
        return reply.status(400).send({
            success: false,
            error: {
                message: 'Validation Error',
                statusCode: 400,
                details: error.validation,
            },
        });
    }

    reply.status(500).send({
        success: false,
        error: {
            message: 'Internal Server Error',
            statusCode: 500,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
    });
});

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server ready at http://localhost:${port}`);
        console.log(`Documentation ready at http://localhost:${port}/docs`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
