export const sendMessageSchema = {
    tags: ['3. CREAR (POST)'],
    description: 'Enviar un mensaje a un usuario',
    body: {
        type: 'object',
        required: ['receptorId', 'contenido'],
        properties: {
            receptorId: { type: 'integer' },
            contenido: { type: 'string' }
        }
    }
};

export const getConversacionesSchema = {
    tags: ['2. CONSULTAR (GET)'],
    description: 'Obtener lista de conversaciones del usuario',
};
