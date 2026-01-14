import { prisma } from '../../lib/prisma.js';
import { CreateTransactionInput } from './transaction.schema.js';
import { AppError } from '../../utils/errors.js';

export class TransactionService {
    async createTransaction(clienteId: number, data: CreateTransactionInput) {
        const transaction = await prisma.transaccion.create({
            data: {
                ...data,
                clienteId,
                montoTotal: data.montoTotal.toString(), // Prisma Decimal
            },
        });

        return {
            ...transaction,
            montoTotal: Number(transaction.montoTotal),
        };
    }

    async listUserTransactions(userId: number, role: 'cliente' | 'estudiante') {
        const where = role === 'cliente' ? { clienteId: userId } : { estudianteId: userId };

        const transactions = await prisma.transaccion.findMany({
            where,
            include: {
                servicio: true,
                cliente: {
                    select: { id: true, nombreCompleto: true }
                },
                estudiante: {
                    select: { id: true, nombreCompleto: true }
                }
            },
            orderBy: { fechaTransaccion: 'desc' }
        });

        return transactions.map(t => ({
            ...t,
            montoTotal: Number(t.montoTotal)
        }));
    }

    async updateStatus(id: number, status: string) {
        const transaction = await prisma.transaccion.update({
            where: { id },
            data: { estado: status as any }
        });

        return {
            ...transaction,
            montoTotal: Number(transaction.montoTotal)
        };
    }
}
