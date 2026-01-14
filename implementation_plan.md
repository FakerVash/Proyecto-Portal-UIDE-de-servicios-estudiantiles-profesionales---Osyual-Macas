# Plan de Implementación: API REST (Fastify + Prisma + MySQL)

Este documento detalla el plan técnico para construir el backend del "Portal de Servicios Estudiantiles".

## Objetivo
Desarrollar un API REST robusto, escalable y seguro utilizando tecnologías modernas: **Node.js (v20+), Fastify, Prisma ORM y MySQL 8.0**.

## Arquitectura Propuesta

Se utilizará una arquitectura **Modular Monolith** organizada por características y plugins de Fastify.

```text
/src
  /config         # Variables de entorno y configuración
  /plugins        # Plugins de Fastify (DB, Auth, Swagger)
  /modules        # Módulos de negocio (Usuarios, Servicios)
    /usuario
      usuario.routes.js
      usuario.controller.js
      usuario.service.js
      usuario.schema.js
  /shared         # Utilidades compartidas
  indes.js          # Punto de entrada
```

## User Review Required
> [!IMPORTANT]
> **Base de Datos:** Se modificará el esquema original para incluir `Roles` (Estudiante, Admin, Cliente) y la relación `Crrera-Usuario` como se definió en el SRS.
> **Autenticación:** Se implementará autenticación básica con JWT (JSON Web Tokens).


## Coding Standards: "Learned Script 2025"
Se aplicarán los estándares modernos investigados ("Learned Script 2025"):
- **ES Modules (ESM):** Uso nativo de `import/export`.
- **Top-Level Await:** Para inicialización de plugins y DB.
- **Node.js Test Runner:** Uso de `node:test` en lugar de librerías externas pesadas.
- **Fastify v5+:** Uso de la última versión estable con sistema de plugins encapsulados.
- **Type Safety en JS:** Uso de JSDoc agresivo para intellisense sin la complejidad de compilación de TS (o TS si se prefiere, pero el usuario pidió JS). *Se usará JS con JSDoc*.
- **Prisma Avanzado:** Uso de `omit`, `relationJoins` (si disponible en v5+) y validación segura.

## Pasos de Implementación

### 1. Inicialización del Proyecto
- Inicializar `package.json` y estructura de carpetas.
- Instalar dependencias clave: `fastify`, `@prisma/client`, `fastify-plugin`, `@fastify/autoload`, `@fastify/cors`, `dotenv`.
- Instalar dependencias de desarrollo: `prisma`, `nodemon`, `pino-pretty`.

### 2. Configuración de Base de Datos (Prisma & MySQL)
- Configurar `prisma/schema.prisma`.
- **Refinar Modelo de Datos:** Mapear el SQL `basedatosPROYECTO.sql` a Prisma Schema, aplicando las mejoras del SRS:
    - Enum `Rol`: ESTUDIANTE, CLIENTE, ADMIN.
    - Relación `Usuario` -> `Carrera`.
    - Campo `imagen_portada` en `Servicio`.
- Ejecutar migración inicial para sincronizar con MySQL 8.0.

### 3. Configuración del Servidor Fastify
- Configurar `app.js` con logger (Pino).
- Configurar plugin de Prisma para manejar la conexión a BD de forma eficiente.
- Configurar `@fastify/swagger` para documentación automática de API.
- Configurar Validaciones (Schema-based) nativas de Fastify.

### 4. Desarrollo de Módulos (Endpoints)

#### Módulo: Usuarios & Auth
- `POST /api/auth/register`: Registro de estudiantes/clientes.
- `POST /api/auth/login`: Inicio de sesión (JWT).
- `GET /api/profile`: Ver perfil propio.

#### Módulo: Servicios
- `GET /api/servicios`: Listar servicios (filtros por categoría/carrera).
- `GET /api/servicios/:id`: Detalle de servicio.
- `POST /api/servicios`: Crear servicio (Solo Estudiantes, imagen requerida).

#### Módulo: Pedidos & Reseñas
- `POST /api/pedidos`: Iniciar contacto/pedido.
- `POST /api/pedidos/:id/resena`: Dejar reseña (Solo si el pedido finalizó).

## Verificación Plan

### Automated Tests
Se utilizará `tap` o `node:test` (nativo) para pruebas unitarias de endpoints críticos.
- Test de conexión a BD.
- Test de registro de usuario (happy path).
- Test de respuesta 404 para rutas no existentes.

### Manual Verification (Postman/Curl)
1.  **Registro:** Crear un usuario "Estudiante" y verificar que se guarde en DB con rol correcto.
2.  **Publicación:** Intentar crear un servicio con ese usuario y verificar que aparezca en la lista.
3.  **Seguridad:** Intentar crear un servicio sin token y verificar error 401.
