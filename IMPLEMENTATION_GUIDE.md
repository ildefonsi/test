# Guía de Implementación - Sistema de Gestión de Usuarios

## Índice
1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Despliegue](#despliegue)
6. [Monitoreo](#monitoreo)
7. [Mantenimiento](#mantenimiento)
8. [Solución de Problemas](#solución-de-problemas)

## Introducción

Esta guía proporciona instrucciones detalladas para la implementación exitosa del Sistema de Gestión de Usuarios en diferentes entornos (desarrollo, pruebas, producción).

## Requisitos Previos

### Hardware Mínimo
- **CPU**: 2 cores @ 2.0GHz
- **RAM**: 4GB (8GB recomendado)
- **Almacenamiento**: 20GB SSD
- **Red**: Conexión estable a internet

### Software Requerido
- **Sistema Operativo**: Linux (Ubuntu 20.04+), Windows 10+, macOS 10.15+
- **Java**: OpenJDK 17 o Oracle JDK 17
- **Node.js**: 18.x LTS
- **PostgreSQL**: 15.x
- **Docker**: 24.x (opcional)
- **Git**: 2.x

### Herramientas de Desarrollo
- **IDE**: IntelliJ IDEA, Eclipse, VS Code
- **Cliente PostgreSQL**: pgAdmin, DBeaver
- **Cliente API**: Postman, curl

## Instalación

### Opción 1: Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/gestion-usuarios.git
   cd gestion-usuarios
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Verificar instalación**
   ```bash
   docker-compose ps
   docker-compose logs
   ```

### Opción 2: Instalación Manual

#### Backend (Spring Boot)

1. **Instalar dependencias Java**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install openjdk-17-jdk maven
   
   # macOS
   brew install openjdk@17 maven
   ```

2. **Configurar PostgreSQL**
   ```bash
   # Crear base de datos
   sudo -u postgres psql
   CREATE DATABASE gestion_usuarios;
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE gestion_usuarios TO app_user;
   \q
   ```

3. **Configurar aplicación**
   ```bash
   # Editar src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestion_usuarios
   spring.datasource.username=app_user
   spring.datasource.password=secure_password
   app.jwt.secret=your-256-bit-secret-key-here
   ```

4. **Ejecutar migraciones y datos iniciales**
   ```bash
   psql -U app_user -d gestion_usuarios -f database-schema.sql
   psql -U app_user -d gestion_usuarios -f scripts/seed-data.sql
   ```

5. **Compilar y ejecutar**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

#### Frontend (React)

1. **Instalar dependencias Node.js**
   ```bash
   # Usando nvm (recomendado)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **Instalar dependencias del proyecto**
   ```bash
   cd frontend
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en el directorio frontend
   echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

## Configuración

### Configuración del Backend

#### application.properties
```properties
# Base de datos
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Seguridad
app.jwt.secret=${APP_JWT_SECRET}
app.jwt.expiration=${APP_JWT_EXPIRATION:86400000}

# Servidor
server.port=${SERVER_PORT:8080}

# Logging
logging.level.root=${LOGGING_LEVEL_ROOT:INFO}
logging.level.com.gestionusuarios=${LOGGING_LEVEL_COM_GESTIONUSUARIOS:INFO}
logging.file.name=${LOGGING_FILE_NAME:logs/app.log}

# CORS
spring.web.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

#### Configuración de Seguridad
```java
// SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // Fuerza del hash
}

@Bean
public JwtTokenProvider jwtTokenProvider() {
    return new JwtTokenProvider();
}
```

### Configuración del Frontend

#### Variables de Entorno (.env)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_TIMEOUT=10000

# App Configuration
REACT_APP_NAME=Sistema de Gestión de Usuarios
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=false
```

#### Configuración de Temas
```javascript
// theme.js
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});
```

## Despliegue

### Despliegue en Producción

#### Backend

1. **Build de producción**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Ejecutar JAR**
   ```bash
   java -jar -Xmx512m target/gestion-usuarios-0.0.1-SNAPSHOT.jar
   ```

3. **Configurar como servicio systemd**
   ```bash
   # Crear archivo /etc/systemd/system/gestion-usuarios.service
   [Unit]
   Description=Sistema de Gestión de Usuarios
   After=network.target
   
   [Service]
   User=appuser
   ExecStart=/usr/bin/java -jar /opt/app/gestion-usuarios.jar
   SuccessExitStatus=143
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

#### Frontend

1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Servir con Nginx**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;
       
       location / {
           root /var/www/gestion-usuarios;
           try_files $uri $uri/ /index.html;
       }
       
       location /api/ {
           proxy_pass http://localhost:8080/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Despliegue con Docker

#### Dockerfile Optimizado
```dockerfile
# Multi-stage build
FROM maven:3.8-openjdk-17-slim as build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Docker Compose para Producción
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: gestion_usuarios
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build: .
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/gestion_usuarios
      SPRING_DATASOURCE_USERNAME: app_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      APP_JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build: ./frontend
    environment:
      REACT_APP_API_URL: /api
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:
networks:
  app-network:
```

### Despliegue en la Nube

#### AWS
```bash
# ECS con Fargate
aws ecs create-cluster --cluster-name gestion-usuarios
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster gestion-usuarios --service-name backend --task-definition gestion-usuarios:1
```

#### Google Cloud Platform
```bash
# Cloud Run
gcloud run deploy gestion-usuarios \
  --image gcr.io/PROJECT_ID/gestion-usuarios \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure
```bash
# Container Instances
az container create \
  --resource-group myResourceGroup \
  --name gestion-usuarios \
  --image myregistry/gestion-usuarios:latest \
  --dns-name-label gestion-usuarios \
  --ports 8080
```

## Monitoreo

### Métricas de Aplicación

#### Spring Boot Actuator
```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
  metrics:
    export:
      prometheus:
        enabled: true
```

#### Métricas Personalizadas
```java
@Component
public class UserMetrics {
    private final MeterRegistry meterRegistry;
    private final UserRepository userRepository;
    
    @Scheduled(fixedDelay = 60000)
    public void recordUserMetrics() {
        long activeUsers = userRepository.countByActive(true);
        meterRegistry.gauge("users.active", activeUsers);
    }
}
```

### Logs Centralizados

#### Configuración de Logback
```xml
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="ELASTICSEARCH" class="com.internetitem.logback.elasticsearch.ElasticsearchAppender">
        <url>http://elasticsearch:9200/_bulk</url>
        <index>gestion-usuarios-logs</index>
    </appender>
</configuration>
```

### Alertas y Notificaciones

#### Configuración de Prometheus
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'gestion-usuarios'
    static_configs:
      - targets: ['backend:8080']

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

#### Reglas de Alerta
```yaml
# alert_rules.yml
groups:
  - name: gestion-usuarios
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High error rate detected
```

## Mantenimiento

### Backups de Base de Datos

#### Backup Automático
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"

docker exec postgres pg_dump -U app_user gestion_usuarios > "$BACKUP_DIR/backup_$DATE.sql"

# Retener solo los últimos 7 días
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

#### Restaurar Backup
```bash
# restore.sh
docker exec -i postgres psql -U app_user -d gestion_usuarios < backup_20240101_120000.sql
```

### Actualizaciones

#### Actualización del Backend
```bash
# 1. Backup de la base de datos
./scripts/backup.sh

# 2. Descargar nueva versión
git pull origin main

# 3. Compilar nueva versión
mvn clean package -DskipTests

# 4. Ejecutar migraciones
java -jar target/migrate.jar

# 5. Reiniciar servicio
sudo systemctl restart gestion-usuarios
```

#### Actualización del Frontend
```bash
# 1. Descargar nueva versión
git pull origin main

# 2. Instalar dependencias
cd frontend && npm install

# 3. Build de producción
npm run build

# 4. Desplegar
sudo cp -r build/* /var/www/gestion-usuarios/
sudo systemctl reload nginx
```

### Limpieza y Optimización

#### Limpieza de Logs
```bash
#!/bin/bash
# cleanup.sh

# Limpiar logs antiguos
find logs/ -name "*.log" -mtime +30 -delete

# Limpiar archivos temporales
rm -rf /tmp/spring-boot-tmp*

# Optimizar base de datos
docker exec postgres vacuumdb -U app_user -d gestion_usuarios -f
```

## Solución de Problemas

### Problemas Comunes

#### Error: "Cannot connect to database"
```bash
# Verificar conexión a PostgreSQL
telnet localhost 5432

# Verificar logs de PostgreSQL
docker logs postgres

# Verificar configuración de conexión
psql -h localhost -U app_user -d gestion_usuarios -c "SELECT 1;"
```

#### Error: "JWT token expired"
```bash
# Verificar configuración de JWT
echo $APP_JWT_EXPIRATION

# Verificar sincronización de tiempo
ntpdate -q pool.ntp.org
```

#### Error: "CORS policy"
```bash
# Verificar configuración de CORS
# En application.properties:
spring.web.cors.allowed-origins=http://localhost:3000
```

#### Error: "Out of memory"
```bash
# Aumentar memoria JVM
java -Xmx1024m -Xms512m -jar app.jar

# Verificar uso de memoria
jstat -gc $(pgrep java)
```

### Herramientas de Diagnóstico

#### Análisis de Rendimiento
```bash
# Java Flight Recorder
java -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=app.jfr -jar app.jar

# JProfiler o VisualVM para análisis en tiempo real
```

#### Análisis de Base de Datos
```sql
-- Queries lentas
SELECT query, calls, mean_time
FROM pg_stat_statements
WHERE calls > 100
ORDER BY mean_time DESC
LIMIT 10;

-- Índices no utilizados
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

### Soporte y Documentación

#### Recursos
- **Documentación API**: http://localhost:8080/swagger-ui.html
- **Métricas**: http://localhost:8080/actuator/metrics
- **Health Check**: http://localhost:8080/actuator/health

#### Comandos Útiles
```bash
# Verificar estado del servicio
sudo systemctl status gestion-usuarios

# Ver logs en tiempo real
tail -f logs/app.log

# Verificar puertos en uso
netstat -tlnp | grep 8080

# Verificar procesos Java
jps -l

# Forzar reinicio
sudo systemctl restart gestion-usuarios
```

## Seguridad en Producción

### Checklist de Seguridad

- [ ] Cambiar todas las contraseñas por defecto
- [ ] Usar HTTPS con certificado SSL válido
- [ ] Configurar firewall (iptables/ufw)
- [ ] Implementar rate limiting
- [ ] Configurar logs de auditoría
- [ ] Habilitar 2FA para acceso admin
- [ ] Realizar penetration testing
- [ ] Configurar backups automáticos
- [ ] Implementar monitoreo 24/7
- [ ] Documentar procedimientos de incidentes

### Mejores Prácticas

1. **Principio de mínimos privilegios**
2. **Defensa en profundidad**
3. **Fail securely**
4. **Keep it simple**
5. **Security by design**
6. **Regular security audits**

## Contacto y Soporte

Para soporte técnico:
- **Email**: soporte@gestionusuarios.com
- **Documentación**: https://docs.gestionusuarios.com
- **Issues**: https://github.com/tu-usuario/gestion-usuarios/issues
- **Wiki**: https://github.com/tu-usuario/gestion-usuarios/wiki

---

**Nota**: Esta guía debe ser adaptada según las necesidades específicas de tu entorno y requisitos de seguridad.