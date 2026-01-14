export class CarritoService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async add(clienteId, data) {
        return await this.prisma.carrito.create({
            data: {
                clienteId,
                servicioId: data.servicioId,
                horas: data.horas || 1
            }
        });
    }

    async getByUser(clienteId) {
        return await this.prisma.carrito.findMany({
            where: { clienteId },
            include: { servicio: true }
        });
    }

    async remove(id_carrito) {
        return await this.prisma.carrito.delete({
            where: { id: id_carrito }
        });
    }
}
