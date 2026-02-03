export interface UserContext {
    id: number;
    role: string;
}

export function buildRLSFilter(tabla: string, user: UserContext) {
    const filtros: Record<string, { clause: string, params: any[] }> = {
        'mensajes': {
            clause: "(id_emisor = ? OR id_receptor = ?)",
            params: [user.id, user.id]
        },
        'pedidos': {
            clause: "id_cliente = ?",
            params: [user.id]
        },
        'notificaciones': {
            clause: "id_usuario = ?",
            params: [user.id]
        },
        'carritos': {
            clause: "id_cliente = ?",
            params: [user.id]
        },
        'favoritos': {
            clause: "id_usuario = ?",
            params: [user.id]
        }
    };

    return filtros[tabla] || { clause: "1=1", params: [] };
}