export class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async sendMessage(emisorId, data) {
        const { receptorId, contenido } = data;

        // Buscar o crear conversación
        let conversacion = await this.prisma.conversacion.findFirst({
            where: {
                OR: [
                    { participante1Id: emisorId, participante2Id: receptorId },
                    { participante1Id: receptorId, participante2Id: emisorId }
                ]
            }
        });

        if (!conversacion) {
            conversacion = await this.prisma.conversacion.create({
                data: {
                    participante1Id: emisorId,
                    participante2Id: receptorId
                }
            });
        }

        const mensaje = await this.prisma.mensaje.create({
            data: {
                conversacionId: conversacion.id,
                emisorId: emisorId,
                contenido
            }
        });

        return mensaje;
    }

    async getConversaciones(usuarioId) {
        return await this.prisma.conversacion.findMany({
            where: {
                OR: [
                    { participante1Id: usuarioId },
                    { participante2Id: usuarioId }
                ]
            },
            include: {
                participante1: true,
                participante2: true,
                mensajes: {
                    orderBy: { fechaEnvio: 'desc' },
                    take: 1
                }
            }
        });
    }
}
