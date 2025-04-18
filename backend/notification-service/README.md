# Microservicio de Notificaciones

Este microservicio se encarga de enviar correos electrónicos y notificaciones a los usuarios.

## Funcionalidades

- Envío de correos electrónicos
- Plantillas de correo electrónico con Thymeleaf
- Notificaciones de eventos del sistema

## Estructura del Proyecto

```
notification-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ecommerce/milicons/notificationservice/
│   │   │       ├── application/
│   │   │       │   ├── dto/
│   │   │       │   ├── exception/
│   │   │       │   └── service/
│   │   │       ├── domain/
│   │   │       │   └── model/
│   │   │       └── infrastructure/
│   │   │           ├── config/
│   │   │           ├── exception/
│   │   │           └── rest/
│   │   └── resources/
│   │       └── templates/
│   │           ├── welcome.html
│   │           └── order-confirmation.html
│   └── test/
└── pom.xml
```

## Endpoints de la API

### Correos Electrónicos

- `POST /api/emails`: Enviar un correo electrónico

## Plantillas de Correo Electrónico

El servicio incluye las siguientes plantillas de correo electrónico:

1. **Bienvenida**: Enviada cuando un usuario se registra
2. **Confirmación de Pedido**: Enviada cuando un usuario realiza un pedido
3. **Envío de Pedido**: Enviada cuando un pedido es enviado
4. **Restablecimiento de Contraseña**: Enviada cuando un usuario solicita restablecer su contraseña

## Configuración

Las principales propiedades de configuración se encuentran en `application.properties`:

```properties
# Puerto y contexto
server.port=8084
server.servlet.context-path=/api

# Configuración de correo electrónico
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## Integración con Otros Servicios

El microservicio de notificaciones es utilizado por:

- **Microservicio de Usuarios**: Para enviar correos de bienvenida y restablecimiento de contraseña
- **Microservicio de Pedidos**: Para enviar confirmaciones de pedidos y actualizaciones de estado

## Pruebas

Para ejecutar las pruebas:

```bash
mvn test
```

## Despliegue con Docker

```bash
docker build -t notification-service .
docker run -p 8084:8084 notification-service
```

## Documentación de la API

La documentación de la API está disponible a través de Swagger UI:

http://localhost:8084/api/swagger-ui.html
