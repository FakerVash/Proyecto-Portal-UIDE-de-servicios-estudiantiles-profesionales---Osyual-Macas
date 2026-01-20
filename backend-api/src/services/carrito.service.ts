import { PrismaClient } from '@prisma/client';

export class CarritoService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async add(clienteId: number, data: any) {
        return await this.prisma.carrito.create({
            data: {
                clienteId,
                servicioId: data.servicioId,
                horas: data.horas || 1
            }
        });
    }

    async getByUser(clienteId: number) {
        return await this.prisma.carrito.findMany({
            where: { clienteId },
            include: { servicio: true }
        });
    }

    async remove(id_carrito: number) {
        return await this.prisma.carrito.delete({
            where: { id: id_carrito }
        });
    }
}
