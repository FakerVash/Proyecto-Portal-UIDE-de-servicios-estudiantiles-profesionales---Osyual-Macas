import { prisma } from '../../lib/prisma.js';
import { UserUpdateInput } from './user.schema.js';
import { AppError } from '../../utils/errors.js';

export class UserService {
    async getProfile(userId: number) {
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                role: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Convert Decimal to Number for JSON serialization
        return {
            ...user,
            calificacionPromedio: Number(user.calificacionPromedio),
        };
    }

    async updateProfile(userId: number, data: UserUpdateInput) {
        const user = await prisma.usuario.update({
            where: { id: userId },
            data,
        });

        return {
            ...user,
            calificacionPromedio: Number(user.calificacionPromedio),
        };
    }

    async getAllUsers() {
        const users = await prisma.usuario.findMany({
            include: {
                role: true,
            },
        });

        return users.map(u => ({
            ...u,
            calificacionPromedio: Number(u.calificacionPromedio)
        }));
    }
}
