import { FastifyPluginAsync } from 'fastify';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { checkAdmin } from '../plugins/auth.js';

const usuarioRoutes: FastifyPluginAsync = async (fastify, opts) => {
    // GET /usuarios
    fastify.get('/', {
        schema: {
            description: 'Obtener todos los usuarios',
            tags: ['Usuarios'],
            response: {
                200: {
                    type: 'array',
                    items: { $ref: 'Usuario#' }
                }
            }
        }
    }, UsuarioController.getAll);

    // GET /usuarios/:id
    fastify.get('/:id', {
        schema: {
            description: 'Obtener un usuario por ID',
            tags: ['Usuarios'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer' }
                }
            },
            response: {
                200: { $ref: 'Usuario#' },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, UsuarioController.getById);

    // POST /usuarios (Registro)
    fastify.post('/', {
        schema: {
            description: 'Registrar un nuevo usuario',
            tags: ['Usuarios'],
            body: { $ref: 'CreateUsuario#' },
            response: {
                201: { $ref: 'Usuario#' }
            }
        }
    }, UsuarioController.create);

    // PATCH /usuarios/:id/status (Admin Only)
    fastify.patch('/:id/status', {
        preHandler: [checkAdmin],
        schema: {
            description: 'Activar/Desactivar usuario (Admin)',
            tags: ['Admin - Usuarios'],
            params: { type: 'object', properties: { id: { type: 'integer' } } },
            body: { type: 'object', required: ['activo'], properties: { activo: { type: 'boolean' } } },
            response: { 200: { $ref: 'Usuario#' } }
        }
    }, UsuarioController.updateStatus);

    // PUT /usuarios/me (Self-Profile Update)
    fastify.put('/me', {
        onRequest: [(fastify as any).authenticate],
        schema: {
            description: 'Editar mi propio perfil (Cliente)',
            tags: ['Usuarios'],
            security: [{ bearerAuth: [] }],
            body: { $ref: 'UpdateUsuario#' },
            response: { 200: { $ref: 'Usuario#' } }
        }
    }, UsuarioController.updateMe);
};

export default usuarioRoutes;
