import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import Cors from '@fastify/cors';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
    // Core Plugins
    await fastify.register(Cors, {
        origin: '*', // Adjust in production
    });

    // Swagger Documentation
    await fastify.register(Swagger, {
        openapi: {
            info: {
                title: 'API Portal de Servicios Estudiantiles',
                description: 'Documentación del API REST para UniServicios',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Servidor Local'
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [{ bearerAuth: [] }]
        }
    });

    await fastify.register(SwaggerUI, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true,
        },
    });

    // Auto-load Plugins (Database, Utils, Auth strategies)
    console.log('Loading plugins from:', path.join(__dirname, 'plugins'));
    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts),
        forceESM: true,
    });

    // Register Application Routes
    console.log('Registering routes...');
    // Note: In NodeNext ESM, we import the .js version of the file
    await fastify.register(import('./routes/index.js'));

    // Friendly Root Route
    fastify.get('/', {
        schema: { tags: ['2. CONSULTAR (GET)'] } as any
    }, async (request, reply) => {
        return {
            message: 'Bienvenido al API de Servicios Estudiantiles',
            status: 'Online',
            docs: '/documentation'
        };
    });
}
