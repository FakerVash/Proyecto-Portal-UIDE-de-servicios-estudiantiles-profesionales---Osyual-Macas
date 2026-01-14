export const createServicioSchema = {
    tags: ['3. CREAR (POST)'],
    description: 'Publicar un nuevo servicio (Estudiantes)',
    body: {
        type: 'object',
        required: ['categoriaId', 'titulo', 'descripcion', 'precio'],
        properties: {
            categoriaId: { type: 'integer' },
            titulo: { type: 'string', minLength: 5 },
            descripcion: { type: 'string', minLength: 10 },
            precio: { type: 'number' },
            tiempoEntrega: { type: 'string' },
            imagenPortada: { type: 'string' },
            contactoWhatsapp: { type: 'string' },
            contactoEmail: { type: 'string', format: 'email' },
            contactoTelefono: { type: 'string' },
        },
    },
};

export const getServiciosSchema = {
    tags: ['2. CONSULTAR (GET)'],
    description: 'Ver catálogo de servicios',
    querystring: {
        type: 'object',
        properties: {
            categoriaId: { type: 'integer' },
            search: { type: 'string' },
        },
    },
};

export const deleteServicioSchema = {
    tags: ['4. ELIMINAR (DELETE)'],
    description: 'Eliminar un servicio (Dueño o Admin)',
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        }
    }
};
