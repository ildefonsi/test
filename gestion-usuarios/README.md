# Sistema de Gestión de Usuarios

## Descripción

Sistema completo de gestión de usuarios y perfiles desarrollado con tecnologías modernas:
- **Backend**: Spring Boot 3.2.0, Java 17, PostgreSQL, MyBatis
- **Frontend**: React 18, Material-UI, Recharts
- **Seguridad**: JWT, Spring Security
- **Documentación**: OpenAPI 3.0 (Swagger)

## Características

### Funcionalidades de Usuarios
- ✅ CRUD completo de usuarios
- ✅ Asignación de perfiles a usuarios
- ✅ Activación/desactivación de usuarios
- ✅ Búsqueda avanzada de usuarios
- ✅ Validación de datos con mensajes personalizados

### Funcionalidades de Perfiles
- ✅ CRUD completo de perfiles
- ✅ Gestión de permisos por perfil
- ✅ Validación de duplicados
- ✅ Protección del perfil ADMIN

### Seguridad
- ✅ Autenticación JWT
- ✅ Autorización basada en roles
- ✅ Encriptación de contraseñas (BCrypt)
- ✅ Manejo seguro de tokens

### Frontend
- ✅ Interfaz moderna con Material-UI
- ✅ Tema oscuro personalizable
- ✅ Dashboard con gráficos estadísticos
- ✅ Paginación y búsqueda en tiempo real
- ✅ Notificaciones toast
- ✅ Rutas protegidas

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Dashboard  │  │   Usuarios   │  │     Perfiles     │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Material-UI Components                 │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              React Query (Cache)                    │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │Controllers  │  │   Services   │  │  Repositories    │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Spring Security (JWT)                  │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Validación y Excepciones             │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   usuarios  │  │   perfiles   │  │ usuario_perfiles │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Tecnologías Utilizadas

### Backend
- **Spring Boot 3.2.0** - Framework principal
- **Java 17** - Lenguaje de programación
- **Spring Security** - Seguridad y autenticación
- **Spring Data JPA** - Persistencia de datos
- **MyBatis** - Mapeo SQL
- **PostgreSQL** - Base de datos relacional
- **JWT** - Tokens de autenticación
- **OpenAPI 3.0** - Documentación de API
- **BCrypt** - Encriptación de contraseñas

### Frontend
- **React 18** - Librería de UI
- **Material-UI (MUI)** - Componentes de diseño
- **React Router** - Enrutamiento
- **React Query** - Manejo de estado y caché
- **React Hook Form** - Manejo de formularios
- **Recharts** - Gráficos y visualización
- **Axios** - Cliente HTTP
- **React Toastify** - Notificaciones

## Instalación y Configuración

### Requisitos Previos
- Java 17 o superior
- Node.js 18 o superior
- PostgreSQL 14 o superior
- Maven 3.8 o superior

### Backend (Spring Boot)

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd gestion-usuarios
   ```

2. **Configurar la base de datos PostgreSQL**
   ```sql
   CREATE DATABASE gestion_usuarios;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE gestion_usuarios TO postgres;
   ```

3. **Configurar application.properties**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestion_usuarios
   spring.datasource.username=postgres
   spring.datasource.password=tu_password
   app.jwt.secret=tu_clave_secreta_muy_larga
   ```

4. **Ejecutar el esquema SQL**
   ```bash
   psql -U postgres -d gestion_usuarios -f database-schema.sql
   ```

5. **Compilar y ejecutar**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   El backend estará disponible en: `http://localhost:8080`

### Frontend (React)

1. **Navegar al directorio frontend**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional)**
   Crear archivo `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

   El frontend estará disponible en: `http://localhost:3000`

5. **Construir para producción**
   ```bash
   npm run build
   ```

## Credenciales de Prueba

### Usuario Administrador
- **Username**: `admin`
- **Password**: `admin123`
- **Rol**: `ADMIN`

### Perfiles por Defecto
- `ADMIN` - Administrador del sistema
- `USER` - Usuario estándar
- `MODERATOR` - Moderador
- `AUDITOR` - Auditor

## Uso del Sistema

### Acceso al Sistema
1. Abrir el navegador en `http://localhost:3000`
2. Ingresar las credenciales de administrador
3. Explorar las diferentes secciones del sistema

### Gestión de Usuarios
1. **Crear Usuario**: Click en "Nuevo Usuario"
2. **Editar Usuario**: Click en el ícono de editar
3. **Eliminar Usuario**: Click en el ícono de eliminar
4. **Cambiar Estado**: Usar el switch de activo/inactivo
5. **Asignar Perfiles**: Seleccionar perfiles en el formulario

### Gestión de Perfiles
1. **Crear Perfil**: Click en "Nuevo Perfil"
2. **Editar Perfil**: Click en el ícono de editar
3. **Eliminar Perfil**: Click en el ícono de eliminar (excepto ADMIN)

### Dashboard
- Visualizar estadísticas generales
- Ver distribución de usuarios por estado
- Consultar usuarios recientes
- Analizar gráficos de uso

## Documentación de API

La documentación interactiva de la API está disponible en:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### Endpoints Principales

#### Autenticación
- `POST /api/auth/signin` - Iniciar sesión

#### Usuarios
- `GET /api/usuarios` - Listar usuarios (paginado)
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario
- `PATCH /api/usuarios/{id}/estado` - Cambiar estado

#### Perfiles
- `GET /api/perfiles` - Listar perfiles (paginado)
- `GET /api/perfiles/{id}` - Obtener perfil por ID
- `POST /api/perfiles` - Crear nuevo perfil
- `PUT /api/perfiles/{id}` - Actualizar perfil
- `DELETE /api/perfiles/{id}` - Eliminar perfil

## Estructura del Proyecto

```
gestion-usuarios/
├── src/main/java/com/gestionusuarios/gestionusuarios/
│   ├── config/          # Configuraciones de Spring
│   ├── controller/      # Controladores REST
│   ├── dto/            # Objetos de transferencia de datos
│   ├── entity/         # Entidades JPA
│   ├── exception/      # Manejo de excepciones
│   ├── repository/     # Repositorios JPA
│   ├── security/       # Configuración de seguridad JWT
│   └── service/        # Lógica de negocio
├── src/main/resources/
│   └── application.properties
├── frontend/src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas de la aplicación
│   ├── services/      # Servicios API
│   ├── context/       # Contexto de autenticación
│   └── styles/        # Estilos CSS
├── database-schema.sql # Esquema de base de datos
└── pom.xml           # Configuración de Maven
```

## Seguridad

### Autenticación JWT
- Tokens con expiración configurable
- Refresh tokens para renovación
- Validación de tokens en cada petición

### Autorización
- Control de acceso basado en roles
- Protección de endpoints sensibles
- Validación de permisos en tiempo de ejecución

### Encriptación
- Contraseñas encriptadas con BCrypt
- Comunicación segura vía HTTPS
- Almacenamiento seguro de tokens

## Rendimiento

### Backend
- Paginación eficiente con Spring Data
- Caché de consultas con Hibernate
- Validación de datos en múltiples capas
- Manejo optimizado de excepciones

### Frontend
- Caché inteligente con React Query
- Lazy loading de componentes
- Optimización de imágenes y recursos
- Compresión de assets en producción

## Monitoreo y Logs

### Backend
- Logs estructurados con SLF4J
- Métricas con Spring Boot Actuator
- Endpoints de health check
- Documentación de API automática

### Frontend
- Logs de desarrollo con React DevTools
- Análisis de bundle size
- Performance monitoring
- Error boundaries para manejo de errores

## Despliegue

### Backend
```bash
# Construir JAR
mvn clean package

# Ejecutar
java -jar target/gestion-usuarios-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
# Construir para producción
npm run build

# Servir archivos estáticos
serve -s build
```

## Contribuir

1. Fork el proyecto
2. Crear una rama para la feature (`git checkout -b feature/AmazingFeature`)
3. Commit de los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia Apache 2.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para preguntas o soporte, por favor contactar a:
- Email: soporte@gestionusuarios.com
- Documentación: [Wiki del Proyecto](wiki)
- Issues: [GitHub Issues](issues)

## Agradecimientos

- Spring Team por el excelente framework
- React Team por la librería de UI
- Material-UI Team por los componentes
- PostgreSQL Team por la base de datos confiable
- Todos los contribuyentes de código abierto