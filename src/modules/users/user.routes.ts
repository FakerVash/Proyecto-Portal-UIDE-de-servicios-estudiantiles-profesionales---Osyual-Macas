import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';
import { UserUpdateSchema, UserResponseFullSchema } from './user.schema.js';

const userController = new UserController();

export async function userRoutes(app: FastifyInstance) {
    // Add authentication hook for all routes in this plugin
    app.addHook('onRequest', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    app.get('/me', {
        schema: {
            response: {
                200: UserResponseFullSchema,
            },
        },
    }, userController.getMe);

    app.put('/me', {
        schema: {
            body: UserUpdateSchema,
            response: {
                200: UserResponseFullSchema,
            },
        },
    }, userController.updateMe);

    app.get('/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' }
                }
            },
            response: {
                200: UserResponseFullSchema,
            },
        },
    }, userController.getUser);

    app.get('/', {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: UserResponseFullSchema,
                },
            },
        },
    }, userController.listUsers);
}
