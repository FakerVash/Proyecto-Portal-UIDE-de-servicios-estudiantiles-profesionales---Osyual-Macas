import { FastifyInstance, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        checkRoles: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: { id: number; email: string; rol: string };
    }
}
