export interface ServicioDTO {
    id_servicio?: number;
    id_usuario: number;
    id_categoria: number;
    titulo: string;
    descripcion: string;
    precio: number;
    tiempo_entrega?: string;
    imagen_portada?: string;
    fecha_publicacion?: Date;
    activo?: boolean;
}

export const ServicioSchema = {
    $id: 'Servicio',
    type: 'object',
    required: ['id_usuario', 'id_categoria', 'titulo', 'descripcion', 'precio'],
    properties: {
        id_servicio: { type: 'integer' },
        id_usuario: { type: 'integer' },
        id_categoria: { type: 'integer' },
        titulo: { type: 'string' },
        descripcion: { type: 'string' },
        precio: { type: 'number' },
        tiempo_entrega: { type: 'string', nullable: true },
        imagen_portada: { type: 'string', nullable: true },
        fecha_publicacion: { type: 'string', format: 'date-time' },
        activo: { type: 'boolean', default: true }
    }
};
