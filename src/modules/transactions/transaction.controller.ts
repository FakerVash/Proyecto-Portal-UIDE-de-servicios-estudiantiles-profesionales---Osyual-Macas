import { FastifyReply, FastifyRequest } from 'fastify';
import { TransactionService } from './transaction.service.js';
import { CreateTransactionInput } from './transaction.schema.js';

const transactionService = new TransactionService();

export class TransactionController {
    async create(request: FastifyRequest<{ Body: CreateTransactionInput }>, reply: FastifyReply) {
        const userId = (request.user as any).id;
        const transaction = await transactionService.createTransaction(userId, request.body);
        return reply.status(201).send(transaction);
    }

    async listMyTransactions(request: FastifyRequest, reply: FastifyReply) {
        const userId = (request.user as any).id;
        // For simplicity, we check both roles or the user can specify
        const transactions = await transactionService.listUserTransactions(userId, 'cliente');
        return reply.send(transactions);
    }

    async updateStatus(request: FastifyRequest<{ Params: { id: number }; Body: { estado: string } }>, reply: FastifyReply) {
        const transaction = await transactionService.updateStatus(Number(request.params.id), request.body.estado);
        return reply.send(transaction);
    }
}
