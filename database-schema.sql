-- Base de datos: gestion_usuarios
-- Crear base de datos (ejecutar manualmente si es necesario)
-- CREATE DATABASE gestion_usuarios;

-- Conectar a la base de datos
-- \c gestion_usuarios;

-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS perfiles (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación usuario-perfiles (many-to-many)
CREATE TABLE IF NOT EXISTS usuario_perfiles (
    usuario_id BIGINT NOT NULL,
    perfil_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, perfil_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (perfil_id) REFERENCES perfiles(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_perfiles_nombre ON perfiles(nombre);
CREATE INDEX idx_usuario_perfiles_usuario_id ON usuario_perfiles(usuario_id);
CREATE INDEX idx_usuario_perfiles_perfil_id ON usuario_perfiles(perfil_id);

-- Insertar perfiles por defecto
INSERT INTO perfiles (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema con todos los privilegios'),
('USER', 'Usuario estándar con permisos básicos'),
('MODERATOR', 'Moderador con permisos intermedios'),
('AUDITOR', 'Auditor con permisos de solo lectura para reportes')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar usuario administrador por defecto (password: admin123)
INSERT INTO usuarios (username, email, password, nombre, apellidos, activo) VALUES
('admin', 'admin@gestionusuarios.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2uW5m2uW5m2uW5m2uW5m2uW5m2uW5m2', 'Administrador', 'Sistema', true)
ON CONFLICT (username) DO NOTHING;

-- Asignar perfil ADMIN al usuario admin
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id 
FROM usuarios u, perfiles p 
WHERE u.username = 'admin' AND p.nombre = 'ADMIN'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Crear función para actualizar fecha_modificacion
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar fecha_modificacion
CREATE TRIGGER update_usuarios_modification_time BEFORE UPDATE ON usuarios 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_perfiles_modification_time BEFORE UPDATE ON perfiles 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Vista para obtener usuarios con sus perfiles
CREATE OR REPLACE VIEW vista_usuarios_perfiles AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.nombre,
    u.apellidos,
    u.activo,
    u.fecha_creacion,
    u.fecha_modificacion,
    STRING_AGG(p.nombre, ', ' ORDER BY p.nombre) as perfiles
FROM usuarios u
LEFT JOIN usuario_perfiles up ON u.id = up.usuario_id
LEFT JOIN perfiles p ON up.perfil_id = p.id
GROUP BY u.id, u.username, u.email, u.nombre, u.apellidos, u.activo, u.fecha_creacion, u.fecha_modificacion;

-- Vista para obtener perfiles con cantidad de usuarios
CREATE OR REPLACE VIEW vista_perfiles_estadisticas AS
SELECT 
    p.id,
    p.nombre,
    p.descripcion,
    p.fecha_creacion,
    p.fecha_modificacion,
    COUNT(up.usuario_id) as cantidad_usuarios
FROM perfiles p
LEFT JOIN usuario_perfiles up ON p.id = up.perfil_id
GROUP BY p.id, p.nombre, p.descripcion, p.fecha_creacion, p.fecha_modificacion;