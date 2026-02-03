import { FastifyPluginAsync } from 'fastify';
import { FavoritoController } from '../controllers/favorito.controller.js';

const favoritoRoutes: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/', {
        schema: {
            description: 'Obtener mis favoritos',
            tags: ['Cliente - Favoritos'],
            headers: { type: 'object', properties: { 'x-usuario-id': { type: 'string' } } },
            response: { 200: { type: 'array', items: { $ref: 'Favorito#' } } }
        }
    }, FavoritoController.getMyFavorites);

    fastify.post('/toggle', {
        schema: {
            description: 'Añadir/Quitar de favoritos',
            tags: ['Cliente - Favoritos'],
            body: { $ref: 'Favorito#' },
            response: { 200: { type: 'object', properties: { message: { type: 'string' } } }, 201: { $ref: 'Favorito#' } }
        }
    }, FavoritoController.toggle);
};

export default favoritoRoutes;
