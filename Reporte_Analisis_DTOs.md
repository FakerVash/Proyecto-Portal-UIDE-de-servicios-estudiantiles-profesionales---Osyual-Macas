# Reporte de Análisis: Modelo de Base de Datos vs Entrevista

## Resumen
Este reporte analiza la correspondencia entre el archivo SQL proporcionado (`basedatosPROYECTO.sql`) y los requerimientos extraídos de la entrevista (`Entrevista.txt`).

---

## 1. Lo que COINCIDE con la entrevista

El modelo de datos cubre satisfactoriamente las entidades principales mencionadas en la entrevista:

*   **Entidad Servicios**:
    *   Incluye campos requeridos como `titulo`, `descripcion`, `precio` (costo o gratuito), y `fecha_publicacion`.
    *   **Medios de Contacto**: Se incluyen explícitamente `contacto_whatsapp`, `contacto_email`, `contacto_telefono`, cumpliendo con el requisito de que el cliente contacte por estos medios.
*   **Usuarios**:
    *   Existencia de una tabla de usuarios para el registro de estudiantes y potencialmente clientes.
    *   Campos básicos de perfil (`nombre`, `apellido`, `email`).
*   **Categorización**:
    *   Se incluyen tablas para `facultades`, `carreras` y `categorias`, lo cual se alinea con la mención de ofrecer servicios "dependiendo de la carrera" o área.
*   **Sistema de Reseñas**:
    *   La tabla `resenas` permite calificar y comentar, un requisito explícito mencionado por el entrevistado para la fase posterior a la contratación.

---

## 2. Lo que NO COINCIDE (Desviaciones o Extras)

Elementos presentes en la base de datos que difieren del alcance o la descripción literal de la entrevista:

*   **Tabla `pedidos` (Gestión de Órdenes)**:
    *   *Análisis*: La entrevista describe un modelo tipo "Directorio" donde la contratación ocurre externamente ("contactarme por celular o correo").
    *   *Desviación*: El SQL implementa un sistema transaccional completo (`pedidos` con estados 'pendiente', 'en_proceso', fechas de entrega, monto).
    *   *Observación*: Aunque la entrevista dice "no incluir métodos de pago", el modelo SQL no viola esto (no hay tabla de pagos/tarjetas), pero formaliza la "contratación" dentro de la plataforma mucho más de lo sugerido. Esto es necesario para validar las reseñas (solo quien "contrata" debería opinar), pero añade complejidad.
*   **Tabla `habilidades`**:
    *   Se incluye un sistema de etiquetas de habilidades (`skills`) que no fue explícitamente solicitado, aunque es una adición positiva de valor (tipo Fiverr).

---

## 3. Lo que NO COINCIDE pero SÍ DEBERÍA (Faltantes Críticos)

Requisitos mencionados claros en la entrevista que NO están reflejados en el modelo de datos actual:

*   **Roles de Usuario (CRÍTICO)**:
    *   *Requisito*: Se definieron roles claros: **Estudiante** (publica), **Cliente/Público** (visualiza/contrata) y **Administrador** (visualiza estadísticas).
    *   *Faltante*: La tabla `usuarios` **no tiene un campo `rol`** o una tabla de roles relacionada. No hay forma de distinguir a un administrador de un estudiante.
*   **Imagen de Portada del Servicio**:
    *   *Requisito*: El entrevistado enfatizó que el servicio debe tener "una portada y cosas llamativas" y que debe ser "muy bonito estéticamente".
    *   *Faltante*: La tabla `servicios` **no tiene un campo para `imagen_url`** o `foto_portada`. Solo tiene descripción textual.
*   **Vinculación Estudiante - Carrera**:
    *   *Requisito*: Los servicios los ofrecen los estudiantes "dependiendo de la carrera".
    *   *Faltante*: Aunque existen las tablas `carreras` y `facultades`, **no hay llave foránea en la tabla `usuarios`** que vincule al estudiante con su carrera. Esto impide filtrar servicios por la carrera del estudiante o validar que el estudiante pertenece a la institución.
*   **Gestión de Clientes (Ambigüedad)**:
    *   La tabla `pedidos` requiere un `id_cliente`. Si el objetivo es que el "público general" contacte sin barreras, obligarlos a registrarse para crear un "pedido" puede ser una fricción no contemplada en la entrevista. Sin embargo, para dejar reseñas, el registro es obligatorio.

## Recomendaciones Inmediatas para el SQL

1.  **Agregar campo `rol`** en tabla `usuarios` (ENUM: 'estudiante', 'cliente', 'admin').
2.  **Agregar campo `imagen_portada`** (VARCHAR) en tabla `servicios`.
3.  **Agregar FK `id_carrera`** en tabla `usuarios` (Null para clientes/admins).
