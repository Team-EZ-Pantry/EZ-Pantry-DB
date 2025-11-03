# EZ Pantry Database and Backend API

## Table of Contents
- [EZ Pantry Features](#ez-pantry-features)
- [Quick Start](#fquick-start)
- [API Authentication 🔒](#api-authentication)
- [API Docs](#api-docs)
  - [Health Check](#health-check)
  - [Authentication Endpoints](#authentication-endpoints)
    - [Register](#register)
    - [Login](#login)
    - [Me](#me)
  - [Pantry Endpoints](#pantry-endpoints)
    - [Create Pantry](#create-pantry)
    - [Delete Pantry](#delete-pantry)
    - [Get All Pantries for a User](#get-all-pantries-for-a-user)
    - [Get Pantry](#get-pantry)
    - [Update Pantry Name](#update-pantry-name)
  - [Regular and Custom Product Endpoints](#regular-and-custom-products)
    - [Add Product to Pantry](#add-product-to-pantry)
    - [Remove Product from Pantry](#remove-product-from-pantry)
    - [Update Product Quantity](#update-product-quantity)
    - [Update Product Expiration Date](#update-product-expiration-date)
  - [Product Endpoints](#product-endpoints)
    - [Search Products](#search-products)
    - [Get Product by Barcode](#get-product-by-barcode)
    - [Create Custom Product](#create-custom-product)
    - [Get Custom Products](#get-custom-products)
    - [Delete Custom Product](#delete-custom-product)

## EZ Pantry Features

✅ Login \
✅ Register \
✅ Create, delete, modify pantries \
✅ Add and remove products, modify quantity and expiration \
✅ Product search with autocomplete \
✅ Custom products associated with a user \
✅ Create and save shopping lists \
✅ Barcode scanning \
*Shared custom product database * \
*Pantry/shopping list sharing between users* \
*LLM recipe generation + custom recipes + saving recipes*

## Quick Start

### Prerequisites
- Node.js
- Postgres
- Make sure you're up to date on any migrations (database/migrations)

### Installation
```bash
git clone https://github.com/Team-EZ-Pantry/EZ-Pantry-DB.git
cd EZ-Pantry-DB/server
npm install
```

### Environment Setup
Create an ".env" file inside the server folder. \
This allows nodejs to connect to our database with the (placeholder) credentials we created
```.env file
DB_USER=devuser
DB_PASSWORD=devpass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
APP_PORT=3000
JWT_SECRET=my-dev-secret-key-12345
```

### Starting the server
inside EZ-Pantry-DB/server/src, run ```node index.js```. (Press ctrl + C to stop the server) \
*Remember to have Postgres running on docker*

## API Docs

### Base URL
```
http://localhost:3000
```
## API Authentication
🔒 All endpoints require JWT authentication with the exception of Register and Login

USE THE HEADER: Authorization: Bearer {token} \
Example:
```
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "status": "unhealthy", 
  "error": "Database connection failed"
}
```

#### Status Codes
- `200` - Success
- `503` - Service Unavailable (database issues)

---

## Authentication Endpoints

### Register
**POST** `/api/auth/register`

Register a new user account in the database.

#### Request Body (this will be secured by HTTPS)
```json
{
  "username": "testuser",
  "email": "test@gmail.com",
  "password": "password123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Username (max 30 characters) |
| `email` | string | Yes | Valid email address (must be unique) |
| `password` | string | Yes | Minimum 6 characters |

#### Success Response
**Code:** `201 Created`

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@gmail.com",
    "createdAt": "2025-10-01T02:36:43.602Z"
  }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
  "error": "Username, email, and password are required"
}
```

**Code:** `400 Bad Request`
```json
{
  "error": "Invalid email format"
}
```

**Code:** `400 Bad Request`
```json
{
  "error": "Password must be at least 6 characters long"
}
```

**Code:** `409 Conflict`
```json
{
  "error": "User with this email already exists"
}
```

**Code:** `500 Internal Server Error`
```json
{
  "error": "An error occurred during registration"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | User successfully created |
| `400` | Bad request (validation failed) |
| `409` | Conflict (user already exists) |
| `500` | Internal server error |

---

### Login
**POST** `/api/auth/login`

Login with an email and password to receive a JWT.

#### Request Body (this will be secured by HTTPS)
```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```

| Field | Type | Required |
|-------|------|----------|
| `username` | string | Yes |
| `password` | string | Yes |

#### Success Response
**Code:** `200 OK`

```json
{
    "message": "Login successful",
    "user": {
        "username": "testman",
        "email": "test@gmail.com",
        "createdAt": "2025-10-07T02:40:01.450Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzU5Nzg2ODI0LCJleHAiOjE3NjIzNzg4MjR9.mhz59pSTL4ymrv5orx5FNuWqu6AxhFnP9n8jBlj0pfE"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Email and password are required"
}
```

**Code:** `401 Unauthorized` (When either email or password is missing)
```json
{
    "error": "Invalid email or password"
}
```

**Code:** `500 Internal Server Error`
```json
{
  "error": "An error occurred during login"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Login successful |
| `400` | Bad request (validation failed) |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### Me
**GET** `/api/auth/me`

Protected route - Get the current user's information.

#### Request Body 
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "message": "User data retrieved successfully",
    "user": {
        "user_id": 1,
        "username": "testman",
        "email": "test@gmail.com",
        "createdAt": "2025-10-07T02:40:01.450Z"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "User not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to fetch user data"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Get user info successful |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | User not found |
| `500` | Internal server error |

---

## Pantry Endpoints

### Create Pantry
**POST** `/api/pantry/`

Create a new pantry

#### Request Body 
```json
{
    "name" : "New Pantry"
}
```

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "message": "Pantry created successfully",
    "pantry": {
        "pantry_id": 11,
        "user_id": 1,
        "name": "New Pantry",
        "is_default": false,
        "created_at": "2025-10-15T21:05:10.431Z"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code** `400 Bad Request`
```json
{
    "error": "Pantry name is required"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to create pantry"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Pantry created successfully  |
| `400` | Invalid input (missing pantry name) |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Delete Pantry
**DELETE** `/api/pantry/:pantryid`

Delete a pantry by ID

*Delete the pantry with ID = 20:*
```
http://localhost:3000/api/pantry/20
```

#### Request Body 
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "message": "Pantry deleted successfully",
    "pantry": {
        "pantry_id": 11,
        "user_id": 1,
        "name": "New Pantry",
        "is_default": false,
        "created_at": "2025-10-15T21:05:10.431Z"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>



**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Pantry not found"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to delete pantry"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Pantry deleted successfully  |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry ID not found |
| `500` | Internal server error |

---

### Get All Pantries for a User
**GET** `/api/pantry`

Get all pantries for an authenticated user

#### Request Body 
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "message": "Pantries retrieved successfully",
    "pantries": [
        {
            "pantry_id": 12,
            "user_id": 1,
            "name": "New",
            "is_default": false,
            "created_at": "2025-10-16T01:04:55.437Z"
        },
        {
            "pantry_id": 6,
            "user_id": 1,
            "name": "Testy",
            "is_default": false,
            "created_at": "2025-10-13T02:59:57.153Z"
        }
    ]
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to retrieve pantries"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Pantries retrieved sucessfully  |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Get Pantry
**GET** `/api/pantry/:pantryid`

Get a specific pantry by ID

#### Request Body 
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "message": "Pantry retrieved successfully",
    "pantry": {
        "pantry_id": 13,
        "user_id": 2,
        "name": "New",
        "is_default": false,
        "created_at": "2025-10-16T01:22:09.581Z",
        "products": [
            {
                "product_id": 1,
                "product_name": "Natural Concord Grape Spread",
                "brand": "Welch's Concord",
                "barcode": "0123456789",
                "image_url": null,
                "calories_per_100g": null,
                "quantity": 3,
                "expiration_date": null
            }
        ]
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Pantry not found"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to retrieve pantry"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Pantry retrieved successfully  |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry not found |
| `500` | Internal server error |

### Update Pantry Name
**GET** `/api/pantry/:pantryid/name`

Get a specific pantry by ID

#### Request Body 
```json
{
    "name" : "My Pantry"
}
```

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "message": "Pantry name updated",
    "pantry": {
        "pantry_id": 13,
        "user_id": 2,
        "name": "My Pantry",
        "is_default": false,
        "created_at": "2025-10-16T01:22:09.581Z"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Name is required"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Bad Request`
```json
{
    "error": "Pantry not found"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to update pantry name"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Pantry name updated  |
| `401` | Name not provided |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry not found |
| `500` | Internal server error |

---

## Regular and Custom Products
Regular and custom product functionality is identical. Simply substitute **`custom-products`** for `products` in the API URL, e.g.:
```/api/pantry/:pantryid/custom-products/:productId```

### Add Product to Pantry
**POST** `/api/pantry/:pantryid/products/:productId`

Add a product to a users's pantry.

#### Request Body
```json
{
    "quantity": 3,
    "expirationDate": "2026-10-10"
}
```

| Field              | Type   | Required | Description                              |
|--------------------|--------|----------|------------------------------------------|
| `quantity`         | number | Yes      | Number of products to add                |
| `expirationDate`   | date   | No       | Expiration date of the product           |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "message": "Product added to pantry",
    "product": {
        "pantry_id": 13,
        "product_id": null,
        "custom_product_id": 2,
        "quantity": 3,
        "expiration_date": "2026-10-10T00:00:00.000Z"
    }
}
```

#### Error Responses
<details>
<summary>Click to view all error codes</summary>

**Code** `400 Bad Request`
```json
{
    "error": "Provide either productId or customProductId, not both"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Quantity must be greater than 0"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Pantry not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to add product to pantry"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Product added successfully |
| `400` | Invalid input |
| `401` | No token or invalid token |
| `404` | Pantry not found |
| `500` | Internal server error |

---

### Remove Product from Pantry
**DELETE** `/api/pantry/:pantryid/products/:productid`

Remove a given product from a given pantry

#### Request Body 
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "message": "Product removed from pantry",
    "product": {
        "pantry_id": 13,
        "product_id": 1,
        "quantity": 3,
        "expiration_date": "2026-10-10T05:00:00.000Z"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Pantry not found"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Product not found in pantry"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to remove product from pantry"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Product deleted successfully  |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry not found |
| `404` | Product not found in pantry |
| `500` | Internal server error |

---

### Update Product Quantity
**PUT** `/api/pantry/:pantryid/products/:productid/quantity`

Update the quantity of a product in a pantry. (quantity <= 0 does not delete)

#### Request Body
```json
{
    "quantity" : "3"
}
```

| Field | Type | Required |
|-------|------|----------|
| `quantity` | number | Yes |


#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "message": "Product quantity updated",
    "product": {
        "pantry_id": 13,
        "product_id": 1,
        "quantity": 9,
        "expiration_date": null
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Quantity is required"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Pantry not found"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Product not found in pantry"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to update product quantity"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Product quantity updated  |
| `400` | Quantity not provided |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry not found |
| `404` | Product not found in pantry |
| `500` | Internal server error |

---

### Update Product Expiration Date
**PUT** `/api/pantry/:pantryid/products/:productid/expiration`

Update the expiration date of a product in a pantry

#### Request Body
```json
{
    "expirationDate" : "11-11-2067"
}
```

| Field | Type | Required |
|-------|------|----------|
| `expirationDate` | date | Yes |


#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "message": "Product expiration date updated",
    "product": {
        "pantry_id": 13,
        "product_id": 1,
        "quantity": 9,
        "expiration_date": "2067-11-11T06:00:00.000Z"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Expiration date is required"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Pantry not found"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Product not found in pantry"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to update product quantity"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Expiration date updated sucessfully  |
| `400` | Expiration date not provided |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry not found |
| `404` | Product not found in pantry |
| `500` | Internal server error |

---

## Product Endpoints

### Search Products
**GET** `/api/products/search?q=milk&limit=10`

Search for products by name with partial search (autocomplete) functionality.

#### Query Parameters
| Parameter | Type   | Required |Description                          |
|-----------|--------|----------|--------------------------------------|
| `q`       | string | Yes      | Search query (minimum 2 characters) |
| `limit`   | number | No       | Maximum number of results (default: 10) |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "query": "milk",
    "count": 2,
    "products": [
        {
            "product_id": 1,
            "product_name": "Milk",
            "brand": "Brand A",
            "barcode": "123456789",
            "image_url": null,
            "calories_per_100g": 42
        },
        {
            "product_id": 2,
            "product_name": "Almond Milk",
            "brand": "Brand B",
            "barcode": "987654321",
            "image_url": null,
            "calories_per_100g": 30
        
    ]
}
```

#### Error Responses
<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Search query is required"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to search products"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Products retrieved successfully |
| `400` | Missing or invalid query parameter |
| `500` | Internal server error |

---

### Get Product by Barcode
**GET** `/api/products/barcode/:barcode`

Retrieve product details by barcode.

#### Request Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `barcode` | string | Yes      | Barcode of the product |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "product": {
        "product_id": 1,
        "product_name": "Milk",
        "brand": "Brand A",
        "barcode": "123456789",
        "image_url": null,
        "calories_per_100g": 42
    }
}
```

#### Error Responses
<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Product not found",
    "barcode": "123456789"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to fetch product"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Product retrieved successfully |
| `401` | No token |
| `403` | Invalid token |
| `404` | Product not found |
| `500` | Internal server error |

---

### Create Custom Product
**POST** `/api/products/custom`

Create a new custom product associated with the authenticated user.

#### Request Body
```json
{
    "product_name": "Custom Product Name",
    "brand": "Custom Brand",
    "image_url": "http://example.com/image.jpg",
    "categories": ["Category1", "Category2"],
    "allergens": ["Allergen1", "Allergen2"],
    "calories_per_100g": 100,
    "protein_per_100g": 5,
    "carbs_per_100g": 20,
    "fat_per_100g": 2,
    "nutrition": {
        "fiber": 3,
        "sugar": 10
    }
}
```

| Field                | Type     | Required | Description                          |
|----------------------|----------|----------|--------------------------------------|
| `product_name`       | string   | Yes      | Name of the custom product           |
| `brand`              | string   | No       | Brand of the custom product          |
| `image_url`          | string   | No       | URL of the product image             |
| `categories`         | array    | No       | Categories associated with the product |
| `allergens`          | array    | No       | Allergens associated with the product |
| `calories_per_100g`  | number   | No       | Calories per 100g                    |
| `protein_per_100g`   | number   | No       | Protein per 100g                     |
| `carbs_per_100g`     | number   | No       | Carbohydrates per 100g               |
| `fat_per_100g`       | number   | No       | Fat per 100g                         |
| `nutrition`          | object   | No       | Additional nutritional information   |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`
```json
{
    "customProduct": {
        "custom_product_id": 1,
        "user_id": 1,
        "product_name": "Custom Product Name",
        "brand": "Custom Brand",
        "image_url": "http://example.com/image.jpg",
        "categories": ["Category1", "Category2"],
        "allergens": ["Allergen1", "Allergen2"],
        "calories_per_100g": 100,
        "protein_per_100g": 5,
        "carbs_per_100g": 20,
        "fat_per_100g": 2,
        "nutrition": {
            "fiber": 3,
            "sugar": 10
        },
        "created_at": "2023-10-10T10:00:00.000Z"
    }
}
```

#### Error Responses
<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Product name is required"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to create custom product"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Custom product created successfully |
| `400` | Invalid input (e.g., missing product name) |
| `401` | No token |
| `403` | Invalid token |
| `500` | Internal server error |

---

### Get Custom Products
**GET** `/api/products/custom`

Get all custom products owned by the authenticated user and their pantry locations 

#### Request Body
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "customProducts": [
        {
            "custom_product_id": 6,
            "product_name": "Another custom",
            "brand": "Test Brand",
            ...
            "fat_per_100g": null,
            "last_modified": "2025-10-31T22:44:24.785Z"
            "pantry_locations": [
                {
                    "pantry_id": 14,
                    "pantry_name": "Another Pantry",
                    "quantity": 1,
                    "expiration_date": null
                }
            ]
        }
    ]
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to fetch custom products"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Custom product data retrieved successfully|
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Delete Custom Product
**DELETE** `/api/products/custom/:customProductId`

Permanently delete a custom product associated with a user

#### Request Body
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "message": "Custom product deleted",
    "deletedCustomProduct": {
        "custom_product_id": 6,
        "user_id": 2,
        "product_name": "My Custom Product",
        ...
        "nutrition": null,
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided"
}
```

**Code:** `403 Forbidden`
```json
{
    "error": "Invalid or expired token"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Custom product not found"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to delete custom product"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Custom product deleted |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Custom Product not found |
| `500` | Internal server error |