# Microservicio de Productos

Este microservicio gestiona el catálogo de productos, categorías y reseñas de productos.

## Funcionalidades

- CRUD de productos
- CRUD de categorías
- Búsqueda y filtrado de productos
- Gestión de reseñas de productos
- Control de inventario

## Estructura del Proyecto

```
product-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ecommerce/milicons/productservice/
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
│   │   │           └── rest/
│   │   └── resources/
│   └── test/
└── pom.xml
```

## Endpoints de la API

### Productos

- `GET /api/products`: Obtener todos los productos (paginados)
- `GET /api/products/{id}`: Obtener producto por ID
- `GET /api/products/search`: Buscar productos por nombre o descripción
- `GET /api/products/category/{categoryId}`: Obtener productos por categoría
- `POST /api/products`: Crear nuevo producto
- `PUT /api/products/{id}`: Actualizar producto
- `DELETE /api/products/{id}`: Eliminar producto
- `PUT /api/products/{id}/stock/reduce`: Reducir stock de un producto

### Categorías

- `GET /api/categories`: Obtener todas las categorías
- `GET /api/categories/{id}`: Obtener categoría por ID
- `POST /api/categories`: Crear nueva categoría
- `PUT /api/categories/{id}`: Actualizar categoría
- `DELETE /api/categories/{id}`: Eliminar categoría

### Reseñas

- `GET /api/products/{productId}/reviews`: Obtener reseñas de un producto
- `POST /api/products/{productId}/reviews`: Añadir reseña a un producto
- `PUT /api/products/{productId}/reviews/{reviewId}`: Actualizar reseña
- `DELETE /api/products/{productId}/reviews/{reviewId}`: Eliminar reseña

## Modelo de Datos

### Product

```
id: UUID
name: String
description: String
price: BigDecimal
stock: Integer
category: Category
imageUrl: String
active: boolean
createdAt: LocalDateTime
updatedAt: LocalDateTime
```

### Category

```
id: UUID
name: String
description: String
createdAt: LocalDateTime
updatedAt: LocalDateTime
```

### Review

```
id: UUID
productId: UUID
userId: UUID
rating: Integer
comment: String
createdAt: LocalDateTime
updatedAt: LocalDateTime
```

## Configuración

Las principales propiedades de configuración se encuentran en `application.properties`:

```properties
# Puerto y contexto
server.port=8082
server.servlet.context-path=/api

# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_products
spring.datasource.username=root
spring.datasource.password=root
```

## Pruebas

Para ejecutar las pruebas:

```bash
mvn test
```

Para ejecutar solo las pruebas E2E:

```bash
mvn test -Dtest=ProductServiceE2ETest
```
