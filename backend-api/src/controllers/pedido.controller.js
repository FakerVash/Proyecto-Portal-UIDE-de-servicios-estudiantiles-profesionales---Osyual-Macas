import { PedidoService } from '../services/pedido.service.js';

export class PedidoController {
    constructor(fastify) {
        this.pedidoService = new PedidoService(fastify.prisma);
    }

    async create(request, reply) {
        try {
            const pedido = await this.pedidoService.createPedido(request.body, request.user.id);
            return pedido;
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }

    async createResena(request, reply) {
        try {
            const { id } = request.params; // pedidoId
            const resena = await this.pedidoService.addResena(parseInt(id), request.body, request.user.id);
            return resena;
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }
}
