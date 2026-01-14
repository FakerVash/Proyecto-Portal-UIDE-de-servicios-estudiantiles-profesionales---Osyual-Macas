import { Type, Static } from '@sinclair/typebox';

export const CreateTransactionSchema = Type.Object({
    servicioId: Type.Integer(),
    estudianteId: Type.Integer(),
    montoTotal: Type.Number(),
    horasContratadas: Type.Integer(),
    metodoPago: Type.Optional(Type.String()),
    notasCliente: Type.Optional(Type.String()),
});

export type CreateTransactionInput = Static<typeof CreateTransactionSchema>;

export const TransactionResponseSchema = Type.Object({
    id: Type.Integer(),
    clienteId: Type.Integer(),
    estudianteId: Type.Integer(),
    servicioId: Type.Integer(),
    montoTotal: Type.Number(),
    horasContratadas: Type.Integer(),
    estado: Type.String(),
    fechaTransaccion: Type.Any(),
});
