export interface LoginDTO {
    email: string;
    contrasena: string;
}

export interface AuthResponseDTO {
    token: string;
    usuario: {
        id_usuario: number;
        email: string;
        nombre: string;
        rol: string;
    };
}

export const LoginSchema = {
    $id: 'Login',
    type: 'object',
    required: ['email', 'contrasena'],
    properties: {
        email: { type: 'string', format: 'email' },
        contrasena: { type: 'string' }
    }
};

export const AuthResponseSchema = {
    $id: 'AuthResponse',
    type: 'object',
    properties: {
        token: { type: 'string' },
        usuario: {
            type: 'object',
            properties: {
                id_usuario: { type: 'integer' },
                email: { type: 'string' },
                nombre: { type: 'string' },
                rol: { type: 'string' }
            }
        }
    }
};
