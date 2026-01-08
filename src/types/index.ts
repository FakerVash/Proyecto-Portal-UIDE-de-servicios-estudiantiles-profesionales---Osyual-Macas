import { Type, Static, TSchema } from '@sinclair/typebox';

// Common schemas
export const IdParamSchema = Type.Object({
    id: Type.Integer({ minimum: 1 }),
});

export const PaginationSchema = Type.Object({
    page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
});

export const EmailSchema = Type.String({
    format: 'email',
    minLength: 5,
    maxLength: 255,
});

export const PasswordSchema = Type.String({
    minLength: 6,
    maxLength: 100,
});

// Response wrappers
export const SuccessResponseSchema = <T extends TSchema>(dataSchema: T) =>
    Type.Object({
        success: Type.Literal(true),
        data: dataSchema,
    });

export const ErrorResponseSchema = Type.Object({
    success: Type.Literal(false),
    error: Type.Object({
        message: Type.String(),
        statusCode: Type.Integer(),
        details: Type.Optional(Type.Any()),
    }),
});

// Enum schemas
export const RolSchema = Type.Union([
    Type.Literal('ESTUDIANTE'),
    Type.Literal('CLIENTE'),
    Type.Literal('ADMIN'),
]);

export const EstadoPedidoSchema = Type.Union([
    Type.Literal('PENDIENTE'),
    Type.Literal('EN_PROCESO'),
    Type.Literal('COMPLETADO'),
    Type.Literal('CANCELADO'),
]);

// Type exports
export type IdParam = Static<typeof IdParamSchema>;
export type Pagination = Static<typeof PaginationSchema>;
