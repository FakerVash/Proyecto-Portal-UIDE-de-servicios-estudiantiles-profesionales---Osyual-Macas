import '@fastify/jwt';

declare module 'fastify' {
    interface FastifyInstance {
        jwt: any;
        jwtVerify: any;
    }
    interface FastifyRequest {
        jwtVerify: any;
        user: any;
    }
}
