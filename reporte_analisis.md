# Reporte de Análisis: Entrevista vs Modelo de Datos

**Fecha:** 2026-01-07
**Archivos Analizados:**
- `Entrevista.txt`
- `basedatosPROYECTO.sql`

## 1. Coincidencias (Lo que SI coincide)

*   **Entidad Servicios:** La tabla `servicios` refleja fielmente los requerimientos mencionados. Incluye `titulo`, `descripcion`, `precio` y, crucialmente, los campos de contacto directo (`contacto_whatsapp`, `contacto_email`, `contacto_telefono`). Esto se alinea perfectamente con la directriz de *no incluir pasarela de pagos* y que el trato sea directo.
*   **Sistema de Reseñas:** La tabla `resenas` permite calificar (`calificacion`) y comentar, tal como se solicitó para que los clientes den feedback sobre el servicio recibido.
*   **Estructura Universitaria:** La existencia de las tablas `facultades` y `carreras` demuestra la intención de dar un contexto universitario al portal.
*   **Fotos/Imágenes:** Campos como `foto_perfil` en usuarios son consistentes con la necesidad de un diseño "llamativo" y "profesional". (Nota: La tabla servicios podría beneficiarse de un campo para imagen de portada del servicio, aunque no es un bloqueo crítico en base de datos si se maneja externamente, pero idealmente debería estar).

## 2. No Coincidencias (Lo que NO coincide o contradice)

*   **Falta de Roles de Usuario:** La entrevista distingue claramente tres actores: Estudiante (Proveedor), Cliente (Público General), y Administrador (Docente/Visualizador). El modelo de base de datos tiene una única tabla `usuarios` sin ninguna columna de `rol`, `tipo_usuario` o tabla relacionada que permita diferenciar estos permisos. Actualmente, no hay forma de distinguir quién es un administrador y quién es un estudiante.
*   **Gestión de Pedidos Formal:** La tabla `pedidos` existe con `estado`, `fecha_entrega` y `monto_total`. Aunque la entrevista dice "no incluir métodos de pago", la existencia de esta tabla es necesaria para habilitar el sistema de reseñas (linkear un cliente con un servicio). *Sin embargo*, se debe tener cuidado de no interpretar esto como un "carrito de compras" con pago en línea. Es una discrepancia menor, pero importante de aclarar: en el sistema, un "pedido" es solo un registro lógico de contacto exitoso, no una transacción financiera real.

## 3. Faltantes importantes (Lo que debería coincidir y falta)

*   **Vinculación Estudiante - Carrera:** Aunque existen las tablas `usuarios` y `carreras` por separado, **no existe una llave foránea en la tabla `usuarios` que enlace al estudiante con su carrera**. Siendo un "Portal de Servicios Estudiantiles" donde se menciona que "dependiendo de la carrera" ofrecen servicios (ej. TITS ofrece landing pages), es crítico saber a qué carrera pertenece el estudiante registrado.
*   **Imágenes del Servicio:** La entrevista hace mucho énfasis en la parte visual ("una portada y cosas llamativas"). La tabla `servicios` **no tiene un campo para la imagen/portada del servicio** (solo `usuarios` tiene `foto_perfil`). Es indispensable agregar un campo `multimedia_url`, `imagen_portada` o una tabla de `imagenes_servicio`.
*   **Validación Institucional:** La entrevista menciona "registrarse a la plataforma con su correo institucional". Si bien el campo `email` existe, no hay campos específicos para validación académica (ej. número de matrícula o carné), aunque esto podría manejarse solo con el email. Sería recomendable asegurar que el modelo soporte esta distinción.

## Resumen de Recomendaciones para la Base de Datos

1.  **Agregar columna `rol`** en la tabla `usuarios` (ENUM: 'estudiante', 'cliente', 'admin').
2.  **Agregar columna `id_carrera`** en la tabla `usuarios` (Null si es cliente/admin, FK a `carreras`).
3.  **Agregar columna `imagen_portada`** en la tabla `servicios`.
