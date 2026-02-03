import { FastifyReply, FastifyRequest } from 'fastify';
import { UsuarioDTO } from '../models/usuario.js';
import bcrypt from 'bcrypt';

export const UsuarioController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const usuarios = await request.server.prisma.usuario.findMany({
            include: { carrera: true }
        });
        // Excluir contraseña de la respuesta
        const usuariosSinPass = usuarios.map(({ contrasena, ...rest }) => rest);
        return usuariosSinPass;
    },

    async getById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const usuario = await request.server.prisma.usuario.findUnique({
            where: { id_usuario: parseInt(id) },
            include: { carrera: true, servicios: true }
        });
        if (!usuario) return reply.status(404).send({ message: 'Usuario no encontrado' });

        // Excluir contraseña
        const { contrasena, ...usuarioSinPass } = usuario;
        return usuarioSinPass;
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as UsuarioDTO;
        const hashedPassword = await bcrypt.hash(body.contrasena, 10);
        const nuevoUsuario = await request.server.prisma.usuario.create({
            data: {
                email: body.email,
                contrasena: hashedPassword,
                nombre: body.nombre,
                apellido: body.apellido,
                telefono: body.telefono,
                id_carrera: body.id_carrera,
                rol: body.rol || 'CLIENTE'
            }
        });
        return reply.status(201).send(nuevoUsuario);
    },

    async updateStatus(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const { activo } = request.body as { activo: boolean };
        const usuario = await request.server.prisma.usuario.update({
            where: { id_usuario: parseInt(id) },
            data: { activo }
        });
        return usuario;
    },

    async updateMe(request: FastifyRequest, reply: FastifyReply) {
        // Obtener usuario del token JWT
        const user = request.user as { id_usuario: number; email: string; rol: string };

        if (!user || !user.id_usuario) {
            return reply.status(401).send({ message: 'No autorizado' });
        }

        const id_usuario = user.id_usuario;
        const body = request.body as Partial<UsuarioDTO>;

        // Evitar cambios de rol o ID por parte del cliente
        delete body.rol;
        delete body.id_usuario;

        // Si se actualiza la contraseña, hashearla
        if (body.contrasena) {
            body.contrasena = await bcrypt.hash(body.contrasena, 10);
        }

        const usuario = await request.server.prisma.usuario.update({
            where: { id_usuario },
            data: body
        });

        const { contrasena, ...usuarioSinPass } = usuario;
        return usuarioSinPass;
    }
};
