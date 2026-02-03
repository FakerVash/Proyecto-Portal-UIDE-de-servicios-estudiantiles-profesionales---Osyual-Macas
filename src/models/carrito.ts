export interface CarritoDTO {
    id_carrito?: number;
    id_cliente: number;
    id_servicio: number;
    horas?: number;
    fecha_agregado?: Date;
}

export const CarritoSchema = {
    $id: 'Carrito',
    type: 'object',
    required: ['id_cliente', 'id_servicio'],
    properties: {
        id_carrito: { type: 'integer' },
        id_cliente: { type: 'integer' },
        id_servicio: { type: 'integer' },
        horas: { type: 'integer', default: 1 },
        fecha_agregado: { type: 'string', format: 'date-time' }
    }
};
