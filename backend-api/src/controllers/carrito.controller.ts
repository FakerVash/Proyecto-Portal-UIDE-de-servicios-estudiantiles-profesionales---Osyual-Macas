import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CarritoService } from '../services/carrito.service.js';

// Interface para o corpo da requisição de adição ao carrinho
interface AddToCartBody {
    productoId: number;
    cantidad: number;
}

export class CarritoController {
    private carritoService: CarritoService;

    constructor(fastify: FastifyInstance) {
        // O TS reconhece .prisma graças à configuração de 'decorate' que fizemos anteriormente
        this.carritoService = new CarritoService(fastify.prisma);
    }

    async add(
        request: FastifyRequest<{ Body: AddToCartBody }>,
        reply: FastifyReply
    ) {
        try {
            // request.user.id é reconhecido devido ao module augmentation do @fastify/jwt
            const item = await this.carritoService.add(request.user.id as any as number, request.body);
            reply.code(201).send({ message: 'Agregado al carrito', item });
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    async getMine(request: FastifyRequest, reply: FastifyReply) {
        try {
            const items = await this.carritoService.getByUser(request.user.id as any as number);
            return items;
        } catch (error: any) {
            reply.code(500).send({ message: error.message });
        }
    }

    async remove(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            await this.carritoService.remove(parseInt(id));
            return { message: 'Eliminado del carrito' };
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }
}