import { FastifyRequest } from 'fastify';
import { UnauthorizedError, ForbiddenError } from './errors.js';
import { Rol } from '@prisma/client';

export interface JWTPayload {
    id: number;
    email: string;
    rol: Rol;
}

export const authenticate = async (request: FastifyRequest) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        throw new UnauthorizedError('Invalid or expired token');
    }
};

export const getCurrentUser = (request: FastifyRequest): JWTPayload => {
    const user = request.user as JWTPayload;
    if (!user) {
        throw new UnauthorizedError('User not authenticated');
    }
    return user;
};

export const requireRole = (request: FastifyRequest, ...roles: Rol[]) => {
    const user = getCurrentUser(request);
    if (!roles.includes(user.rol)) {
        throw new ForbiddenError(`Resource requires one of these roles: ${roles.join(', ')}`);
    }
};

export const isEstudiante = (request: FastifyRequest): boolean => {
    const user = request.user as JWTPayload;
    return user?.rol === 'ESTUDIANTE';
};

export const isAdmin = (request: FastifyRequest): boolean => {
    const user = request.user as JWTPayload;
    return user?.rol === 'ADMIN';
};
