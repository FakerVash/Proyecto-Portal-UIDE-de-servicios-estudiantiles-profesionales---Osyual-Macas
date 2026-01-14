import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export default fp(async (fastify) => {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    await prisma.$connect();

    // Make Prisma available through `fastify.prisma`
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
});
