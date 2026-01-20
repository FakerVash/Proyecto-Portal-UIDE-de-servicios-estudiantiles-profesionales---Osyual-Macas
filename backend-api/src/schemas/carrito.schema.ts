export const addToCarritoSchema = {
    tags: ['3. CREAR (POST)'],
    description: 'Agregar un servicio al carrito',
    body: {
        type: 'object',
        required: ['servicioId'],
        properties: {
            servicioId: { type: 'integer' },
            horas: { type: 'integer', default: 1 }
        }
    }
};

export const getCarritoSchema = {
    tags: ['2. CONSULTAR (GET)'],
    description: 'Obtener el carrito del usuario actual',
};

export const deleteCarritoSchema = {
    tags: ['4. ELIMINAR (DELETE)'],
    description: 'Eliminar un item del carrito',
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        }
    }
};
