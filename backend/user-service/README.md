# Microservicio de Usuarios

Este microservicio gestiona todo lo relacionado con los usuarios, incluyendo registro, autenticación, perfiles y seguridad.

## Funcionalidades

- Registro de usuarios
- Autenticación mediante JWT
- Gestión de perfiles de usuario
- Restablecimiento de contraseñas
- Roles y permisos

## Estructura del Proyecto

```
user-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ecommerce/milicons/userservice/
│   │   │       ├── application/
│   │   │       │   ├── dto/
│   │   │       │   ├── exception/
│   │   │       │   ├── mapper/
│   │   │       │   └── service/
│   │   │       ├── domain/
│   │   │       │   ├── model/
│   │   │       │   └── repository/
│   │   │       └── infrastructure/
│   │   │           ├── config/
│   │   │           ├── exception/
│   │   │           ├── rest/
│   │   │           └── security/
│   │   └── resources/
│   └── test/
└── pom.xml
```

## Endpoints de la API

### Autenticación

- `POST /api/auth/register`: Registrar un nuevo usuario
- `POST /api/auth/login`: Iniciar sesión y obtener token JWT
- `POST /api/auth/refresh-token`: Renovar token JWT
- `POST /api/auth/forgot-password`: Solicitar restablecimiento de contraseña
- `POST /api/auth/reset-password`: Restablecer contraseña

### Usuarios

- `GET /api/users`: Obtener todos los usuarios (solo admin)
- `GET /api/users/{id}`: Obtener usuario por ID
- `GET /api/users/me`: Obtener perfil del usuario actual
- `PUT /api/users/{id}`: Actualizar usuario
- `DELETE /api/users/{id}`: Eliminar usuario (solo admin)

## Modelo de Datos

### User

```
id: UUID
name: String
email: String
password: String (encriptada)
role: Role (ROLE_USER, ROLE_ADMIN)
active: boolean
createdAt: LocalDateTime
updatedAt: LocalDateTime
```

## Configuración

Las principales propiedades de configuración se encuentran en `application.properties`:

```properties
# Puerto y contexto
server.port=8081
server.servlet.context-path=/api

# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_users
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=YourSecretKeyHere
jwt.expiration=86400000
jwt.refresh.expiration=604800000
```

## Pruebas

Para ejecutar las pruebas:

```bash
mvn test
```

Para ejecutar solo las pruebas E2E:

```bash
mvn test -Dtest=UserServiceE2ETest
```
