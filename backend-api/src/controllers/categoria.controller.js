import { CategoriaService } from '../services/categoria.service.js';

export class CategoriaController {
    constructor(fastify) {
        this.categoriaService = new CategoriaService(fastify.prisma);
    }

    async getAll(request, reply) {
        try {
            const categorias = await this.categoriaService.getAll();
            return categorias;
        } catch (error) {
            reply.code(500).send({ message: error.message });
        }
    }

    async create(request, reply) {
        try {
            const categoria = await this.categoriaService.create(request.body);
            reply.code(201).send(categoria);
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }

    async delete(request, reply) {
        try {
            await this.categoriaService.delete(parseInt(request.params.id));
            return { message: 'Categoría eliminada' };
        } catch (error) {
            reply.code(400).send({ message: error.message });
        }
    }
}
