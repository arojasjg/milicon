# API Documentation

This document provides documentation for the MiliconStore API endpoints.

## Base URL

All API requests should be made to the following base URL:

```
http://localhost:8080/api
```

## Authentication

Most endpoints require authentication. Include an Authorization header with a valid JWT token:

```
Authorization: Bearer {your_token}
```

## Products API

### Get All Products

Retrieves a paginated list of products.

**URL**: `/products`

**Method**: `GET`

**Authentication**: Optional

**Query Parameters**:

- `page` (optional): Page number (0-based). Default: 0
- `size` (optional): Page size. Default: 20
- `sort` (optional): Sort field. Example: `name,asc` or `price,desc`
- `category` (optional): Filter by category ID
- `minPrice` (optional): Filter by minimum price
- `maxPrice` (optional): Filter by maximum price
- `search` (optional): Search term for product name or description

**Success Response**:

```json
{
  "content": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Professional Basketball",
      "description": "Official NBA basketball",
      "price": 59.99,
      "imageUrl": "http://example.com/images/basketball.jpg",
      "category": {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Basketball"
      },
      "stock": 50,
      "averageRating": 4.5
    },
    ...
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "orders": [
        {
          "direction": "ASC",
          "property": "name"
        }
      ]
    }
  },
  "totalElements": 150,
  "totalPages": 8,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "numberOfElements": 20,
  "empty": false
}
```

### Get Product by ID

Retrieves a specific product by ID.

**URL**: `/products/{id}`

**Method**: `GET`

**Authentication**: Optional

**URL Parameters**:

- `id`: The UUID of the product to retrieve

**Success Response**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Professional Basketball",
  "description": "Official NBA basketball",
  "price": 59.99,
  "imageUrl": "http://example.com/images/basketball.jpg",
  "category": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Basketball"
  },
  "stock": 50,
  "averageRating": 4.5
}
```

**Error Response**:

- **404 Not Found**: If the product doesn't exist

### Create Product

Creates a new product.

**URL**: `/products`

**Method**: `POST`

**Authentication**: Required (Admin only)

**Request Body**:

```json
{
  "name": "Professional Basketball",
  "description": "Official NBA basketball",
  "price": 59.99,
  "imageUrl": "http://example.com/images/basketball.jpg",
  "categoryId": "123e4567-e89b-12d3-a456-426614174001",
  "stock": 50
}
```

**Success Response**:

- **201 Created**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Professional Basketball",
  "description": "Official NBA basketball",
  "price": 59.99,
  "imageUrl": "http://example.com/images/basketball.jpg",
  "category": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Basketball"
  },
  "stock": 50,
  "averageRating": 0
}
```

**Error Response**:

- **400 Bad Request**: If the request body is invalid
- **401 Unauthorized**: If the user isn't authenticated
- **403 Forbidden**: If the user isn't an admin

### Update Product

Updates an existing product.

**URL**: `/products/{id}`

**Method**: `PUT`

**Authentication**: Required (Admin only)

**URL Parameters**:

- `id`: The UUID of the product to update

**Request Body**:

```json
{
  "name": "Professional Basketball - Updated",
  "description": "Official NBA basketball - New Edition",
  "price": 69.99,
  "imageUrl": "http://example.com/images/basketball_new.jpg",
  "categoryId": "123e4567-e89b-12d3-a456-426614174001",
  "stock": 45
}
```

**Success Response**:

- **200 OK**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Professional Basketball - Updated",
  "description": "Official NBA basketball - New Edition",
  "price": 69.99,
  "imageUrl": "http://example.com/images/basketball_new.jpg",
  "category": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Basketball"
  },
  "stock": 45,
  "averageRating": 4.5
}
```

**Error Response**:

- **400 Bad Request**: If the request body is invalid
- **401 Unauthorized**: If the user isn't authenticated
- **403 Forbidden**: If the user isn't an admin
- **404 Not Found**: If the product doesn't exist

### Delete Product

Deletes a product.

**URL**: `/products/{id}`

**Method**: `DELETE`

**Authentication**: Required (Admin only)

**URL Parameters**:

- `id`: The UUID of the product to delete

**Success Response**:

- **204 No Content**

**Error Response**:

- **401 Unauthorized**: If the user isn't authenticated
- **403 Forbidden**: If the user isn't an admin
- **404 Not Found**: If the product doesn't exist
