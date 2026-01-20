import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

// 1. Definição do formato do seu User dentro do Token
interface UserPayload {
    id: number;
    email: string;
    rol: string; // Corrigido para 'rol' conforme seu código original
}

// 2. Augmentação de tipos para o Fastify
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        checkRoles: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

// 3. Augmentação para o @fastify/jwt reconhecer o payload no request.user
declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: UserPayload;
    }
}

const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
    console.log('Registering authPlugin...');
    // Registro do Plugin JWT
    await fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'supersecret',
    });

    // Decorador para verificar o token (Authentication)
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // Decorador para verificar permissões (RBAC - Role Based Access Control)
    fastify.decorate('checkRoles', (roles: string[]) => {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            const user = request.user;

            if (!user || !roles.includes(user.rol)) {
                return reply.status(403).send({
                    message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
                });
            }
        };
    });
});

export default authPlugin;