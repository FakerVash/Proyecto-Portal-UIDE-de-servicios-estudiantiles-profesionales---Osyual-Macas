import { ServicioController } from '../controllers/servicio.controller.js';
import { createServicioSchema, getServiciosSchema, deleteServicioSchema } from '../schemas/servicio.schema.js';

export default async function servicioRoutes(fastify, opts) {
    const controller = new ServicioController(fastify);

    // Ruta pública para ver servicios
    fastify.get('/', { schema: getServiciosSchema }, (req, rep) => controller.getAll(req, rep));

    // Ruta protegida para crear servicios (Solo estudiantes)
    fastify.post('/', {
        schema: createServicioSchema,
        onRequest: [fastify.authenticate, fastify.checkRoles(['ESTUDIANTE', 'ADMIN'])]
    }, (req, rep) => controller.create(req, rep));

    // Eliminar servicio (Dueño o Admin)
    fastify.delete('/:id', {
        schema: deleteServicioSchema,
        onRequest: [fastify.authenticate]
    }, (req, rep) => controller.delete(req, rep));
}
