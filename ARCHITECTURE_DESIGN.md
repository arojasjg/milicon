# Arquitectura del Sistema de Comercio Electrónico de Artículos Deportivos

## Visión General

El sistema de comercio electrónico de artículos deportivos está diseñado como una arquitectura de microservicios en el backend, con un frontend basado en React. Esta arquitectura permite un desarrollo independiente, despliegue y escalabilidad de cada componente.

## Componentes Principales

### Frontend (React)

El frontend está desarrollado con React y proporciona la interfaz de usuario para los clientes:

- Interfaz de usuario responsive y moderna
- Gestión del estado con Redux
- Comunicación con el backend a través de Axios
- Rutas protegidas para usuarios autenticados
- Formularios con validación

### Backend (Microservicios)

#### 1. API Gateway

El API Gateway actúa como punto de entrada único para todas las solicitudes de los clientes. Se encarga de:

- Enrutar las solicitudes al microservicio correspondiente
- Registrar las solicitudes para monitoreo
- Manejar la configuración CORS
- Proporcionar un manejo de errores unificado

#### 2. Servicio de Descubrimiento (Eureka Server)

El servicio de descubrimiento permite que los microservicios se registren automáticamente y puedan descubrirse entre sí. Proporciona:

- Registro automático de servicios
- Descubrimiento dinámico de servicios
- Balanceo de carga del lado del cliente
- Monitoreo de la salud de los servicios

#### 3. Microservicio de Usuarios (User Service)

Este microservicio gestiona todo lo relacionado con los usuarios:

- Registro y autenticación de usuarios
- Gestión de perfiles de usuario
- Roles y permisos
- Restablecimiento de contraseñas

#### 4. Microservicio de Productos (Product Service)

Este microservicio gestiona el catálogo de productos:

- CRUD de productos
- Categorías de productos
- Búsqueda y filtrado de productos
- Gestión de inventario

#### 5. Microservicio de Pedidos (Order Service)

Este microservicio gestiona los pedidos y el carrito de compras:

- Gestión del carrito de compras
- Procesamiento de pedidos
- Seguimiento de pedidos
- Historial de pedidos

#### 6. Microservicio de Notificaciones (Notification Service)

Este microservicio se encarga de enviar notificaciones a los usuarios:

- Envío de correos electrónicos
- Plantillas de correo electrónico
- Notificaciones de eventos del sistema

## Comunicación entre Microservicios

Los microservicios se comunican entre sí utilizando:

- Comunicación sincrónica mediante REST API
- Comunicación asincrónica mediante eventos (cuando sea necesario)
- Descubrimiento de servicios a través de Eureka

## Persistencia de Datos

Cada microservicio tiene su propia base de datos, siguiendo el patrón de "Base de Datos por Servicio":

- Microservicio de Usuarios: Base de datos de usuarios
- Microservicio de Productos: Base de datos de productos
- Microservicio de Pedidos: Base de datos de pedidos

## Seguridad

La seguridad del sistema se implementa en varios niveles:

- Autenticación basada en JWT
- Autorización basada en roles
- Validación de entrada en todos los endpoints
- Encriptación de contraseñas
- Protección contra ataques CSRF y XSS
- Rate limiting para prevenir ataques de fuerza bruta

## Documentación de la API

La documentación de la API se genera automáticamente utilizando OpenAPI (Swagger):

- Microservicio de Usuarios: http://localhost:8081/api/swagger-ui.html
- Microservicio de Productos: http://localhost:8082/api/swagger-ui.html
- Microservicio de Pedidos: http://localhost:8083/api/swagger-ui.html
- Microservicio de Notificaciones: http://localhost:8084/api/swagger-ui.html

## CI/CD

El sistema utiliza GitHub Actions para la integración continua y entrega continua:

- Construcción y pruebas automatizadas
- Análisis de calidad del código con SonarCloud
- Construcción de imágenes Docker
- Despliegue automatizado en el entorno de producción

## Tecnologías Utilizadas

### Backend

- **Lenguaje**: Java 17
- **Framework**: Spring Boot 3, Spring Security, Spring Data JPA
- **Base de Datos**: MySQL
- **API Gateway**: Spring Cloud Gateway
- **Descubrimiento de Servicios**: Netflix Eureka
- **Circuit Breakers**: Resilience4j
- **Notificaciones**: Spring Mail, Thymeleaf
- **Documentación API**: OpenAPI (Swagger)
- **Seguridad**: JWT (JSON Web Tokens)

### Frontend

- **Lenguaje**: JavaScript/TypeScript
- **Framework**: React
- **Gestión de Estado**: Redux Toolkit
- **Enrutamiento**: React Router
- **Comunicación HTTP**: Axios
- **Formularios**: Formik, Yup
- **Estilos**: Bootstrap, CSS Modules
- **Notificaciones**: React Toastify

## Diagrama de Arquitectura

```
┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│ API Gateway │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Eureka    │
                    │   Server    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┬───────────────┐
           │               │               │               │
    ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐
    │  Servicio  │  │  Servicio  │  │  Servicio  │  │  Servicio  │
    │ de Usuarios│  │de Productos│  │ de Pedidos │  │de Notific. │
    └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └────────────┘
           │               │               │
    ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐
    │    BD de   │  │    BD de   │  │    BD de   │
    │  Usuarios  │  │  Productos │  │   Pedidos  │
    └────────────┘  └────────────┘  └────────────┘
```

## Consideraciones de Seguridad

- Autenticación basada en JWT
- Comunicación segura mediante HTTPS
- Validación de entrada en todos los endpoints
- Manejo adecuado de excepciones y errores
- Principio de mínimo privilegio para acceso a recursos
- Protección contra ataques CSRF y XSS

## Escalabilidad

La arquitectura de microservicios permite escalar horizontalmente cada servicio de forma independiente según la demanda. El API Gateway y Eureka facilitan la distribución de la carga entre múltiples instancias de cada servicio.
