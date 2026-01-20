export const registerSchema = {
    tags: ['1. AUTENTICACIÓN'],
    body: {
        type: 'object',
        required: ['email', 'password', 'nombre', 'apellido'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            nombre: { type: 'string' },
            apellido: { type: 'string' },
            rol: { type: 'string', enum: ['ESTUDIANTE', 'CLIENTE'] },
            telefono: { type: 'string' },
        },
    },
};

export const loginSchema = {
    tags: ['1. AUTENTICACIÓN'],
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
    },
};

export const deleteUserSchema = {
    tags: ['4. ELIMINAR (DELETE)'],
    description: 'Eliminar un usuario (Solo Admin)',
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        }
    }
};
