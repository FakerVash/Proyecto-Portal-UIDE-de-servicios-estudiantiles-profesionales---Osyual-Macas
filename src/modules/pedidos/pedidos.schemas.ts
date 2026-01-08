import { Type, Static } from '@sinclair/typebox';
import { EstadoPedidoSchema } from '../../types/index.js';

// Pedido Schemas
export const CreatePedidoBodySchema = Type.Object({
    servicioId: Type.Integer({ minimum: 1 }),
    notas: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const UpdatePedidoStatusBodySchema = Type.Object({
    estado: EstadoPedidoSchema,
});

export const PedidoResponseSchema = Type.Object({
    id: Type.Integer(),
    estado: EstadoPedidoSchema,
    fechaPedido: Type.String({ format: 'date-time' }),
    fechaEntrega: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
    montoTotal: Type.String(),
    notas: Type.Union([Type.String(), Type.Null()]),
    servicioId: Type.Integer(),
    clienteId: Type.Integer(),
    servicio: Type.Optional(Type.Object({
        id: Type.Integer(),
        titulo: Type.String(),
        precio: Type.String(),
    })),
    cliente: Type.Optional(Type.Object({
        id: Type.Integer(),
        nombre: Type.String(),
        apellido: Type.String(),
    })),
});

// Resena Schemas
export const CreateResenaBodySchema = Type.Object({
    pedidoId: Type.Integer({ minimum: 1 }),
    calificacion: Type.Integer({ minimum: 1, maximum: 5 }),
    comentario: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const ResenaResponseSchema = Type.Object({
    id: Type.Integer(),
    calificacion: Type.Integer(),
    comentario: Type.Union([Type.String(), Type.Null()]),
    fechaResena: Type.String({ format: 'date-time' }),
    pedidoId: Type.Integer(),
});

// Type exports
export type CreatePedidoBody = Static<typeof CreatePedidoBodySchema>;
export type UpdatePedidoStatusBody = Static<typeof UpdatePedidoStatusBodySchema>;
export type CreateResenaBody = Static<typeof CreateResenaBodySchema>;
