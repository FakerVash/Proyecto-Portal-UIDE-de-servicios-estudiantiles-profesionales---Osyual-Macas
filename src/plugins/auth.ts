import { FastifyReply, FastifyRequest } from 'fastify';

export const checkAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    // En implementación real, esto vendría del JWT (request.user.rol)
    // Por ahora, simulamos que pasamos un header 'x-rol' para pruebas
    const rol = request.headers['x-rol'];

    if (rol !== 'ADMIN') {
        return reply.status(403).send({
            error: 'Forbidden',
            message: 'Solo el administrador puede realizar esta acción'
        });
    }
};

export const checkEstudiante = async (request: FastifyRequest, reply: FastifyReply) => {
    const rol = request.headers['x-rol'];

    if (rol !== 'ESTUDIANTE' && rol !== 'ADMIN') {
        return reply.status(403).send({
            error: 'Forbidden',
            message: 'Solo estudiantes o administradores pueden realizar esta acción'
        });
    }
};
