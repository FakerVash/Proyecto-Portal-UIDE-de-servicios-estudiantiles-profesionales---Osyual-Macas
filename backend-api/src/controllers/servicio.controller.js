import { ServicioService } from '../services/servicio.service.js';

export class ServicioController {
    constructor(fastify) {
        this.servicioService = new ServicioService(fastify.prisma);
    }

    async create(request, reply) {
        try {
            const servicio = await this.servicioService.createServicio(request.body, request.user.id);
            reply.code(201).send(servicio);
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }

    async getAll(request, reply) {
        try {
            const servicios = await this.servicioService.getServicios(request.query);
            return servicios;
        } catch (error) {
            reply.code(500).send({ message: error.message });
        }
    }

    async delete(request, reply) {
        try {
            await this.servicioService.delete(parseInt(request.params.id), request.user);
            return { message: 'Servicio eliminado' };
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }
}
