# Proyecto Portal de Servicios Estudiantiles UIDE

Este proyecto es una API REST diseñada para el Portal de Servicios Estudiantiles de la UIDE, construida con tecnologías modernas y siguiendo mejores prácticas de desarrollo.

## Resumen de lo Realizado

Se ha reconstruido completamente el directorio `src`, organizando el código en una arquitectura modular y escalable. A continuación se detallan los componentes implementados:

### ⚙️ Infraestructura Core
- **Servidor Fastify**: Configurado con soporte para TypeScript, validación con TypeBox y documentación automática con Swagger/OpenAPI.
- **Prisma ORM**: Integrado como plugin para la gestión eficiente de la base de datos MySQL.
- **Autenticación JWT**: Sistema de seguridad basado en tokens con control de acceso por roles (ADMIN, ESTUDIANTE, CLIENTE).
- **Gestión de Errores**: Clases personalizadas para respuestas de error consistentes (400, 401, 403, 404).

### 🚀 Módulos de la API

1.  **Usuarios (`/api/users`)**
    - Listado de usuarios con paginación (Admin).
    - Obtención de perfiles individuales.
    - Actualización de perfil (propio o Admin).
    - Desactivación de cuentas.

2.  **Servicios (`/api/servicios`)**
    - CRUD completo de servicios ofrecidos por estudiantes.
    - Búsqueda avanzada con filtros por categoría, carrera, facultad y rango de precios.
    - Integración con información del perfil del estudiante.

3.  **Catálogos (`/api/catalogos`)**
    - Endpoints públicos para consultar Facultades, Carreras y Categorías de servicios.

4.  **Pedidos y Reseñas (`/api/pedidos`)**
    - Gestión de pedidos entre clientes y proveedores.
    - Actualización del estado del pedido (Pendiente, En Proceso, Completado, Cancelado).
    - Sistema de reseñas y calificaciones para pedidos completados.

---

## Stack Tecnológico
- **Runtime**: Node.js v20+
- **Framework**: Fastify
- **Lenguaje**: TypeScript (ES Modules)
- **Base de Datos**: MySQL via Prisma ORM
- **Validación**: @sinclair/typebox
- **Documentación**: Swagger (OpenAPI 3.0)

---

## Cómo Ejecutar

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno**:
    Asegúrate de tener un archivo `.env` con:
    - `DATABASE_URL`: Conexión a MySQL.
    - `JWT_SECRET`: Llave para los tokens.

3.  **Preparar la base de datos**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Iniciar el servidor**:
    ```bash
    npm run dev
    ```

5.  **Ver Documentación**:
    Accede a `http://localhost:3000/docs` para probar los endpoints interactivamente.
