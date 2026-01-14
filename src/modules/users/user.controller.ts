import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service.js';
import { UserUpdateInput } from './user.schema.js';

const userService = new UserService();

export class UserController {
    async getMe(request: FastifyRequest, reply: FastifyReply) {
        const userId = (request.user as any).id;
        const user = await userService.getProfile(userId);
        return reply.send(user);
    }

    async updateMe(request: FastifyRequest<{ Body: UserUpdateInput }>, reply: FastifyReply) {
        const userId = (request.user as any).id;
        const user = await userService.updateProfile(userId, request.body);
        return reply.send(user);
    }

    async getUser(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
        const user = await userService.getProfile(Number(request.params.id));
        return reply.send(user);
    }

    async listUsers(request: FastifyRequest, reply: FastifyReply) {
        const users = await userService.getAllUsers();
        return reply.send(users);
    }
}
