export const createPedidoSchema = {
    tags: ['3. CREAR (POST)'],
    description: 'Contratar un servicio (Solo Cliente)',
    body: {
        type: 'object',
        required: ['servicioId'],
        properties: {
            servicioId: { type: 'integer' },
            notas: { type: 'string' },
        },
    },
};

export const createResenaSchema = {
    tags: ['3. CREAR (POST)'],
    description: 'Calificar un pedido finalizado (Solo Cliente)',
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        }
    },
    body: {
        type: 'object',
        required: ['calificacion'],
        properties: {
            calificacion: { type: 'integer', minimum: 1, maximum: 5 },
            comentario: { type: 'string' },
        },
    },
};
