# E-commerce de Artículos Deportivos

Este proyecto es un sistema de comercio electrónico para la venta de artículos deportivos, implementado con una arquitectura de microservicios.

## Arquitectura

El sistema está compuesto por los siguientes componentes:

- **API Gateway**: Punto de entrada único para todas las solicitudes de los clientes.
- **Servicio de Descubrimiento (Eureka)**: Permite que los microservicios se registren y descubran entre sí.
- **Microservicio de Usuarios**: Gestión de usuarios, autenticación y perfiles.
- **Microservicio de Productos**: Gestión del catálogo de productos y categorías.
- **Microservicio de Pedidos**: Gestión del carrito de compras y procesamiento de pedidos.
- **Microservicio de Notificaciones**: Envío de correos electrónicos y notificaciones.
- **Frontend**: Interfaz de usuario desarrollada con React.

Para más detalles, consulte el documento [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md).

## Requisitos

- Java 17
- Maven
- MySQL 8.0
- Node.js 16+
- Docker y Docker Compose

## Configuración y Ejecución

### Usando Docker Compose (recomendado)

La forma más sencilla de ejecutar todo el sistema es utilizando Docker Compose:

```bash
# Clonar el repositorio
git clone https://github.com/arojas/milicon-ecommerce.git
cd milicon-ecommerce

# Iniciar todos los servicios
docker-compose up -d
```

Esto iniciará todos los microservicios, bases de datos y frontend.

### Ejecución manual

#### Backend

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/arojas/milicon-ecommerce.git
   cd milicon-ecommerce
   ```

2. Configurar las bases de datos MySQL:

   ```bash
   # Crear las bases de datos
   mysql -u root -p
   CREATE DATABASE ecommerce_users;
   CREATE DATABASE ecommerce_products;
   CREATE DATABASE ecommerce_orders;
   ```

3. Iniciar los microservicios en el siguiente orden:

   ```bash
   # 1. Servicio de Descubrimiento
   cd backend/discovery-server
   mvn spring-boot:run

   # 2. Microservicio de Usuarios
   cd ../user-service
   mvn spring-boot:run

   # 3. Microservicio de Productos
   cd ../product-service
   mvn spring-boot:run

   # 4. Microservicio de Pedidos
   cd ../order-service
   mvn spring-boot:run

   # 5. Microservicio de Notificaciones
   cd ../notification-service
   mvn spring-boot:run

   # 6. API Gateway
   cd ../api-gateway
   mvn spring-boot:run
   ```

### Frontend

```bash
cd frontend
npm install
npm start
```

Acceder a la aplicación en: http://localhost:3000

## Pruebas

### Ejecutar pruebas unitarias y de integración:

```bash
cd backend
mvn test
```

### Ejecutar pruebas E2E:

```bash
cd backend
mvn test -Dtest=*E2ETest
```

## CI/CD

Este proyecto utiliza GitHub Actions para la integración continua y entrega continua. El pipeline de CI/CD incluye:

1. **Construcción y pruebas**: Compila el código y ejecuta pruebas unitarias, de integración y E2E.
2. **Análisis de código**: Utiliza SonarCloud para analizar la calidad del código.
3. **Construcción de imágenes Docker**: Crea imágenes Docker para cada microservicio.
4. **Despliegue**: Despliega la aplicación en el entorno de producción.

Para configurar el pipeline de CI/CD:

1. Configura los siguientes secretos en tu repositorio de GitHub:

   - `DOCKERHUB_USERNAME`: Tu nombre de usuario de Docker Hub
   - `DOCKERHUB_TOKEN`: Tu token de acceso a Docker Hub
   - `SONAR_TOKEN`: Token de acceso a SonarCloud

2. Para desplegar en tu propio servidor, modifica el script `scripts/deploy.sh` con tus propios datos.

## Documentación

El proyecto incluye la siguiente documentación:

- [Arquitectura del Sistema](ARCHITECTURE_DESIGN.md): Descripción detallada de la arquitectura del sistema.
- [Manual de Usuario](docs/USER_MANUAL.md): Guía para los usuarios finales de la aplicación.
- [Guía de Despliegue](docs/DEPLOYMENT_GUIDE.md): Instrucciones para desplegar la aplicación en diferentes entornos.
- [Documentación de la API](http://localhost:8080/api/swagger-ui.html): Documentación interactiva de la API (disponible cuando la aplicación está en ejecución).
- [READMEs de los Microservicios](backend/user-service/README.md): Documentación específica para cada microservicio.

## Contribución

1. Fork el repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Pruebas de Rendimiento

El proyecto incluye pruebas de rendimiento utilizando JMeter para evaluar el rendimiento y la escalabilidad de los microservicios.

### Requisitos

- Apache JMeter 5.5 o superior
- jq (para procesar JSON en el script de pruebas)

### Ejecución de las pruebas de rendimiento

```bash
cd performance-tests
./run-performance-tests.sh
```

Las pruebas de rendimiento incluyen:

1. **Pruebas del microservicio de usuarios**:

   - Registro de usuarios
   - Inicio de sesión
   - Obtención de perfiles de usuario

2. **Pruebas del microservicio de productos**:
   - Creación de categorías
   - Creación de productos
   - Obtención de productos
   - Actualización de productos

Los resultados de las pruebas se guardan en el directorio `performance-tests/results` y se generan informes HTML detallados.
