import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema, deleteUserSchema } from '../schemas/auth.schema.js';

export default async function authRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const controller = new AuthController(fastify);

    // Registro público
    fastify.post('/register', { schema: registerSchema }, (req, rep) => controller.register(req as any, rep));

    // Login público
    fastify.post('/login', { schema: loginSchema }, (req, rep) => controller.login(req as any, rep));

    // Eliminar usuario (Solo Admin)
    fastify.delete(
        '/usuario/:id',
        {
            schema: deleteUserSchema,
            onRequest: [fastify.authenticate, fastify.checkRoles(['ADMIN'])] // <-- aquí sin "as any"
        },
        (req, rep) => controller.deleteUser(req as any, rep)
    );

    // Ver mi perfil
    fastify.get(
        '/me',
        {
            onRequest: [fastify.authenticate],
            schema: { tags: ['1. AUTENTICACIÓN'] }
        },
        (req: any, rep) => {
            return req.user;
        }
    );
}
