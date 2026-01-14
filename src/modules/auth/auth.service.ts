import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { AppError } from '../../utils/errors.js';

export class AuthService {
    async register(data: RegisterInput) {
        const existingUser = await prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.usuario.create({
            data: {
                nombreCompleto: data.nombreCompleto,
                email: data.email,
                passwordHash,
                rolId: data.rolId,
            },
        });

        return {
            id: user.id,
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            rolId: user.rolId,
        };
    }

    async login(data: LoginInput) {
        const user = await prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        return {
            id: user.id,
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            rolId: user.rolId,
        };
    }
}
