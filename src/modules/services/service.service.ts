import { prisma } from '../../lib/prisma.js';
import { CreateServiceInput } from './service.schema.js';
import { AppError } from '../../utils/errors.js';

export class ServiceService {
    async listServices(filters?: { categoriaId?: number; query?: string }) {
        const where: any = {
            estado: 'activo',
        };

        if (filters?.categoriaId) {
            where.categoriaId = filters.categoriaId;
        }

        if (filters?.query) {
            where.OR = [
                { titulo: { contains: filters.query } },
                { descripcion: { contains: filters.query } },
            ];
        }

        const services = await prisma.servicio.findMany({
            where,
            include: {
                estudiante: {
                    select: {
                        id: true,
                        nombreCompleto: true,
                        avatarUrl: true,
                    },
                },
                categoria: true,
            },
        });

        return services.map(s => ({
            ...s,
            precioHora: Number(s.precioHora),
            calificacionPromedio: Number(s.calificacionPromedio),
        }));
    }

    async createService(userId: number, data: CreateServiceInput) {
        const service = await prisma.servicio.create({
            data: {
                ...data,
                estudianteId: userId,
                precioHora: data.precioHora.toString(), // Prisma Decimal
            },
        });

        return {
            ...service,
            precioHora: Number(service.precioHora),
            calificacionPromedio: Number(service.calificacionPromedio),
        };
    }

    async listCategories() {
        return prisma.categoria.findMany({
            where: { activa: true },
        });
    }

    async getService(id: number) {
        const service = await prisma.servicio.findUnique({
            where: { id },
            include: {
                estudiante: true,
                categoria: true,
                resenas: true,
            },
        });

        if (!service) {
            throw new AppError('Service not found', 404);
        }

        return {
            ...service,
            precioHora: Number(service.precioHora),
            calificacionPromedio: Number(service.calificacionPromedio),
        };
    }
}
