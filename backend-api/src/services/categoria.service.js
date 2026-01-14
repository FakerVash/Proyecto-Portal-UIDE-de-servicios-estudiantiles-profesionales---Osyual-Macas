export class CategoriaService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getAll() {
        return await this.prisma.categoria.findMany();
    }

    async create(data) {
        return await this.prisma.categoria.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                icono: data.icono
            }
        });
    }

    async delete(id) {
        return await this.prisma.categoria.delete({
            where: { id }
        });
    }
}
