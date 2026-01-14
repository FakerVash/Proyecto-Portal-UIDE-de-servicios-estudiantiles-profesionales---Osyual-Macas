import { AuthController } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema, deleteUserSchema } from '../schemas/auth.schema.js';

export default async function authRoutes(fastify, opts) {
    const controller = new AuthController(fastify);

    // Registro público
    fastify.post('/register', { schema: registerSchema }, (req, rep) => controller.register(req, rep));

    // Login público
    fastify.post('/login', { schema: loginSchema }, (req, rep) => controller.login(req, rep));

    // Eliminar usuario (Solo Admin)
    fastify.delete('/usuario/:id', {
        schema: deleteUserSchema,
        onRequest: [fastify.authenticate, fastify.checkRoles(['ADMIN'])]
    }, (req, rep) => controller.deleteUser(req, rep));

    // Ver mi perfil
    fastify.get('/me', {
        onRequest: [fastify.authenticate],
        schema: { tags: ['1. AUTENTICACIÓN'] }
    }, (req, rep) => {
        return req.user;
    });
}
