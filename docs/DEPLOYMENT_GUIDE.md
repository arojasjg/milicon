# Guía de Despliegue - E-commerce de Artículos Deportivos

## Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Despliegue con Docker Compose](#despliegue-con-docker-compose)
3. [Despliegue Manual](#despliegue-manual)
4. [Despliegue en Kubernetes](#despliegue-en-kubernetes)
5. [Configuración de Bases de Datos](#configuración-de-bases-de-datos)
6. [Configuración de Seguridad](#configuración-de-seguridad)
7. [Monitoreo y Observabilidad](#monitoreo-y-observabilidad)
8. [Solución de Problemas](#solución-de-problemas)

## Requisitos Previos

Antes de comenzar el despliegue, asegúrese de tener instalados los siguientes componentes:

### Para Despliegue con Docker Compose

- Docker (versión 20.10.0 o superior)
- Docker Compose (versión 2.0.0 o superior)
- Git

### Para Despliegue Manual

- Java 17
- Maven 3.8.0 o superior
- MySQL 8.0
- Node.js 16.0.0 o superior
- npm 8.0.0 o superior
- Git

### Para Despliegue en Kubernetes

- Kubernetes Cluster (versión 1.20 o superior)
- kubectl
- Helm 3
- Git

## Despliegue con Docker Compose

El despliegue con Docker Compose es la forma más sencilla de poner en marcha todo el sistema.

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/yourusername/milicons-ecommerce.git
cd milicons-ecommerce
```

### Paso 2: Configurar Variables de Entorno

Cree un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# MySQL
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### Paso 3: Iniciar los Servicios

```bash
docker-compose up -d
```

### Paso 4: Verificar el Despliegue

Verifique que todos los servicios estén funcionando correctamente:

```bash
docker-compose ps
```

Acceda a la aplicación en: http://localhost:3001

## Despliegue Manual

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/yourusername/milicons-ecommerce.git
cd milicons-ecommerce
```

### Paso 2: Configurar Bases de Datos

```bash
mysql -u root -p
CREATE DATABASE ecommerce_users;
CREATE DATABASE ecommerce_products;
CREATE DATABASE ecommerce_orders;
```

### Paso 3: Configurar Propiedades de la Aplicación

Edite los archivos `application.properties` de cada microservicio para configurar la conexión a la base de datos y otras propiedades.

### Paso 4: Compilar y Ejecutar los Microservicios

```bash
# 1. Servicio de Descubrimiento
cd backend/discovery-server
mvn clean package
java -jar target/discovery-server-0.0.1-SNAPSHOT.jar &

# 2. Microservicio de Usuarios
cd ../user-service
mvn clean package
java -jar target/user-service-0.0.1-SNAPSHOT.jar &

# 3. Microservicio de Productos
cd ../product-service
mvn clean package
java -jar target/product-service-0.0.1-SNAPSHOT.jar &

# 4. Microservicio de Pedidos
cd ../order-service
mvn clean package
java -jar target/order-service-0.0.1-SNAPSHOT.jar &

# 5. Microservicio de Notificaciones
cd ../notification-service
mvn clean package
java -jar target/notification-service-0.0.1-SNAPSHOT.jar &

# 6. API Gateway
cd ../api-gateway
mvn clean package
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar &
```

### Paso 5: Configurar y Ejecutar el Frontend

```bash
cd ../../frontend
npm install
npm run build
```

Configure un servidor web (como Nginx) para servir los archivos estáticos generados en la carpeta `build`.

## Despliegue en Kubernetes

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/yourusername/milicons-ecommerce.git
cd milicons-ecommerce/kubernetes
```

### Paso 2: Configurar Secrets

```bash
kubectl create namespace milicons-ecommerce

kubectl create secret generic db-credentials \
  --from-literal=MYSQL_ROOT_PASSWORD=your_root_password \
  --from-literal=MYSQL_USER=your_user \
  --from-literal=MYSQL_PASSWORD=your_password \
  -n milicons-ecommerce

kubectl create secret generic jwt-secret \
  --from-literal=JWT_SECRET=your_jwt_secret_key \
  -n milicons-ecommerce

kubectl create secret generic mail-credentials \
  --from-literal=MAIL_USERNAME=your_email@gmail.com \
  --from-literal=MAIL_PASSWORD=your_app_password \
  -n milicons-ecommerce
```

### Paso 3: Desplegar con Helm

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Desplegar MySQL
helm install mysql bitnami/mysql \
  --set auth.rootPassword=$(kubectl get secret db-credentials -n milicons-ecommerce -o jsonpath="{.data.MYSQL_ROOT_PASSWORD}" | base64 --decode) \
  --set auth.username=$(kubectl get secret db-credentials -n milicons-ecommerce -o jsonpath="{.data.MYSQL_USER}" | base64 --decode) \
  --set auth.password=$(kubectl get secret db-credentials -n milicons-ecommerce -o jsonpath="{.data.MYSQL_PASSWORD}" | base64 --decode) \
  --set auth.database=ecommerce \
  -n milicons-ecommerce

# Desplegar la aplicación
helm install milicons-ecommerce ./helm/milicons-ecommerce -n milicons-ecommerce
```

### Paso 4: Verificar el Despliegue

```bash
kubectl get pods -n milicons-ecommerce
kubectl get services -n milicons-ecommerce
```

## Configuración de Bases de Datos

### Respaldo y Restauración

Para realizar un respaldo de las bases de datos:

```bash
mysqldump -u root -p ecommerce_users > ecommerce_users_backup.sql
mysqldump -u root -p ecommerce_products > ecommerce_products_backup.sql
mysqldump -u root -p ecommerce_orders > ecommerce_orders_backup.sql
```

Para restaurar las bases de datos:

```bash
mysql -u root -p ecommerce_users < ecommerce_users_backup.sql
mysql -u root -p ecommerce_products < ecommerce_products_backup.sql
mysql -u root -p ecommerce_orders < ecommerce_orders_backup.sql
```

### Migración de Datos

Para migrar datos entre entornos, utilice la herramienta de migración de datos incluida:

```bash
cd tools
./migrate-data.sh --source=production --target=staging
```

## Configuración de Seguridad

### Certificados SSL

Para configurar SSL en el API Gateway:

1. Obtenga un certificado SSL (por ejemplo, de Let's Encrypt).
2. Configure el certificado en el API Gateway:

```yaml
server:
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: your_keystore_password
    key-store-type: PKCS12
    key-alias: your_key_alias
```

### Firewall

Configure el firewall para permitir solo el tráfico necesario:

```bash
# Permitir tráfico HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir tráfico a la base de datos solo desde la red interna
sudo ufw allow from 10.0.0.0/8 to any port 3306
```

## Monitoreo y Observabilidad

### Prometheus y Grafana

Para acceder a las herramientas de monitoreo:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (usuario: admin, contraseña: admin)

### Alertas

Configure alertas en Grafana para recibir notificaciones cuando ocurran eventos importantes:

1. Acceda a Grafana.
2. Vaya a Alerting > Notification channels.
3. Configure canales de notificación (email, Slack, etc.).
4. Cree reglas de alerta en sus dashboards.

## Solución de Problemas

### Problemas Comunes

#### Los microservicios no se registran en Eureka

Verifique que el servicio de descubrimiento esté funcionando y que los microservicios tengan la configuración correcta para conectarse a él.

```bash
# Verificar el estado del servicio de descubrimiento
curl http://localhost:8761/actuator/health

# Verificar los logs del microservicio
tail -f logs/user-service.log
```

#### Errores de conexión a la base de datos

Verifique que las bases de datos estén funcionando y que los microservicios tengan la configuración correcta para conectarse a ellas.

```bash
# Verificar el estado de MySQL
sudo systemctl status mysql

# Verificar la conexión a la base de datos
mysql -u your_user -p -h localhost ecommerce_users
```

#### El frontend no puede conectarse al backend

Verifique que el API Gateway esté funcionando y que el frontend tenga la configuración correcta para conectarse a él.

```bash
# Verificar el estado del API Gateway
curl http://localhost:8080/actuator/health

# Verificar los logs del API Gateway
tail -f logs/api-gateway.log
```

### Logs

Los logs de los microservicios se encuentran en:

- Docker Compose: `docker-compose logs -f [service_name]`
- Despliegue manual: `logs/[service_name].log`
- Kubernetes: `kubectl logs -f [pod_name] -n milicons-ecommerce`
