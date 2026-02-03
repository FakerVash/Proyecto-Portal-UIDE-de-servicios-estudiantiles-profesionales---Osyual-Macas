import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginDTO } from '../models/auth.js';
import bcrypt from 'bcrypt';

export const AuthController = {
    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, contrasena } = request.body as LoginDTO;

        // Buscar al usuario por email
        const usuario = await request.server.prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return reply.status(401).send({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña con soporte para migración
        let isMatch = false;

        // Si la contraseña guardada parece un hash de bcrypt (empieza con $2)
        if (usuario.contrasena.startsWith('$2')) {
            isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        } else {
            // Fallback para contraseñas antiguas en texto plano
            if (usuario.contrasena === contrasena) {
                isMatch = true;
                // MIGRACIÓN AUTOMÁTICA: Hashear la contraseña insegura
                const hashedPassword = await bcrypt.hash(contrasena, 10);
                await request.server.prisma.usuario.update({
                    where: { id_usuario: usuario.id_usuario },
                    data: { contrasena: hashedPassword }
                });
            }
        }

        if (!isMatch) {
            return reply.status(401).send({ message: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return reply.status(403).send({ message: 'Usuario inactivo' });
        }

        // Generar token JWT
        const token = request.server.jwt.sign({
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            rol: usuario.rol
        });

        return {
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                rol: usuario.rol
            }
        };
    }
};
