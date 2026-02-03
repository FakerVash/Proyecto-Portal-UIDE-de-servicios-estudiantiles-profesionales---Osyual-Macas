export interface NotificacionDTO {
    id_notificacion?: number;
    id_usuario: number;
    titulo: string;
    mensaje: string;
    leido?: boolean;
    tipo?: 'pedido' | 'mensaje' | 'sistema';
    fecha_notificacion?: Date;
}

export const NotificacionSchema = {
    $id: 'Notificacion',
    type: 'object',
    required: ['id_usuario', 'titulo', 'mensaje'],
    properties: {
        id_notificacion: { type: 'integer' },
        id_usuario: { type: 'integer' },
        titulo: { type: 'string' },
        mensaje: { type: 'string' },
        leido: { type: 'boolean', default: false },
        tipo: { type: 'string', enum: ['pedido', 'mensaje', 'sistema'], default: 'sistema' },
        fecha_notificacion: { type: 'string', format: 'date-time' }
    }
};
