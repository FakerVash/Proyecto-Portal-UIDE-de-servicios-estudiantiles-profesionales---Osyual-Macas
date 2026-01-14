import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller.js';
import { RegisterSchema, LoginSchema, AuthResponseSchema } from './auth.schema.js';

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
    app.post(
        '/register',
        {
            schema: {
                body: RegisterSchema,
                response: {
                    201: AuthResponseSchema,
                },
            },
        },
        authController.register
    );

    app.post(
        '/login',
        {
            schema: {
                body: LoginSchema,
                response: {
                    200: AuthResponseSchema,
                },
            },
        },
        authController.login
    );
}
