export interface MensajeDTO {
    id_mensaje?: number;
    id_emisor: number;
    id_receptor: number;
    contenido: string;
    fecha_envio?: Date;
    leido?: boolean;
}

export const MensajeSchema = {
    $id: 'Mensaje',
    type: 'object',
    required: ['id_emisor', 'id_receptor', 'contenido'],
    properties: {
        id_mensaje: { type: 'integer' },
        id_emisor: { type: 'integer' },
        id_receptor: { type: 'integer' },
        contenido: { type: 'string' },
        fecha_envio: { type: 'string', format: 'date-time' },
        leido: { type: 'boolean', default: false }
    }
};
