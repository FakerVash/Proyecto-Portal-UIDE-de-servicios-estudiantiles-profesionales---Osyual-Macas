import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

// 1. Definição da interface para que o TS reconheça o fastify.prisma
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    await prisma.$connect();

    // 2. Adiciona a instância ao Fastify
    fastify.decorate('prisma', prisma);

    // 3. Garante o fechamento da conexão ao encerrar o servidor
    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
});

export default prismaPlugin;