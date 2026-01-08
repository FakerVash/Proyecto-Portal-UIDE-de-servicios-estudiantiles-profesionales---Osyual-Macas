import { Type, Static } from '@sinclair/typebox';
import { PaginationSchema, RolSchema } from '../../types/index.js';

// User response schema
export const UserResponseSchema = Type.Object({
    id: Type.Integer(),
    email: Type.String(),
    nombre: Type.String(),
    apellido: Type.String(),
    telefono: Type.Union([Type.String(), Type.Null()]),
    rol: RolSchema,
    fotoPerfil: Type.Union([Type.String(), Type.Null()]),
    activo: Type.Boolean(),
    fechaRegistro: Type.String({ format: 'date-time' }),
    carrera: Type.Optional(
        Type.Union([
            Type.Object({
                id: Type.Integer(),
                nombre: Type.String(),
            }),
            Type.Null(),
        ])
    ),
});

// Update user body schema
export const UpdateUserBodySchema = Type.Partial(
    Type.Object({
        nombre: Type.String({ minLength: 1 }),
        apellido: Type.String({ minLength: 1 }),
        telefono: Type.String(),
        fotoPerfil: Type.String(),
        activo: Type.Boolean(),
    })
);

// List users query schema
export const ListUsersQuerySchema = Type.Intersect([
    PaginationSchema,
    Type.Object({
        rol: Type.Optional(RolSchema),
        activo: Type.Optional(Type.Boolean()),
    }),
]);

// List users response schema
export const ListUsersResponseSchema = Type.Object({
    users: Type.Array(UserResponseSchema),
    pagination: Type.Object({
        page: Type.Integer(),
        limit: Type.Integer(),
        total: Type.Integer(),
        totalPages: Type.Integer(),
    }),
});

// Type exports
export type UserResponse = Static<typeof UserResponseSchema>;
export type UpdateUserBody = Static<typeof UpdateUserBodySchema>;
export type ListUsersQuery = Static<typeof ListUsersQuerySchema>;
