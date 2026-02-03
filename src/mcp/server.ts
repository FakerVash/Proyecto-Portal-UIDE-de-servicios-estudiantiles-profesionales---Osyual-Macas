import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildRLSFilter } from '../middleware/rls.js';


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL!,
    waitForConnections: true,
    connectionLimit: 10
});

const currentUser = {
    id: parseInt(process.env.MCP_USER_ID || "1"),
    role: process.env.MCP_USER_ROLE || "ESTUDIANTE"
};

const server = new McpServer({
    name: "servicios-estudiantiles-mcp",
    version: "1.0.0"
});

async function ejecutar(query: string, params: any[] = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return { content: [{ type: "text" as const, text: JSON.stringify(rows, null, 2) }] };
    } catch (error: any) {
        return { isError: true, content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    }
}

// === TOOLS CON RLS ===

server.tool(
    "obtener_mis_mensajes",
    "Ver mis conversaciones",
    { limite: z.number().default(10) },
    async ({ limite }) => {
        const f = buildRLSFilter('mensajes', currentUser);
        return ejecutar(`
            SELECT m.*, e.nombre as emisor, r.nombre as receptor
            FROM mensajes m
            JOIN usuarios e ON m.id_emisor = e.id_usuario
            JOIN usuarios r ON m.id_receptor = r.id_usuario
            WHERE ${f.clause} ORDER BY m.fecha_envio DESC LIMIT ?
        `, [...f.params, limite]);
    }
);

server.tool(
    "obtener_mis_pedidos",
    "Ver mis pedidos",
    { estado: z.enum(['pendiente', 'en_proceso', 'completado', 'cancelado']).optional() },
    async ({ estado }) => {
        const f = buildRLSFilter('pedidos', currentUser);
        let query = `SELECT p.*, s.titulo as servicio FROM pedidos p 
                     JOIN servicios s ON p.id_servicio = s.id_servicio WHERE ${f.clause}`;
        const params = [...f.params];
        if (estado) { query += " AND p.estado = ?"; params.push(estado); }
        return ejecutar(query + " ORDER BY p.fecha_pedido DESC", params);
    }
);

server.tool(
    "obtener_mis_notificaciones",
    "Ver mis alertas",
    { solo_no_leidas: z.boolean().default(false) },
    async ({ solo_no_leidas }) => {
        const f = buildRLSFilter('notificaciones', currentUser);
        let query = `SELECT * FROM notificaciones WHERE ${f.clause}`;
        if (solo_no_leidas) query += " AND leido = FALSE";
        return ejecutar(query + " ORDER BY fecha_notificacion DESC", f.params);
    }
);

server.tool(
    "obtener_mi_carrito",
    "Ver mi carrito",
    {},
    async () => {
        const f = buildRLSFilter('carritos', currentUser);
        return ejecutar(`
            SELECT c.*, s.titulo, s.precio, (c.horas * s.precio) as subtotal
            FROM carritos c JOIN servicios s ON c.id_servicio = s.id_servicio
            WHERE ${f.clause}
        `, f.params);
    }
);

// === TOOLS PÚBLICOS ===

server.tool(
    "buscar_servicios",
    "Buscar en marketplace",
    {
        termino: z.string().optional(),
        categoria: z.number().optional()
    },
    async ({ termino, categoria }) => {
        let query = `SELECT s.*, c.nombre_categoria, u.nombre as prestador
                     FROM servicios s
                     JOIN categorias c ON s.id_categoria = c.id_categoria
                     JOIN usuarios u ON s.id_usuario = u.id_usuario
                     WHERE s.activo = TRUE`;
        const params: any[] = [];
        if (termino) { query += " AND (s.titulo LIKE ? OR s.descripcion LIKE ?)"; params.push(`%${termino}%`, `%${termino}%`); }
        if (categoria) { query += " AND s.id_categoria = ?"; params.push(categoria); }
        return ejecutar(query + " LIMIT 20", params);
    }
);

server.tool(
    "obtener_facultades",
    "Ver lista de facultades",
    {},
    async () => {
        return ejecutar("SELECT * FROM facultades ORDER BY nombre_facultad ASC");
    }
);

server.tool(
    "obtener_carreras",
    "Ver carreras por facultad",
    { id_facultad: z.number().optional() },
    async ({ id_facultad }) => {
        let query = "SELECT c.*, f.nombre_facultad FROM carreras c JOIN facultades f ON c.id_facultad = f.id_facultad";
        const params: any[] = [];
        if (id_facultad) { query += " WHERE c.id_facultad = ?"; params.push(id_facultad); }
        return ejecutar(query + " ORDER BY c.nombre_carrera ASC", params);
    }
);

server.tool(
    "obtener_perfil_publico",
    "Ver perfil público de usuario",
    { id_usuario: z.number() },
    async ({ id_usuario }) => {
        const [rows] = await pool.execute(`
            SELECT u.id_usuario, u.nombre, u.apellido, u.rol, u.foto_perfil, 
                   u.calificacion_promedio, c.nombre_carrera
            FROM usuarios u LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
            WHERE u.id_usuario = ? AND u.activo = TRUE
        `, [id_usuario]) as [any[], any];

        if (rows.length === 0) {
            return { content: [{ type: "text" as const, text: "Usuario no encontrado" }] };
        }
        const u = rows[0];
        return {
            content: [{
                type: "text" as const,
                text: JSON.stringify({
                    id: u.id_usuario,
                    nombre: `${u.nombre} ${u.apellido}`,
                    rol: u.rol,
                    carrera: u.nombre_carrera || "No especificada",
                    calificacion: u.calificacion_promedio
                }, null, 2)
            }]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`MCP iniciado - Usuario ID: ${currentUser.id}`);
}

main().catch(console.error);