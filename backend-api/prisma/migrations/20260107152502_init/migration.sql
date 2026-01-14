-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `foto_perfil` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `rol` ENUM('ESTUDIANTE', 'CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE',
    `id_carrera` INTEGER NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facultades` (
    `id_facultad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_facultad` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `facultades_nombre_facultad_key`(`nombre_facultad`),
    PRIMARY KEY (`id_facultad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carreras` (
    `id_carrera` INTEGER NOT NULL AUTO_INCREMENT,
    `id_facultad` INTEGER NOT NULL,
    `nombre_carrera` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`id_carrera`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_categoria` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,

    UNIQUE INDEX `categorias_nombre_categoria_key`(`nombre_categoria`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `tiempo_entrega` VARCHAR(100) NULL,
    `imagen_portada` VARCHAR(255) NULL,
    `contacto_whatsapp` VARCHAR(20) NULL,
    `contacto_email` VARCHAR(100) NULL,
    `contacto_telefono` VARCHAR(20) NULL,
    `fecha_publicacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habilidades` (
    `id_habilidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_habilidad` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `habilidades_nombre_habilidad_key`(`nombre_habilidad`),
    PRIMARY KEY (`id_habilidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_habilidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_habilidad` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_habilidades_id_usuario_id_habilidad_key`(`id_usuario`, `id_habilidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos` (
    `id_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `id_servicio` INTEGER NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `estado` ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
    `fecha_pedido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_entrega` DATETIME NULL,
    `monto_total` DECIMAL(10, 2) NOT NULL,
    `notas` TEXT NULL,

    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resenas` (
    `id_resena` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `calificacion` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `fecha_resena` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `resenas_id_pedido_key`(`id_pedido`),
    PRIMARY KEY (`id_resena`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_carrera_fkey` FOREIGN KEY (`id_carrera`) REFERENCES `carreras`(`id_carrera`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carreras` ADD CONSTRAINT `carreras_id_facultad_fkey` FOREIGN KEY (`id_facultad`) REFERENCES `facultades`(`id_facultad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_habilidades` ADD CONSTRAINT `usuario_habilidades_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_habilidades` ADD CONSTRAINT `usuario_habilidades_id_habilidad_fkey` FOREIGN KEY (`id_habilidad`) REFERENCES `habilidades`(`id_habilidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_id_servicio_fkey` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id_servicio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;
