import { FastifyReply, FastifyRequest } from 'fastify';
import { ServiceService } from './service.service.js';
import { CreateServiceInput } from './service.schema.js';

const serviceService = new ServiceService();

export class ServiceController {
    async listServices(request: FastifyRequest<{ Querystring: { categoriaId?: number; query?: string } }>, reply: FastifyReply) {
        const services = await serviceService.listServices(request.query);
        return reply.send(services);
    }

    async createService(request: FastifyRequest<{ Body: CreateServiceInput }>, reply: FastifyReply) {
        const userId = (request.user as any).id;
        const service = await serviceService.createService(userId, request.body);
        return reply.status(201).send(service);
    }

    async listCategories(request: FastifyRequest, reply: FastifyReply) {
        const categories = await serviceService.listCategories();
        return reply.send(categories);
    }

    async getService(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
        const service = await serviceService.getService(Number(request.params.id));
        return reply.send(service);
    }
}
