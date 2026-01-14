import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async (fastify) => {
    await fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'supersecret',
    });

    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    fastify.decorate('checkRoles', (roles) => {
        return async (request, reply) => {
            const user = request.user;
            if (!user || !roles.includes(user.rol)) {
                reply.code(403).send({
                    message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`
                });
            }
        };
    });
});
