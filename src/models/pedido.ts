export interface PedidoDTO {
    id_pedido?: number;
    id_servicio: number;
    id_cliente: number;
    estado?: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
    monto_total: number;
    fecha_pedido?: Date;
    fecha_entrega?: Date;
    notas?: string;
}

export const PedidoSchema = {
    $id: 'Pedido',
    type: 'object',
    required: ['id_servicio', 'id_cliente', 'monto_total'],
    properties: {
        id_pedido: { type: 'integer' },
        id_servicio: { type: 'integer' },
        id_cliente: { type: 'integer' },
        estado: { type: 'string', enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'], default: 'pendiente' },
        monto_total: { type: 'number' },
        fecha_pedido: { type: 'string', format: 'date-time' },
        fecha_entrega: { type: 'string', format: 'date-time', nullable: true },
        notas: { type: 'string', nullable: true }
    }
};
