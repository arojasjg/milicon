# Guía completa de instalación y configuración del proyecto E-commerce de Artículos Deportivos

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Instalación de herramientas](#2-instalación-de-herramientas)
3. [Configuración del entorno](#3-configuración-del-entorno)
4. [Configuración de las bases de datos](#4-configuración-de-las-bases-de-datos)
5. [Ejecución del proyecto](#5-ejecución-del-proyecto)
6. [Solución de problemas comunes](#6-solución-de-problemas-comunes)
7. [Verificación del funcionamiento](#7-verificación-del-funcionamiento)
8. [Comandos útiles](#8-comandos-útiles)

## 1. Requisitos previos

Antes de comenzar, asegúrate de tener suficiente espacio en disco (al menos 10GB libres) y una conexión a Internet estable.

### Requisitos de hardware recomendados:

- CPU: 2 núcleos o más
- RAM: 8GB o más
- Espacio en disco: 10GB libres

## 2. Instalación de herramientas

### 2.1 Instalación de Java 17

#### macOS:

```bash
# Usando Homebrew para instalar oracle JDK
brew install --cask oracle-jdk

# Verificar la instalación
java -version
```

#### Windows:

1. Descarga el instalador de AdoptOpenJDK 17 desde [adoptopenjdk.net](https://adoptopenjdk.net/)
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica la instalación: `java -version`

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Verificar la instalación
java -version
```

### 2.2 Instalación de Maven

#### macOS:

```bash
brew install maven

# Verificar la instalación
mvn -version
```

#### Windows:

1. Descarga Maven desde [maven.apache.org](https://maven.apache.org/download.cgi)
2. Extrae el archivo en C:\Program Files\Apache\maven
3. Añade la ruta a las variables de entorno:
   - Variable: MAVEN_HOME, Valor: C:\Program Files\Apache\maven
   - Añade %MAVEN_HOME%\bin al PATH
4. Verifica la instalación: `mvn -version`

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install maven

# Verificar la instalación
mvn -version
```

### 2.3 Instalación de MySQL

#### macOS:

```bash
brew install mysql

# Iniciar MySQL
brew services start mysql

# Configurar contraseña
mysql_secure_installation
```

#### Windows:

1. Descarga MySQL Installer desde [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Ejecuta el instalador y sigue las instrucciones
3. Durante la instalación, configura la contraseña de root

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install mysql-server

# Iniciar MySQL
sudo systemctl start mysql

# Configurar seguridad
sudo mysql_secure_installation
```

### 2.4 Instalación de Node.js y npm

#### macOS:

```bash
brew install node

# Verificar la instalación
node -v
npm -v
```

#### Windows:

1. Descarga el instalador desde [nodejs.org](https://nodejs.org/)
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica la instalación: `node -v` y `npm -v`

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install nodejs npm

# Verificar la instalación
node -v
npm -v
```

### 2.5 Instalación de Docker y Docker Compose

#### macOS:

1. Descarga [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop)
2. Instala la aplicación
3. Inicia Docker Desktop
4. Verifica la instalación:

```bash
docker --version
docker-compose --version
```

#### Windows:

1. Descarga [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop)
2. Instala la aplicación
3. Asegúrate de que WSL 2 esté habilitado (Windows 10/11)
4. Inicia Docker Desktop
5. Verifica la instalación:

```bash
docker --version
docker-compose --version
```

#### Linux (Ubuntu/Debian):

```bash
# Instalar Docker
sudo apt update
sudo apt install apt-tranmilicon-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Añadir usuario al grupo docker
sudo usermod -aG docker ${USER}
su - ${USER}

# Verificar la instalación
docker --version
docker-compose --version
```

## 3. Configuración del entorno

### 3.1 Clonar el repositorio

```bash
git clone https://github.com/arojas/milicon-ecommerce.git
cd milicon-ecommerce
```

### 3.2 Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```
# MySQL
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=user
MYSQL_PASSWORD=password

# JWT
JWT_SECRET=your_jwt_secret_key_make_it_long_and_complex
JWT_EXPIRATION=86400000
```

## 4. Configuración de las bases de datos

### 4.1 Crear las bases de datos

```bash
# Iniciar sesión en MySQL
mysql -u root -p

# Crear las bases de datos
CREATE DATABASE ecommerce_users;
CREATE DATABASE ecommerce_products;
CREATE DATABASE ecommerce_orders;

# Salir de MySQL
exit
```

### 4.2 Verificar la configuración de las bases de datos

Revisa los archivos de configuración de cada microservicio para asegurarte de que la configuración de la base de datos es correcta:

- `backend/user-service/src/main/resources/application.properties`
- `backend/product-service/src/main/resources/application.properties`
- `backend/order-service/src/main/resources/application.properties`

Asegúrate de que las siguientes propiedades estén configuradas correctamente:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_users?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

## 5. Ejecución del proyecto

### 5.1 Usando Docker Compose (recomendado)

#### Paso 1: Asegúrate de que Docker Desktop esté en ejecución

- En macOS y Windows, abre Docker Desktop desde tu carpeta de Aplicaciones
- En Linux, verifica que el servicio esté en ejecución: `sudo systemctl status docker`

#### Paso 2: Construir e iniciar los contenedores

```bash
# Asegúrate de estar en la raíz del proyecto
cd /ruta/a/milicons-ecommerce

# Construir e iniciar los contenedores
docker-compose up -d --build
```

#### Paso 3: Verificar que los contenedores están en ejecución

```bash
docker-compose ps
```

Deberías ver todos los servicios listados con el estado "Up".

### 5.2 Ejecución manual (alternativa)

Si prefieres ejecutar los servicios manualmente sin Docker:

#### Paso 1: Iniciar el Servicio de Descubrimiento

```bash
cd backend/discovery-server
./mvnw spring-boot:run
```

#### Paso 2: Iniciar el Microservicio de Usuarios

Abre una nueva terminal:

```bash
cd backend/user-service
./mvnw spring-boot:run
```

#### Paso 3: Iniciar el Microservicio de Productos

Abre una nueva terminal:

```bash
cd backend/product-service
./mvnw spring-boot:run
```

#### Paso 4: Iniciar el Microservicio de Pedidos

Abre una nueva terminal:

```bash
cd backend/order-service
./mvnw spring-boot:run
```

#### Paso 5: Iniciar el Microservicio de Notificaciones

Abre una nueva terminal:

```bash
cd backend/notification-service
./mvnw spring-boot:run
```

#### Paso 6: Iniciar el API Gateway

Abre una nueva terminal:

```bash
cd backend/api-gateway
./mvnw spring-boot:run
```

#### Paso 7: Iniciar el Frontend

Abre una nueva terminal:

```bash
cd frontend
npm install
npm start
```

## 6. Solución de problemas comunes

### 6.1 Docker no se inicia

#### macOS:

1. Verifica que Docker Desktop esté instalado y en ejecución
2. Reinicia Docker Desktop
3. Si persiste el problema, reinicia tu Mac

#### Windows:

1. Verifica que WSL 2 esté habilitado
2. Reinicia Docker Desktop
3. Si persiste el problema, reinicia Windows

#### Linux:

```bash
# Reiniciar el servicio Docker
sudo systemctl restart docker

# Verificar el estado
sudo systemctl status docker
```

### 6.2 Problemas de puertos

Si algún puerto ya está en uso:

```bash
# Identificar qué proceso está usando el puerto (ejemplo para el puerto 8080)
# macOS/Linux:
lsof -i :8080

# Windows:
netstat -ano | findstr :8080

# Detener el proceso (reemplaza PID con el ID del proceso)
# macOS/Linux:
kill -9 PID

# Windows:
taskkill /PID PID /F
```

Alternativamente, puedes modificar los puertos en el archivo `docker-compose.yml` o en los archivos `application.properties` de cada microservicio.

### 6.3 Problemas de memoria en Docker

Si Docker falla por falta de memoria:

1. Abre Docker Desktop
2. Ve a Preferencias > Recursos
3. Aumenta la memoria asignada (8GB recomendado)
4. Haz clic en "Apply & Restart"

### 6.4 Problemas con MySQL

Si tienes problemas para conectarte a MySQL:

```bash
# Verificar que MySQL esté en ejecución
# macOS:
brew services list

# Windows/Linux:
sudo systemctl status mysql

# Reiniciar MySQL si es necesario
# macOS:
brew services restart mysql

# Windows/Linux:
sudo systemctl restart mysql
```

### 6.5 Problemas con Maven

Si tienes problemas con Maven:

```bash
# Limpiar y reinstalar dependencias
mvn clean install -DskipTests
```

## 7. Verificación del funcionamiento

Una vez que todos los servicios estén en ejecución, puedes acceder a:

- **Frontend**: http://localhost:3001 (con Docker) o http://localhost:3000 (ejecución manual)
- **API Gateway**: http://localhost:8080
- **Servicio de Descubrimiento (Eureka)**: http://localhost:8761
- **Documentación de la API (Swagger)**: http://localhost:8080/api/swagger-ui.html

### 7.1 Prueba básica del sistema

1. Accede al frontend
2. Regístrate como nuevo usuario
3. Inicia sesión con el usuario registrado
4. Navega por el catálogo de productos
5. Añade productos al carrito
6. Completa el proceso de compra

## 8. Comandos útiles

### 8.1 Docker Compose

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs <nombre_del_servicio>

# Ver logs en tiempo real
docker-compose logs -f

# Detener todos los contenedores
docker-compose down

# Detener y eliminar volúmenes (borra los datos de las bases de datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart <nombre_del_servicio>

# Ver el uso de recursos
docker stats
```

### 8.2 Maven

```bash
# Compilar un proyecto
mvn clean compile

# Ejecutar pruebas
mvn test

# Empaquetar un proyecto
mvn package

# Instalar en el repositorio local
mvn install

# Ejecutar una aplicación Spring Boot
mvn spring-boot:run
```

### 8.3 MySQL

```bash
# Iniciar sesión en MySQL
mysql -u root -p

# Mostrar bases de datos
SHOW DATABASES;

# Seleccionar una base de datos
USE ecommerce_users;

# Mostrar tablas
SHOW TABLES;

# Realizar una copia de seguridad
mysqldump -u root -p ecommerce_users > backup_users.sql
```

## 9. Arquitectura del sistema

El sistema está compuesto por los siguientes componentes:

- **API Gateway**: Punto de entrada único para todas las solicitudes de los clientes.
- **Servicio de Descubrimiento (Eureka)**: Permite que los microservicios se registren y descubran entre sí.
- **Microservicio de Usuarios**: Gestión de usuarios, autenticación y perfiles.
- **Microservicio de Productos**: Gestión del catálogo de productos y categorías.
- **Microservicio de Pedidos**: Gestión del carrito de compras y procesamiento de pedidos.
- **Microservicio de Notificaciones**: Envío de correos electrónicos y notificaciones.
- **Frontend**: Interfaz de usuario desarrollada con React.

Para más detalles sobre la arquitectura, consulta el archivo [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md).

## 10. Documentación adicional

- [README.md](README.md): Información general del proyecto
- [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md): Descripción detallada de la arquitectura
- [docs/USER_MANUAL.md](docs/USER_MANUAL.md): Manual de usuario
- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md): Guía de despliegue en producción

## 11. Estructura del proyecto

```
milicons-ecommerce/
├── backend/
│   ├── api-gateway/
│   ├── discovery-server/
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   └── notification-service/
├── frontend/
├── docs/
│   ├── USER_MANUAL.md
│   └── DEPLOYMENT_GUIDE.md
├── scripts/
│   └── deploy.sh
├── docker-compose.yml
├── README.md
├── ARCHITECTURE_DESIGN.md
└── pasos.md
```

## 12. Configuración de Docker Compose

El archivo `docker-compose.yml` define todos los servicios necesarios para ejecutar la aplicación:

```yaml
services:
  # Databases
  mysql-users:
    image: mysql:8.0
    container_name: mysql-users
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ecommerce_users
    ports:
      - "3306:3306"
    volumes:
      - mysql-users-data:/var/lib/mysql
    networks:
      - ecommerce-network

  mysql-products:
    image: mysql:8.0
    container_name: mysql-products
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ecommerce_products
    ports:
      - "3307:3306"
    volumes:
      - mysql-products-data:/var/lib/mysql
    networks:
      - ecommerce-network

  mysql-orders:
    image: mysql:8.0
    container_name: mysql-orders
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ecommerce_orders
    ports:
      - "3308:3306"
    volumes:
      - mysql-orders-data:/var/lib/mysql
    networks:
      - ecommerce-network

  # Discovery Server
  discovery-server:
    build: ./backend/discovery-server
    container_name: discovery-server
    ports:
      - "8761:8761"
    networks:
      - ecommerce-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8761/actuator/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Microservices
  user-service:
    build: ./backend/user-service
    container_name: user-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql-users:3306/ecommerce_users?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-server:8761/eureka/
    ports:
      - "8081:8081"
    depends_on:
      - mysql-users
      - discovery-server
    networks:
      - ecommerce-network

  product-service:
    build: ./backend/product-service
    container_name: product-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql-products:3306/ecommerce_products?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-server:8761/eureka/
    ports:
      - "8082:8082"
    depends_on:
      - mysql-products
      - discovery-server
    networks:
      - ecommerce-network

  order-service:
    build: ./backend/order-service
    container_name: order-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql-orders:3306/ecommerce_orders?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-server:8761/eureka/
    ports:
      - "8083:8083"
    depends_on:
      - mysql-orders
      - discovery-server
      - product-service
    networks:
      - ecommerce-network

  notification-service:
    build: ./backend/notification-service
    container_name: notification-service
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-server:8761/eureka/
    ports:
      - "8084:8084"
    depends_on:
      - discovery-server
    networks:
      - ecommerce-network

  # API Gateway
  api-gateway:
    build: ./backend/api-gateway
    container_name: api-gateway
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-server:8761/eureka/
    ports:
      - "8080:8080"
    depends_on:
      - discovery-server
      - user-service
      - product-service
      - order-service
      - notification-service
    networks:
      - ecommerce-network

  # Frontend
  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3001:80"
    depends_on:
      - api-gateway
    networks:
      - ecommerce-network

networks:
  ecommerce-network:
    driver: bridge

volumes:
  mysql-users-data:
  mysql-products-data:
  mysql-orders-data:
```

## 13. Script de despliegue

El archivo `scripts/deploy.sh` contiene un script para desplegar la aplicación en un servidor de producción:

```bash
#!/bin/bash

# Script para desplegar la aplicación en un servidor de producción

# Variables
REMOTE_USER="ubuntu"
REMOTE_HOST="your-production-server.com"
REMOTE_DIR="/opt/milicons-ecommerce"
REPO_URL="https://github.com/yourusername/milicons-ecommerce.git"

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Iniciando despliegue en producción...${NC}"

# Conectar al servidor remoto y ejecutar comandos
ssh $REMOTE_USER@$REMOTE_HOST << EOF
    # Actualizar el sistema
    echo -e "${GREEN}Actualizando el sistema...${NC}"
    sudo apt-get update && sudo apt-get upgrade -y

    # Instalar Docker y Docker Compose si no están instalados
    if ! command -v docker &> /dev/null; then
        echo -e "${GREEN}Instalando Docker...${NC}"
        sudo apt-get install -y apt-tranmilicon-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt-get update
        sudo apt-get install -y docker-ce
        sudo usermod -aG docker $USER
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}Instalando Docker Compose...${NC}"
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi

    # Crear directorio de la aplicación si no existe
    if [ ! -d "$REMOTE_DIR" ]; then
        echo -e "${GREEN}Creando directorio de la aplicación...${NC}"
        sudo mkdir -p $REMOTE_DIR
        sudo chown $USER:$USER $REMOTE_DIR
    fi

    # Clonar o actualizar el repositorio
    if [ -d "$REMOTE_DIR/.git" ]; then
        echo -e "${GREEN}Actualizando el repositorio...${NC}"
        cd $REMOTE_DIR
        git pull
    else
        echo -e "${GREEN}Clonando el repositorio...${NC}"
        git clone $REPO_URL $REMOTE_DIR
        cd $REMOTE_DIR
    fi

    # Detener y eliminar contenedores existentes
    echo -e "${GREEN}Deteniendo contenedores existentes...${NC}"
    docker-compose down

    # Construir y levantar los contenedores
    echo -e "${GREEN}Construyendo y levantando contenedores...${NC}"
    docker-compose up -d --build

    # Verificar el estado de los contenedores
    echo -e "${GREEN}Verificando el estado de los contenedores...${NC}"
    docker-compose ps

    echo -e "${GREEN}Despliegue completado con éxito!${NC}"
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Despliegue completado con éxito!${NC}"
else
    echo -e "${RED}Error durante el despliegue. Por favor, revise los logs.${NC}"
    exit 1
fi
```

---

Con esta guía completa, deberías poder instalar, configurar y ejecutar el proyecto E-commerce de Artículos Deportivos sin problemas. Si encuentras algún error específico, no dudes en proporcionar más detalles para poder ayudarte a resolverlo.
