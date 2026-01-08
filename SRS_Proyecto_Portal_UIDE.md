# Especificación de Requisitos de Software (SRS)
# Portal de Servicios Estudiantiles UIDE

---

## 1. Introducción

### 1.1 Propósito
El propósito de este documento es definir los requisitos funcionales y no funcionales para el "Portal de Servicios Estudiantiles", una plataforma web donde los estudiantes de la Universidad Internacional del Ecuador (UIDE) pueden ofrecer servicios profesionales o comunitarios al público en general.

### 1.2 Alcance
El sistema permitirá a los estudiantes registrarse, acreditarse en su carrera y publicar servicios (gratuitos o de pago). El público en general podrá navegar por estos servicios y contactar a los estudiantes para contratarlos. El sistema también incluirá un módulo de calificación y reseñas para asegurar la calidad.

### 1.3 Referencias
*   Entrevista con Ing. Wilson Valverde (Stakeholder).
*   Reporte de Análisis de Base de Datos v1.0.

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
El proyecto nace como una iniciativa para dar visibilidad comercial y comunitaria a los proyectos y habilidades de los estudiantes. Se inspira en plataformas de "Gig Economy" como Fiverr, pero con un enfoque institucional y académico.

### 2.2 Actores y Clases de Usuario
1.  **Estudiante (Oferente)**: Alumno de la UIDE que desea publicar sus servicios (ej. diseño de logos, consultoría, desarrollo web).
2.  **Cliente / Público General (Demandante)**: Persona externa o interna a la universidad que busca contratar un servicio.
3.  **Administrador**: Personal docente o administrativo encargado de monitorear la plataforma, ver estadísticas y moderar usuarios/servicios.

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales

#### Módulo 1: Gestión de Usuarios y Autenticación
*   **RF-01 Registro de Estudiantes**: El sistema debe permitir el registro de estudiantes validando su pertenencia a la universidad (correo institucional recomendablemente).
*   **RF-02 Registro de Clientes**: El sistema permitirá el registro de usuarios externos para poder dejar reseñas y gestionar pedidos, aunque la visualización es pública.
*   **RF-03 Inicio de Sesión**: Autenticación segura para todos los roles.
*   **RF-04 Perfil de Usuario**: Gestión de datos personales, foto de perfil y contacto.

#### Módulo 2: Gestión de Servicios (Estudiantes)
*   **RF-05 Publicar Servicio**: El estudiante podrá crear un servicio ingresando: Título, Descripción detallada, Categoría/Carrera, Precio (o gratuito), Tiempo de entrega y Medios de contacto (WhatsApp, Email).
*   **RF-06 Portada del Servicio**: **[Crítico]** El sistema debe permitir subir una imagen de portada llamativa para cada servicio.
*   **RF-07 Gestión de Mis Servicios**: Editar, pausar o eliminar servicios publicados.

#### Módulo 3: Catálogo y Búsqueda (Público)
*   **RF-08 Landing Page**: Página de inicio impactante que explique el propósito del portal y muestre servicios destacados.
*   **RF-09 Buscador y Filtros**: Permitir filtrar servicios por Facultad, Carrera, Categoría o Precio.
*   **RF-10 Detalle de Servicio**: Vista completa del servicio con descripción, perfil del estudiante y botones de contacto directo.

#### Módulo 4: Contratación y Reseñas
*   **RF-11 Contacto Directo**: El sistema facilitará enlaces directos (mailto, api whatsapp) para contactar al estudiante.
*   **RF-12 Generación de Pedido**: El sistema registrará la intención de contratación (Pedido) para dar seguimiento (estado: pendiente -> completado).
*   **RF-13 Calificación y Comentarios**: Una vez completado un servicio, el cliente podrá dejar una calificación (1-5 estrellas) y una reseña textual.

#### Módulo 5: Administración
*   **RF-14 Dashboard de Estadísticas**: Vista para administradores que muestre cantidad de estudiantes registrados, servicios publicados y actividad reciente.

### 3.2 Requisitos No Funcionales (RNF)

*   **RNF-01 Estética y UX**: El diseño debe ser "Premium", moderno y visualmente impactante, similar a sitios comerciales como Fiverr o Udemy, alejándose de diseños académicos tradicionales aburridos.
*   **RNF-02 Identidad Institucional**: Debe mantener una línea gráfica que denote que pertenece a la UIDE (logos, colores institucionales sutiles).
*   **RNF-03 Rendimiento**: Carga rápida de imágenes y catálogo.
*   **RNF-04 Escalabilidad**: Base de datos diseñada para soportar crecimiento en número de facultades y servicios.

---

## 4. Requisitos de Datos (Ajustes al Modelo)

Basado en el análisis previo, el modelo de datos debe asegurar:

1.  **Tabla Usuarios**: Incluir campo `rol` (ENUM: 'estudiante', 'cliente', 'admin') y `id_carrera` (FK nullable).
2.  **Tabla Servicios**: Incluir campo `imagen_portada` (URL/Path) para el aspecto visual.
3.  **Tabla Pedidos**: Mantener para el flujo de reseñas, aunque el pago sea externo.

---

## 5. Prototipos de Interfaz (Wireframes sugeridos)

1.  **Home**: Hero section con frase motivacional, buscador central y grid de "Servicios Destacados".
2.  **Catálogo**: Sidebar con filtros (Facultad, Categoría) y grid de tarjetas de servicios (Foto + Título + Precio + Autor).
3.  **Detalle Servicio**: Columna izquierda con imagen grande y descripción; Columna derecha con "ficha de compra" (Precio, Botón "Contactar por WhatsApp", Perfil resumido del estudiante).
