import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service.js';
import { RegisterInput, LoginInput } from './auth.schema.js';

const authService = new AuthService();

export class AuthController {
    async register(request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
        const user = await authService.register(request.body);
        const token = request.server.jwt.sign({ id: user.id, role: user.rolId });
        return reply.status(201).send({ user, token });
    }

    async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
        const user = await authService.login(request.body);
        const token = request.server.jwt.sign({ id: user.id, role: user.rolId });
        return reply.status(200).send({ user, token });
    }
}
