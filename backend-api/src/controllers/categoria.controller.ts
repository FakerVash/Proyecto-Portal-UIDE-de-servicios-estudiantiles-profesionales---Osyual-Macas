import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CategoriaService } from '../services/categoria.service.js';

// Interface para a criação de categoria
interface CreateCategoriaBody {
    nombre: string;
    descripcion?: string;
}

export class CategoriaController {
    private categoriaService: CategoriaService;

    constructor(fastify: FastifyInstance) {
        this.categoriaService = new CategoriaService(fastify.prisma);
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const categorias = await this.categoriaService.getAll();
            return categorias;
        } catch (error: any) {
            reply.code(500).send({ message: error.message });
        }
    }

    async create(
        request: FastifyRequest<{ Body: CreateCategoriaBody }>,
        reply: FastifyReply
    ) {
        try {
            const categoria = await this.categoriaService.create(request.body);
            reply.code(201).send(categoria);
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    async delete(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            await this.categoriaService.delete(parseInt(id));
            return { message: 'Categoría eliminada' };
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }
}