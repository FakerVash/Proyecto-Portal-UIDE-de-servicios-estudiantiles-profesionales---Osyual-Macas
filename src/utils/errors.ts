export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (error: any) => {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            body: {
                status: 'error',
                message: error.message,
            },
        };
    }

    // Prisma unique constraint error
    if (error.code === 'P2002') {
        return {
            statusCode: 400,
            body: {
                status: 'error',
                message: `Duplicate field: ${error.meta?.target}`,
            },
        };
    }

    console.error('Unexpected Error:', error);
    return {
        statusCode: 500,
        body: {
            status: 'error',
            message: 'Something went very wrong!',
        },
    };
};
