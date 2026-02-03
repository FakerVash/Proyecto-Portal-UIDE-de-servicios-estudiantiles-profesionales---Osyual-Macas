export interface FavoritoDTO {
    id_favorito?: number;
    id_usuario: number;
    id_servicio: number;
    fecha_agregado?: Date;
}

export const FavoritoSchema = {
    $id: 'Favorito',
    type: 'object',
    required: ['id_usuario', 'id_servicio'],
    properties: {
        id_favorito: { type: 'integer' },
        id_usuario: { type: 'integer' },
        id_servicio: { type: 'integer' },
        fecha_agregado: { type: 'string', format: 'date-time' }
    }
};
