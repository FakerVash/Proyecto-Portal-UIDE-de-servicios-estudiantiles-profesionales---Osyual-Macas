import { Type, Static } from '@sinclair/typebox';

export const RegisterSchema = Type.Object({
    nombreCompleto: Type.String({ minLength: 3 }),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 6 }),
    rolId: Type.Integer(),
});

export type RegisterInput = Static<typeof RegisterSchema>;

export const LoginSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String(),
});

export type LoginInput = Static<typeof LoginSchema>;

export const UserResponseSchema = Type.Object({
    id: Type.Integer(),
    nombreCompleto: Type.String(),
    email: Type.String(),
    rolId: Type.Integer(),
});

export const AuthResponseSchema = Type.Object({
    user: UserResponseSchema,
    token: Type.String(),
});
