export const registerSchema = {
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
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
    },
};
