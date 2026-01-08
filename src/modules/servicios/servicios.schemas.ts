import { Type, Static } from '@sinclair/typebox';
import { PaginationSchema } from '../../types/index.js';

// Create servicio schema
export const CreateServicioBodySchema = Type.Object({
    titulo: Type.String({ minLength: 1, maxLength: 255 }),
    descripcion: Type.String({ minLength: 1 }),
    precio: Type.Number({ minimum: 0 }),
    tiempoEntrega: Type.Optional(Type.Union([Type.String({ maxLength: 100 }), Type.Null()])),
    imagenPortada: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    contactoWhatsapp: Type.Optional(Type.Union([Type.String({ maxLength: 50 }), Type.Null()])),
    contactoEmail: Type.Optional(Type.Union([Type.String({ format: 'email' }), Type.Null()])),
    contactoTelefono: Type.Optional(Type.Union([Type.String({ maxLength: 20 }), Type.Null()])),
    categoriaId: Type.Integer({ minimum: 1 }),
});

// Update servicio schema
export const UpdateServicioBodySchema = Type.Object({
    titulo: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    descripcion: Type.Optional(Type.String({ minLength: 1 })),
    precio: Type.Optional(Type.Number({ minimum: 0 })),
    tiempoEntrega: Type.Optional(Type.Union([Type.String({ maxLength: 100 }), Type.Null()])),
    imagenPortada: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    contactoWhatsapp: Type.Optional(Type.Union([Type.String({ maxLength: 50 }), Type.Null()])),
    contactoEmail: Type.Optional(Type.Union([Type.String({ format: 'email' }), Type.Null()])),
    contactoTelefono: Type.Optional(Type.Union([Type.String({ maxLength: 20 }), Type.Null()])),
    categoriaId: Type.Optional(Type.Integer({ minimum: 1 })),
    activo: Type.Optional(Type.Boolean()),
});

// List servicios query
export const ListServiciosQuerySchema = Type.Intersect([
    PaginationSchema,
    Type.Object({
        categoriaId: Type.Optional(Type.Integer({ minimum: 1 })),
        carreraId: Type.Optional(Type.Integer({ minimum: 1 })),
        facultadId: Type.Optional(Type.Integer({ minimum: 1 })),
        precioMin: Type.Optional(Type.Number({ minimum: 0 })),
        precioMax: Type.Optional(Type.Number({ minimum: 0 })),
        activo: Type.Optional(Type.Boolean()),
        search: Type.Optional(Type.String()),
    }),
]);

// Servicio response schema
export const ServicioResponseSchema = Type.Object({
    id: Type.Integer(),
    titulo: Type.String(),
    descripcion: Type.String(),
    precio: Type.String(),
    tiempoEntrega: Type.Union([Type.String(), Type.Null()]),
    imagenPortada: Type.Union([Type.String(), Type.Null()]),
    contactoWhatsapp: Type.Union([Type.String(), Type.Null()]),
    contactoEmail: Type.Union([Type.String(), Type.Null()]),
    contactoTelefono: Type.Union([Type.String(), Type.Null()]),
    fechaPublicacion: Type.String({ format: 'date-time' }),
    activo: Type.Boolean(),
    categoria: Type.Object({
        id: Type.Integer(),
        nombre: Type.String(),
    }),
    usuario: Type.Object({
        id: Type.Integer(),
        nombre: Type.String(),
        apellido: Type.String(),
        fotoPerfil: Type.Union([Type.String(), Type.Null()]),
        carrera: Type.Optional(
            Type.Union([
                Type.Object({
                    id: Type.Integer(),
                    nombre: Type.String(),
                    facultad: Type.Object({
                        id: Type.Integer(),
                        nombre: Type.String(),
                    }),
                }),
                Type.Null(),
            ])
        ),
    }),
});

// List servicios response
export const ListServiciosResponseSchema = Type.Object({
    servicios: Type.Array(ServicioResponseSchema),
    pagination: Type.Object({
        page: Type.Integer(),
        limit: Type.Integer(),
        total: Type.Integer(),
        totalPages: Type.Integer(),
    }),
});

// Type exports
export type CreateServicioBody = Static<typeof CreateServicioBodySchema>;
export type UpdateServicioBody = Static<typeof UpdateServicioBodySchema>;
export type ListServiciosQuery = Static<typeof ListServiciosQuerySchema>;
export type ServicioResponse = Static<typeof ServicioResponseSchema>;
export type ListServiciosResponse = Static<typeof ListServiciosResponseSchema>;
