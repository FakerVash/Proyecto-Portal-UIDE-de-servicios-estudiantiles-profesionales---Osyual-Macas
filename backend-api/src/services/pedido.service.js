export class PedidoService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createPedido(data, clienteId) {
        // 1. Buscar el servicio para obtener su precio real
        const servicio = await this.prisma.servicio.findUnique({
            where: { id: data.servicioId },
        });

        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        if (!servicio.activo) {
            throw new Error('El servicio no está activo');
        }

        if (servicio.usuarioId === clienteId) {
            throw new Error('No puedes contratar tu propio servicio');
        }

        // 2. Calcular montos automáticamente
        const subtotal = parseFloat(servicio.precio);
        const comision = subtotal * 0.10; // 10% de comisión
        const total = subtotal + comision;

        // 3. Crear el pedido con todos los campos requeridos por la DB
        return await this.prisma.pedido.create({
            data: {
                servicioId: data.servicioId,
                clienteId: clienteId,
                subtotal: subtotal,
                comisionPlataforma: comision,
                montoTotal: total,
                notas: data.notas,
                fechaPedido: new Date(),
                estado: 'pendiente'
            },
            include: {
                servicio: true
            }
        });
    }

    async addResena(pedidoId, data, clienteId) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id: pedidoId },
        });

        if (!pedido) {
            throw new Error('Pedido no encontrado');
        }

        if (pedido.clienteId !== clienteId) {
            throw new Error('No autorizado para reseñar este pedido');
        }

        const existingResena = await this.prisma.resena.findUnique({
            where: { pedidoId },
        });

        if (existingResena) {
            throw new Error('Este pedido ya tiene una reseña');
        }

        return await this.prisma.resena.create({
            data: {
                pedidoId,
                servicioId: pedido.servicioId,
                calificacion: data.calificacion,
                comentario: data.comentario
            }
        });
    }
}
