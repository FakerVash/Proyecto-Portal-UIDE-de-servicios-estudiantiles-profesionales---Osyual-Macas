export const getCategoriasSchema = {
    tags: ['2. CONSULTAR (GET)'],
    description: 'Obtener lista de categorías',
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' },
                    icono: { type: 'string' }
                }
            }
        }
    }
};

export const createCategoriaSchema = {
    tags: ['3. CREAR (POST)'],
    description: 'Crear una nueva categoría (Solo Admin)',
    body: {
        type: 'object',
        required: ['nombre'],
        properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            icono: { type: 'string' }
        }
    }
};

export const deleteCategoriaSchema = {
    tags: ['4. ELIMINAR (DELETE)'],
    description: 'Eliminar una categoría (Solo Admin)',
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        }
    }
};
