import { PrismaClient } from '@prisma/client';

export class CategoriaService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getAll() {
        return await this.prisma.categoria.findMany();
    }

    async create(data: any) {
        return await this.prisma.categoria.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                icono: data.icono
            }
        });
    }

    async delete(id: number) {
        return await this.prisma.categoria.delete({
            where: { id }
        });
    }
}
