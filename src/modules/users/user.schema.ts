import { Type, Static } from '@sinclair/typebox';

export const UserUpdateSchema = Type.Object({
    nombreCompleto: Type.Optional(Type.String({ minLength: 3 })),
    telefono: Type.Optional(Type.String()),
    avatarUrl: Type.Optional(Type.String()),
    universidad: Type.Optional(Type.String()),
    carrera: Type.Optional(Type.String()),
    semestre: Type.Optional(Type.Integer()),
    biografia: Type.Optional(Type.String()),
});

export type UserUpdateInput = Static<typeof UserUpdateSchema>;

export const UserResponseFullSchema = Type.Object({
    id: Type.Integer(),
    nombreCompleto: Type.String(),
    email: Type.String(),
    telefono: Type.Union([Type.String(), Type.Null()]),
    avatarUrl: Type.Union([Type.String(), Type.Null()]),
    rolId: Type.Integer(),
    universidad: Type.Union([Type.String(), Type.Null()]),
    carrera: Type.Union([Type.String(), Type.Null()]),
    semestre: Type.Union([Type.Integer(), Type.Null()]),
    biografia: Type.Union([Type.String(), Type.Null()]),
    calificacionPromedio: Type.Number(),
});
