import { FastifyInstance } from 'fastify';
import { ServiceController } from './service.controller.js';
import { CreateServiceSchema, ServiceResponseSchema, CategoryResponseSchema } from './service.schema.js';

const serviceController = new ServiceController();

export async function serviceRoutes(app: FastifyInstance) {
    app.get('/', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    categoriaId: { type: 'number' },
                    query: { type: 'string' }
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: ServiceResponseSchema
                }
            }
        }
    }, serviceController.listServices);

    app.get('/categories', {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: CategoryResponseSchema
                }
            }
        }
    }, serviceController.listCategories);

    app.get('/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' }
                }
            },
            response: {
                200: ServiceResponseSchema
            }
        }
    }, serviceController.getService);

    app.post('/', {
        onRequest: [async (request) => { await request.jwtVerify() }],
        schema: {
            body: CreateServiceSchema,
            response: {
                201: ServiceResponseSchema
            }
        }
    }, serviceController.createService);
}
