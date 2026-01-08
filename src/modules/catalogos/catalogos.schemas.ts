import { Type, Static } from '@sinclair/typebox';

// Categoria Schemas
export const CategoriaResponseSchema = Type.Object({
    id: Type.Integer(),
    nombre: Type.String(),
    descripcion: Type.Union([Type.String(), Type.Null()]),
});

// Facultad Schemas
export const FacultadResponseSchema = Type.Object({
    id: Type.Integer(),
    nombre: Type.String(),
});

// Carrera Schemas
export const CarreraResponseSchema = Type.Object({
    id: Type.Integer(),
    nombre: Type.String(),
    facultadId: Type.Integer(),
});

export const CarreraWithFacultadSchema = Type.Intersect([
    CarreraResponseSchema,
    Type.Object({
        facultad: FacultadResponseSchema,
    }),
]);

// Type exports
export type CategoriaResponse = Static<typeof CategoriaResponseSchema>;
export type FacultadResponse = Static<typeof FacultadResponseSchema>;
export type CarreraResponse = Static<typeof CarreraResponseSchema>;
