import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
    private authService: AuthService;
    private server: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        // Agora o TS sabe que fastify.prisma existe devido à nossa augmentação anterior
        this.authService = new AuthService(fastify.prisma);
        this.server = fastify;
    }

    async register(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
        try {
            const user = await this.authService.register(request.body);
            const token = this.server.jwt.sign({
                id: user.id,
                email: user.email,
                rol: user.rol
            });

            return {
                user: { id: user.id, email: user.email, rol: user.rol },
                token
            };
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    async login(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
        try {
            const { email, password } = request.body as any;
            const user = await this.authService.login(email, password);
            const token = this.server.jwt.sign({
                id: user.id,
                email: user.email,
                rol: user.rol
            });

            return {
                user: { id: user.id, email: user.email, rol: user.rol },
                token
            };
        } catch (error: any) {
            reply.code(401).send({ message: error.message });
        }
    }

    async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            await this.authService.deleteUser(parseInt(request.params.id));
            return { message: 'Usuario eliminado correctamente' };
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }
}