-- 📊 Base de Datos UniServicios con Sistema de Roles
CREATE DATABASE IF NOT EXISTS uniservicios_db;
USE uniservicios_db;

-- 1. TABLA DE ROLES
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- 'admin', 'cliente', 'estudiante'
    descripcion TEXT,
    permisos JSON -- Para flexibilidad adicional
);

-- 2. TABLA DE USUARIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    avatar_url VARCHAR(255),
    rol_id INT NOT NULL,
    universidad VARCHAR(150),
    carrera VARCHAR(100),
    semestre INT,
    biografia TEXT,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_servicios_contratados INT DEFAULT 0,
    total_servicios_publicados INT DEFAULT 0,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    ultima_conexion DATETIME,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- 3. TABLA DE CATEGORÍAS
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    icono VARCHAR(50), -- Nombre del icono (ej: 'code', 'book')
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE
);

-- 4. TABLA DE SERVICIOS
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria_id INT NOT NULL,
    precio_hora DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(255),
    duracion_minima INT DEFAULT 1,
    disponibilidad JSON, -- Días y horarios
    estado ENUM('activo', 'pausado', 'inactivo', 'eliminado') DEFAULT 'activo',
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_ventas INT DEFAULT 0,
    total_visualizaciones INT DEFAULT 0,
    eliminado_por_admin INT NULL,
    razon_eliminacion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (eliminado_por_admin) REFERENCES usuarios(id)
);

-- 5. TABLA DE TRANSACCIONES (CONTRATACIONES)
CREATE TABLE transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    servicio_id INT NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    horas_contratadas INT NOT NULL,
    estado ENUM('pendiente', 'aceptado', 'en_progreso', 'completado', 'cancelado') DEFAULT 'pendiente',
    fecha_inicio_servicio DATETIME,
    fecha_fin_servicio DATETIME,
    metodo_pago VARCHAR(50),
    notas_cliente TEXT,
    notas_estudiante TEXT,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

-- 6. TABLA DE RESEÑAS
CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaccion_id INT NOT NULL,
    cliente_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    servicio_id INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    respuesta_estudiante TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta DATETIME,
    moderada_por INT NULL,
    visible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (transaccion_id) REFERENCES transacciones(id),
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (moderada_por) REFERENCES usuarios(id)
);

-- 7. TABLA DE MENSAJERÍA (CONVERSACIONES)
CREATE TABLE conversaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    servicio_id INT NULL,
    ultimo_mensaje TEXT,
    fecha_ultimo_mensaje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

CREATE TABLE mensajes_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversacion_id INT NOT NULL,
    emisor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    archivo_url VARCHAR(255),
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id),
    FOREIGN KEY (emisor_id) REFERENCES usuarios(id)
);

-- 8. TABLA DE PAGOS
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaccion_id INT NOT NULL,
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(100),
    monto DECIMAL(10,2) NOT NULL,
    comision_plataforma DECIMAL(10,2),
    monto_estudiante DECIMAL(10,2),
    estado ENUM('exitoso', 'fallido', 'pendiente', 'reembolsado') DEFAULT 'pendiente',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_liberacion DATETIME, -- Cuando se libera el dinero al estudiante
    FOREIGN KEY (transaccion_id) REFERENCES transacciones(id)
);

-- 9. TABLA DE REPORTES (MODERACIÓN)
CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reportador_id INT NOT NULL,
    tipo ENUM('servicio', 'usuario', 'resena'),
    elemento_reportado_id INT NOT NULL,
    categoria_reporte ENUM('spam', 'inapropiado', 'fraude', 'otro'),
    descripcion TEXT,
    estado ENUM('pendiente', 'revisado', 'resuelto', 'rechazado') DEFAULT 'pendiente',
    revisado_por INT NULL,
    notas_admin TEXT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_revision DATETIME,
    FOREIGN KEY (reportador_id) REFERENCES usuarios(id),
    FOREIGN KEY (revisado_por) REFERENCES usuarios(id)
);

-- 10. ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_servicios_estado ON servicios(estado);
CREATE INDEX idx_transacciones_estado ON transacciones(estado);
CREATE INDEX idx_mensajes_conversacion ON mensajes_chat(conversacion_id);
CREATE INDEX idx_favoritos_usuario ON usuarios(id);

-- 11. INSERCIÓN DE DATOS SEMILLA
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador con control total sobre usuarios y contenidos'),
('cliente', 'Usuario que contrata servicios y califica estudiantes'),
('estudiante', 'Usuario que ofrece servicios y gestiona sus ventas');

INSERT INTO categorias (nombre, icono, descripcion) VALUES
('Tutorías', 'book', 'Apoyo académico en diversas materias'),
('Programación', 'code', 'Desarrollo web, apps y software'),
('Diseño', 'palette', 'Diseño gráfico, logos e ilustración'),
('Negocios', 'briefcase', 'Asesoría en proyectos y marketing'),
('Ciencias', 'microscope', 'Física, química y matemáticas avanzadas');