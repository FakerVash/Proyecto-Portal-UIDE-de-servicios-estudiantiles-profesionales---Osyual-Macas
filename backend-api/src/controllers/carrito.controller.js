import { CarritoService } from '../services/carrito.service.js';

export class CarritoController {
    constructor(fastify) {
        this.carritoService = new CarritoService(fastify.prisma);
    }

    async add(request, reply) {
        try {
            const item = await this.carritoService.add(request.user.id, request.body);
            reply.code(201).send({ message: 'Agregado al carrito', item });
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }

    async getMine(request, reply) {
        try {
            const items = await this.carritoService.getByUser(request.user.id);
            return items;
        } catch (error) {
            reply.code(500).send({ message: error.message });
        }
    }

    async remove(request, reply) {
        try {
            const { id } = request.params;
            await this.carritoService.remove(parseInt(id));
            return { message: 'Eliminado del carrito' };
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }
}
