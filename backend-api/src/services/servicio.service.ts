import { PrismaClient } from '@prisma/client';

export class ServicioService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createServicio(data: any, usuarioId: number) {
        // Verificar si el usuario es estudiante
        const usuario = await this.prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario || usuario.rol !== 'ESTUDIANTE') {
            throw new Error('Solo los estudiantes pueden crear servicios');
        }

        // Crear el servicio
        return await this.prisma.servicio.create({
            data: {
                usuarioId,
                categoriaId: data.categoriaId,
                titulo: data.titulo,
                descripcion: data.descripcion,
                precio: data.precio,
                tiempoEntrega: data.tiempoEntrega,
                imagenPortada: data.imagenPortada,
                contactoWhatsapp: data.contactoWhatsapp,
                contactoEmail: data.contactoEmail,
                contactoTelefono: data.contactoTelefono,
            },
            include: {
                categoria: true,
                proveedor: {
                    select: { nombre: true, apellido: true, email: true }
                }
            }
        });
    }

    async getServicios(filters: any) {
        const where: any = { activo: true };

        if (filters.categoriaId) {
            where.categoriaId = parseInt(filters.categoriaId);
        }

        // Filtro por búsqueda de texto en título o descripción
        if (filters.search) {
            where.OR = [
                { titulo: { contains: filters.search } },
                { descripcion: { contains: filters.search } }
            ];
        }

        return await this.prisma.servicio.findMany({
            where,
            include: {
                categoria: true,
                proveedor: {
                    select: { id: true, nombre: true, apellido: true, fotoPerfil: true, carrera: true }
                }
            },
            orderBy: { fechaPublicacion: 'desc' }
        });
    }

    async delete(id: number, user: any) {
        const servicio = await this.prisma.servicio.findUnique({
            where: { id }
        });

        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        // Solo el dueño o un admin pueden eliminar
        if (servicio.usuarioId !== user.id && user.rol !== 'ADMIN') {
            throw new Error('No tienes permiso para eliminar este servicio');
        }

        return await this.prisma.servicio.delete({
            where: { id }
        });
    }
}
