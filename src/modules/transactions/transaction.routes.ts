import { FastifyInstance } from 'fastify';
import { TransactionController } from './transaction.controller.js';
import { CreateTransactionSchema, TransactionResponseSchema } from './transaction.schema.js';

const transactionController = new TransactionController();

export async function transactionRoutes(app: FastifyInstance) {
    app.addHook('onRequest', async (request) => {
        await request.jwtVerify();
    });

    app.post('/', {
        schema: {
            body: CreateTransactionSchema,
            response: {
                201: TransactionResponseSchema
            }
        }
    }, transactionController.create);

    app.get('/me', {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: TransactionResponseSchema
                }
            }
        }
    }, transactionController.listMyTransactions);

    app.patch('/:id/status', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    estado: { type: 'string' }
                }
            },
            response: {
                200: TransactionResponseSchema
            }
        }
    }, transactionController.updateStatus);
}
