# Especificación de Requisitos de Software (SRS)
**Proyecto:** Portal de Servicios Estudiantiles - Universidad Internacional
**Versión:** 1.0
**Fecha:** 2026-01-07

## 1. Introducción

### 1.1 Propósito
El propósito de este documento es definir los requisitos funcionales y no funcionales para el "Portal de Servicios Estudiantiles". Este sistema permitirá a los estudiantes universitarios ofrecer servicios académicos o profesionales al público general, fomentando el emprendimiento y la práctica profesional.

### 1.2 Alcance
El sistema será una aplicación web que facilitará:
- El registro de estudiantes y usuarios externos.
- La publicación, búsqueda y contratación de servicios.
- La gestión de reseñas y calificaciones.
- **Nota Importante:** El sistema NO incluirá pasarela de pagos en línea en esta fase. El pago se acordará externamente entre las partes, y la plataforma servirá como punto de conexión y registro del acuerdo.

## 2. Descripción General

### 2.1 Perspectiva del Producto
El portal actúa como un intermediario (tipo Marketplace de servicios estilo Fiverr) pero enfocado en el talento universitario. Debe reflejar la identidad institucional de la universidad.

### 2.2 Características de los Usuarios (Roles)
Se han identificado los siguientes roles de usuario:

| Rol | Descripción |
| :--- | :--- |
| **Estudiante (Proveedor)** | Alumno de la universidad. Puede registrarse, crear su perfil profesional asociado a su carrera y publicar servicios. |
| **Cliente (Público General)** | Cualquier usuario externo o interno que busca contratar un servicio. Puede buscar, contactar y dejar reseñas. |
| **Administrador** | Personal docente o administrativo encargado de supervisar la plataforma. Tiene permisos de visualización de métricas (usuarios registrados, servicios publicados). |

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales

#### 3.1.1 Gestión de Usuarios
- **RF-01 Registro de Estudiantes:** El sistema debe permitir el registro de estudiantes validando su correo institucional.
- **RF-02 Perfil de Estudiante:** El estudiante debe poder indicar su **carrera** y habilidades.
- **RF-03 Registro de Clientes:** El sistema debe permitir el registro de público general con datos básicos de contacto.

#### 3.1.2 Gestión de Servicios
- **RF-04 Publicación de Servicios:** Los estudiantes deben poder crear servicios incluyendo: Título, Descripción, Precio referencial, Tiempo de entrega y **Imagen de Portada**.
- **RF-05 Catálogo de Servicios:** El sistema mostrará una lista de servicios disponibles, filtrables por categoría o carrera.
- **RF-06 Detalle del Servicio:** Visualización completa de la oferta con información de contacto directo (WhatsApp, Email).

#### 3.1.3 Interacción y Contacto
- **RF-07 Solicitud de Pedido:** El cliente puede iniciar una solicitud de servicio ("Contratar"), lo cual genera un registro de "Pedido" en estado pendiente.
- **RF-08 Finalización:** Una vez acordado el servicio externamente, el estado del pedido puede actualizarse a "Completado".
- **RF-09 Reseñas y Calificaciones:** Al finalizar un servicio, el cliente podrá calificar (1-5 estrellas) y comentar su experiencia.

#### 3.1.4 Administración
- **RF-10 Dashboard:** Vista para el administrador con contadores de: Estudiantes registrados y Servicios activos.

### 3.2 Requisitos No Funcionales (RNF)

#### 3.2.1 Interfaz de Usuario (UI)
- **RNF-01 Estética:** El diseño debe ser "llamativo", "profesional" y moderno, similar a plataformas como Fiverr o Coursera.
- **RNF-02 Identidad:** Debe mantener la línea gráfica institucional (Logo, colores si aplica).
- **RNF-03 Responsive:** La aplicación debe ser completamente funcional en dispositivos móviles y de escritorio.

#### 3.2.2 Rendimiento y Restricciones
- **RNF-04 Escalabilidad:** La base de datos debe soportar el crecimiento de usuarios y servicios.
- **RNF-05 Disponibilidad:** El sistema debe estar disponible 24/7 para consulta pública.

## 4. Matriz de Trazabilidad e Impacto en Base de Datos

Basado en el análisis previo, para cumplir con este SRS se requieren los siguientes ajustes al modelo de datos actual:
1.  **Tabla Usuarios:** Añadir campo `rol` (ENUM) y `id_carrera` (FK).
2.  **Tabla Servicios:** Añadir campo `imagen_portada` (URL/Path).
3.  **Seguridad:** Asegurar que solo usuarios con rol 'Estudiante' puedan publicar en la tabla `servicios`.
