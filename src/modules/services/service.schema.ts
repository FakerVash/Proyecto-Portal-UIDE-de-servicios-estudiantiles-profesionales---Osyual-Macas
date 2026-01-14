import { Type, Static } from '@sinclair/typebox';

export const CreateServiceSchema = Type.Object({
    titulo: Type.String({ minLength: 5 }),
    descripcion: Type.String({ minLength: 10 }),
    categoriaId: Type.Integer(),
    precioHora: Type.Number(),
    imageUrl: Type.Optional(Type.String()),
    duracionMinima: Type.Optional(Type.Integer()),
    disponibilidad: Type.Optional(Type.Any()),
});

export type CreateServiceInput = Static<typeof CreateServiceSchema>;

export const ServiceResponseSchema = Type.Object({
    id: Type.Integer(),
    titulo: Type.String(),
    descripcion: Type.String(),
    categoriaId: Type.Integer(),
    precioHora: Type.Number(),
    imageUrl: Type.Union([Type.String(), Type.Null()]),
    estudianteId: Type.Integer(),
    estado: Type.String(),
    calificacionPromedio: Type.Number(),
    fechaCreacion: Type.Any(),
});

export const CategoryResponseSchema = Type.Object({
    id: Type.Integer(),
    nombre: Type.String(),
    icono: Type.Union([Type.String(), Type.Null()]),
    descripcion: Type.Union([Type.String(), Type.Null()]),
});
