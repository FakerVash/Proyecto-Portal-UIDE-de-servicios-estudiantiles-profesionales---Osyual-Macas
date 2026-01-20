import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ServicioService } from '../services/servicio.service.js';

// Interface para criação de serviço
interface CreateServicioBody {
    nombre: string;
    descripcion: string;
    precio: number;
    categoriaId: number;
}

// Interface para filtros de busca (Query String)
interface GetServiciosQuery {
    categoriaId?: string;
    search?: string;
}

export class ServicioController {
    private servicioService: ServicioService;

    constructor(fastify: FastifyInstance) {
        this.servicioService = new ServicioService(fastify.prisma);
    }

    async create(
        request: FastifyRequest<{ Body: CreateServicioBody }>,
        reply: FastifyReply
    ) {
        try {
            const servicio = await this.servicioService.createServicio(request.body, request.user.id as any as number);
            reply.code(201).send(servicio);
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }

    async getAll(
        request: FastifyRequest<{ Querystring: GetServiciosQuery }>,
        reply: FastifyReply
    ) {
        try {
            // request.query agora está tipado e seguro para uso
            const servicios = await this.servicioService.getServicios(request.query);
            return servicios;
        } catch (error: any) {
            reply.code(500).send({ message: error.message });
        }
    }

    async delete(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            // Passamos request.user (objeto completo do payload JWT) para validação de posse no Service
            await this.servicioService.delete(parseInt(request.params.id), request.user);
            return { message: 'Servicio eliminado' };
        } catch (error: any) {
            reply.code(400).send({ message: error.message });
        }
    }
}