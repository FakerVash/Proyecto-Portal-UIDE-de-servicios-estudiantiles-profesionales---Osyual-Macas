import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PedidoService } from '../services/pedido.service.js';

// Interface para a criação de um pedido
interface CreatePedidoBody {
    items: Array<{ productoId: number; cantidad: number }>;
    direccionEnvio: string;
    metodoPago: string;
}

// Interface para a criação de uma resenha (avaliação)
interface CreateResenaBody {
    puntuacion: number;
    comentario: string;
}

export class PedidoController {
    private pedidoService: PedidoService;

    constructor(fastify: FastifyInstance) {
        this.pedidoService = new PedidoService(fastify.prisma);
    }

    async create(
        request: FastifyRequest<{ Body: CreatePedidoBody }>,
        reply: FastifyReply
    ) {
        try {
            // request.user.id injetado pelo plugin de JWT
            const pedido = await this.pedidoService.createPedido(request.body, request.user.id as any as number);
            return pedido;
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    async createResena(
        request: FastifyRequest<{ Params: { id: string }, Body: CreateResenaBody }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params; // ID do pedido vindo da URL
            const resena = await this.pedidoService.addResena(
                parseInt(id),
                request.body,
                request.user.id as any as number
            );
            return resena;
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }
}