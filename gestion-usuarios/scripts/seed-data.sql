-- Script para insertar datos de prueba en el sistema
-- Ejecutar después de crear el esquema de base de datos

-- Insertar perfiles adicionales
INSERT INTO perfiles (nombre, descripcion) VALUES
('MODERATOR', 'Moderador con permisos intermedios para gestión de contenido'),
('AUDITOR', 'Auditor con permisos de solo lectura para reportes y análisis'),
('EDITOR', 'Editor con permisos para modificar contenido específico'),
('VIEWER', 'Visualizador con acceso de solo lectura a la información')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar usuarios de prueba
-- Contraseñas encriptadas: todos tienen la contraseña 'password123'
INSERT INTO usuarios (username, email, password, nombre, apellidos, activo) VALUES
('juan.perez', 'juan.perez@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Juan', 'Pérez García', true),
('maria.gomez', 'maria.gomez@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'María', 'Gómez López', true),
('carlos.lopez', 'carlos.lopez@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Carlos', 'López Martínez', true),
('ana.rodriguez', 'ana.rodriguez@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Ana', 'Rodríguez Sánchez', true),
('luis.martinez', 'luis.martinez@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Luis', 'Martínez González', false),
('sandra.fernandez', 'sandra.fernandez@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Sandra', 'Fernández Díaz', true),
('diego.torres', 'diego.torres@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Diego', 'Torres Ruiz', true),
('patricia.silva', 'patricia.silva@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Patricia', 'Silva Herrera', true),
('javier.romero', 'javier.romero@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Javier', 'Romero Castro', true),
('elena.morales', 'elena.morales@empresa.com', '$2a$10$Xl0y2Em4Q6XJZp5j8W5m2eW5m2eW5m2eW5m2eW5m2eW5m2eW5m2', 'Elena', 'Morales Vargas', false)
ON CONFLICT (username) DO NOTHING;

-- Asignar perfiles a los usuarios de prueba
-- Juan Pérez - ADMIN y EDITOR
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'juan.perez' AND p.nombre = 'ADMIN'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'juan.perez' AND p.nombre = 'EDITOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- María Gómez - MODERATOR y EDITOR
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'maria.gomez' AND p.nombre = 'MODERATOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'maria.gomez' AND p.nombre = 'EDITOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Carlos López - USER
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'carlos.lopez' AND p.nombre = 'USER'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Ana Rodríguez - AUDITOR y VIEWER
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'ana.rodriguez' AND p.nombre = 'AUDITOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'ana.rodriguez' AND p.nombre = 'VIEWER'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Luis Martínez - USER (inactivo)
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'luis.martinez' AND p.nombre = 'USER'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Sandra Fernández - MODERATOR
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'sandra.fernandez' AND p.nombre = 'MODERATOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Diego Torres - EDITOR
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'diego.torres' AND p.nombre = 'EDITOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Patricia Silva - VIEWER
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'patricia.silva' AND p.nombre = 'VIEWER'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Javier Romero - USER
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'javier.romero' AND p.nombre = 'USER'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Elena Morales - AUDITOR (inactivo)
INSERT INTO usuario_perfiles (usuario_id, perfil_id) 
SELECT u.id, p.id FROM usuarios u, perfiles p 
WHERE u.username = 'elena.morales' AND p.nombre = 'AUDITOR'
ON CONFLICT (usuario_id, perfil_id) DO NOTHING;

-- Actualizar algunas fechas de modificación para tener datos más variados
UPDATE usuarios SET fecha_modificacion = fecha_creacion + INTERVAL '1 day' WHERE id IN (2, 4, 6, 8);
UPDATE usuarios SET fecha_modificacion = fecha_creacion + INTERVAL '3 days' WHERE id IN (3, 7, 9);
UPDATE usuarios SET fecha_modificacion = fecha_creacion + INTERVAL '1 week' WHERE id = 5;

-- Actualizar fechas de modificación de perfiles
UPDATE perfiles SET fecha_modificacion = fecha_creacion + INTERVAL '2 days' WHERE nombre IN ('MODERATOR', 'AUDITOR');
UPDATE perfiles SET fecha_modificacion = fecha_creacion + INTERVAL '5 days' WHERE nombre IN ('EDITOR', 'VIEWER');

-- Crear vista actualizada con estadísticas
CREATE OR REPLACE VIEW estadisticas_sistema AS
SELECT 
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM usuarios WHERE activo = true) as usuarios_activos,
    (SELECT COUNT(*) FROM usuarios WHERE activo = false) as usuarios_inactivos,
    (SELECT COUNT(*) FROM perfiles) as total_perfiles,
    (SELECT COUNT(*) FROM usuario_perfiles) as total_asignaciones,
    (SELECT COUNT(*) FROM usuarios WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '30 days') as usuarios_nuevos_mes;

-- Mostrar estadísticas
SELECT * FROM estadisticas_sistema;

-- Mostrar distribución de usuarios por perfil
SELECT 
    p.nombre as perfil,
    COUNT(up.usuario_id) as cantidad_usuarios,
    ROUND(COUNT(up.usuario_id) * 100.0 / (SELECT COUNT(*) FROM usuarios), 2) as porcentaje
FROM perfiles p
LEFT JOIN usuario_perfiles up ON p.id = up.perfil_id
GROUP BY p.id, p.nombre
ORDER BY cantidad_usuarios DESC;