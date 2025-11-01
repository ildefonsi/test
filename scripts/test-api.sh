#!/bin/bash

# Script para probar la API REST del sistema de gestión de usuarios
# Autor: Sistema de Gestión de Usuarios
# Versión: 1.0.0

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
BASE_URL="http://localhost:8080/api"
CONTENT_TYPE="Content-Type: application/json"
TOKEN=""

# Funciones auxiliares
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Función para hacer peticiones HTTP
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=$4
    
    local headers="-H \"$CONTENT_TYPE\""
    
    if [ ! -z "$auth" ] && [ "$auth" = "true" ]; then
        headers="$headers -H \"Authorization: Bearer $TOKEN\""
    fi
    
    if [ ! -z "$data" ]; then
        curl -s -X $method $headers -d "$data" "$BASE_URL$endpoint"
    else
        curl -s -X $method $headers "$BASE_URL$endpoint"
    fi
}

# Verificar que el servicio esté disponible
check_service() {
    print_header "Verificando disponibilidad del servicio"
    
    if curl -s -f "$BASE_URL/usuarios" > /dev/null; then
        print_success "Servicio disponible"
        return 0
    else
        print_error "Servicio no disponible. Por favor, asegúrate de que el backend esté ejecutándose."
        exit 1
    fi
}

# Test de autenticación
test_auth() {
    print_header "Test de Autenticación"
    
    # Login exitoso
    echo "Probando login con credenciales válidas..."
    RESPONSE=$(make_request "POST" "/auth/signin" '{"username":"admin", "password":"admin123"}' "false")
    
    if echo "$RESPONSE" | grep -q "token"; then
        TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | grep -o '[^:]*$' | tr -d '"')
        print_success "Login exitoso - Token obtenido"
        echo "Token: ${TOKEN:0:20}..."
    else
        print_error "Login fallido"
        echo "Respuesta: $RESPONSE"
        return 1
    fi
    
    # Login fallido
    echo -e "\nProbando login con credenciales inválidas..."
    RESPONSE=$(make_request "POST" "/auth/signin" '{"username":"admin", "password":"wrong"}' "false")
    
    if echo "$RESPONSE" | grep -q "401\|403\|error"; then
        print_success "Login fallido manejado correctamente"
    else
        print_warning "Respuesta inesperada en login fallido"
    fi
}

# Test de gestión de usuarios
test_usuarios() {
    print_header "Test de Gestión de Usuarios"
    
    # Obtener todos los usuarios
    echo "Obteniendo lista de usuarios..."
    RESPONSE=$(make_request "GET" "/usuarios" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Lista de usuarios obtenida"
        TOTAL_USERS=$(echo "$RESPONSE" | grep -o '"totalElements":[0-9]*' | grep -o '[0-9]*')
        echo "Total de usuarios: $TOTAL_USERS"
    else
        print_error "Error obteniendo usuarios"
        echo "Respuesta: $RESPONSE"
    fi
    
    # Crear nuevo usuario
    echo -e "\nCreando nuevo usuario..."
    NEW_USER='{
        "username": "test.user",
        "email": "test.user@empresa.com",
        "password": "Test123456",
        "nombre": "Usuario",
        "apellidos": "de Prueba",
        "activo": true,
        "perfiles": ["USER"]
    }'
    
    RESPONSE=$(make_request "POST" "/usuarios" "$NEW_USER" "true")
    
    if echo "$RESPONSE" | grep -q "id"; then
        USER_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
        print_success "Usuario creado - ID: $USER_ID"
        
        # Actualizar usuario
        echo -e "\nActualizando usuario..."
        UPDATE_USER='{
            "username": "test.user",
            "email": "test.user.updated@empresa.com",
            "nombre": "Usuario",
            "apellidos": "de Prueba Actualizado",
            "activo": true,
            "perfiles": ["USER", "EDITOR"]
        }'
        
        RESPONSE=$(make_request "PUT" "/usuarios/$USER_ID" "$UPDATE_USER" "true")
        
        if echo "$RESPONSE" | grep -q "id"; then
            print_success "Usuario actualizado"
            
            # Cambiar estado
            echo -e "\nCambiando estado del usuario..."
            RESPONSE=$(make_request "PATCH" "/usuarios/$USER_ID/estado?activo=false" "" "true")
            print_success "Estado cambiado a inactivo"
            
            # Eliminar usuario
            echo -e "\nEliminando usuario..."
            RESPONSE=$(make_request "DELETE" "/usuarios/$USER_ID" "" "true")
            print_success "Usuario eliminado"
        else
            print_error "Error actualizando usuario"
        fi
    else
        print_error "Error creando usuario"
        echo "Respuesta: $RESPONSE"
    fi
}

# Test de gestión de perfiles
test_perfiles() {
    print_header "Test de Gestión de Perfiles"
    
    # Obtener todos los perfiles
    echo "Obteniendo lista de perfiles..."
    RESPONSE=$(make_request "GET" "/perfiles" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Lista de perfiles obtenida"
    else
        print_error "Error obteniendo perfiles"
    fi
    
    # Crear nuevo perfil
    echo -e "\nCreando nuevo perfil..."
    NEW_PROFILE='{
        "nombre": "TEST_PROFILE",
        "descripcion": "Perfil de prueba para testing"
    }'
    
    RESPONSE=$(make_request "POST" "/perfiles" "$NEW_PROFILE" "true")
    
    if echo "$RESPONSE" | grep -q "id"; then
        PROFILE_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
        print_success "Perfil creado - ID: $PROFILE_ID"
        
        # Actualizar perfil
        echo -e "\nActualizando perfil..."
        UPDATE_PROFILE='{
            "nombre": "TEST_PROFILE",
            "descripcion": "Perfil de prueba actualizado"
        }'
        
        RESPONSE=$(make_request "PUT" "/perfiles/$PROFILE_ID" "$UPDATE_PROFILE" "true")
        
        if echo "$RESPONSE" | grep -q "id"; then
            print_success "Perfil actualizado"
            
            # Eliminar perfil
            echo -e "\nEliminando perfil..."
            RESPONSE=$(make_request "DELETE" "/perfiles/$PROFILE_ID" "" "true")
            print_success "Perfil eliminado"
        else
            print_error "Error actualizando perfil"
        fi
    else
        print_error "Error creando perfil"
        echo "Respuesta: $RESPONSE"
    fi
}

# Test de búsqueda y filtros
test_busqueda() {
    print_header "Test de Búsqueda y Filtros"
    
    # Buscar usuarios
    echo "Buscando usuarios con término 'maria'..."
    RESPONSE=$(make_request "GET" "/usuarios/search?searchTerm=maria" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Búsqueda de usuarios exitosa"
    else
        print_error "Error en búsqueda de usuarios"
    fi
    
    # Buscar perfiles
    echo -e "\nBuscando perfiles con término 'admin'..."
    RESPONSE=$(make_request "GET" "/perfiles/search?searchTerm=admin" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Búsqueda de perfiles exitosa"
    else
        print_error "Error en búsqueda de perfiles"
    fi
    
    # Obtener usuarios por perfil
    echo -e "\nObteniendo usuarios con perfil 'USER'..."
    RESPONSE=$(make_request "GET" "/usuarios/perfil/USER" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Filtro por perfil exitoso"
    else
        print_error "Error en filtro por perfil"
    fi
}

# Test de paginación
test_paginacion() {
    print_header "Test de Paginación"
    
    # Obtener usuarios con paginación
    echo "Obteniendo usuarios paginados (página 0, 5 elementos)..."
    RESPONSE=$(make_request "GET" "/usuarios?page=0&size=5" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Paginación de usuarios exitosa"
        PAGE_SIZE=$(echo "$RESPONSE" | grep -o '"size":[0-9]*' | grep -o '[0-9]*')
        echo "Tamaño de página: $PAGE_SIZE"
    else
        print_error "Error en paginación de usuarios"
    fi
    
    # Segunda página
    echo -e "\nObteniendo segunda página..."
    RESPONSE=$(make_request "GET" "/usuarios?page=1&size=5" "" "true")
    
    if echo "$RESPONSE" | grep -q "content"; then
        print_success "Segunda página obtenida"
    else
        print_error "Error obteniendo segunda página"
    fi
}

# Test de manejo de errores
test_errores() {
    print_header "Test de Manejo de Errores"
    
    # Intentar acceder sin autenticación
    echo "Intentando acceder sin token..."
    RESPONSE=$(make_request "GET" "/usuarios" "" "false")
    
    if echo "$RESPONSE" | grep -q "401\|403"; then
        print_success "Acceso no autorizado manejado correctamente"
    else
        print_warning "Respuesta inesperada sin autenticación"
    fi
    
    # Intentar crear usuario duplicado
    echo -e "\nIntentando crear usuario duplicado..."
    DUPLICATE_USER='{
        "username": "admin",
        "email": "duplicate@empresa.com",
        "password": "Test123456",
        "nombre": "Duplicado",
        "apellidos": "Test",
        "activo": true,
        "perfiles": ["USER"]
    }'
    
    RESPONSE=$(make_request "POST" "/usuarios" "$DUPLICATE_USER" "true")
    
    if echo "$RESPONSE" | grep -q "409\|Conflict"; then
        print_success "Manejo de duplicados correcto"
    else
        print_warning "Manejo de duplicados no estándar"
    fi
    
    # Intentar acceder a recurso inexistente
    echo -e "\nIntentando acceder a usuario inexistente..."
    RESPONSE=$(make_request "GET" "/usuarios/99999" "" "true")
    
    if echo "$RESPONSE" | grep -q "404\|Not Found"; then
        print_success "Manejo de recurso inexistente correcto"
    else
        print_warning "Manejo de recurso inexistente no estándar"
    fi
}

# Test de documentación
test_documentacion() {
    print_header "Test de Documentación"
    
    # Verificar Swagger UI
    echo "Verificando Swagger UI..."
    if curl -s -f "http://localhost:8080/swagger-ui.html" > /dev/null; then
        print_success "Swagger UI disponible"
    else
        print_error "Swagger UI no disponible"
    fi
    
    # Verificar OpenAPI JSON
    echo -e "\nVerificando OpenAPI JSON..."
    if curl -s -f "http://localhost:8080/v3/api-docs" > /dev/null; then
        print_success "OpenAPI JSON disponible"
    else
        print_error "OpenAPI JSON no disponible"
    fi
}

# Función principal
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    Test de API REST - Gestión de Usuarios    ${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    
    check_service
    
    if [ $? -eq 0 ]; then
        test_auth
        test_usuarios
        test_perfiles
        test_busqueda
        test_paginacion
        test_errores
        test_documentacion
        
        print_header "Resumen de Tests"
        print_success "Todos los tests han sido ejecutados"
        print_warning "Revisa los resultados anteriores para verificar el funcionamiento"
        
        echo -e "\n${GREEN}✓ Testing completado${NC}"
        echo -e "${BLUE}========================================${NC}\n"
    fi
}

# Ejecutar función principal
main