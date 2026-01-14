import { AuthService } from '../services/auth.service.js';

export class AuthController {
    constructor(fastify) {
        this.authService = new AuthService(fastify.prisma);
        this.server = fastify;
    }

    async register(request, reply) {
        try {
            const user = await this.authService.register(request.body);
            const token = this.server.jwt.sign({ id: user.id, email: user.email, rol: user.rol });
            return { user: { id: user.id, email: user.email, rol: user.rol }, token };
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }

    async login(request, reply) {
        try {
            const { email, password } = request.body;
            const user = await this.authService.login(email, password);
            const token = this.server.jwt.sign({ id: user.id, email: user.email, rol: user.rol });
            return { user: { id: user.id, email: user.email, rol: user.rol }, token };
        } catch (error) {
            reply.code(401).send({ message: error.message });
        }
    }

    async deleteUser(request, reply) {
        try {
            await this.authService.deleteUser(parseInt(request.params.id));
            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }
}
