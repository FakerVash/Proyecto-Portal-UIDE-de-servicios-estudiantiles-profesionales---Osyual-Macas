// src/plugins/roles.ts
import { FastifyInstance } from 'fastify';

export default async function rolesPlugin(fastify: FastifyInstance) {
    // Decoramos Fastify con checkRoles
    fastify.decorate('checkRoles', function (roles: string[]) {
        return async (request: any, reply: any) => {
            const user = request.user; // asumimos que authenticate ya puso request.user
            if (!user) {
                return reply.status(401).send({ message: 'No autorizado' });
            }
            if (!roles.includes(user.role)) {
                return reply.status(403).send({ message: 'Acceso prohibido: rol insuficiente' });
            }
        };
    });
}
