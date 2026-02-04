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
  - [User Endpoints](#user-endpoints)
    - [Get User](#get-user)
    - [Update Username](#update-username)
    - [Update Password](#update-password)
    - [Delete User](#delete-user)
  - [Pantry Endpoints](#pantry-endpoints)
    - [Create Pantry](#create-pantry)
    - [Get All Pantries for a User](#get-all-pantries-for-a-user)
    - [Get Pantry](#get-pantry)
    - [Update Pantry Name](#update-pantry-name)
    - [Update Pantry Last Visited Timestamp](#update-pantry-last-visited-timestamp)
    - [Delete Pantry](#delete-pantry)
  - [Regular and Custom Pantry Product Endpoints](#regular-and-custom-products)
    - [Add Product to Pantry](#add-product-to-pantry)
    - [Remove Product from Pantry](#remove-product-from-pantry)
    - [Update Product Quantity](#update-product-quantity)
    - [Update Product Expiration Date](#update-product-expiration-date)
  - [Product Endpoints](#product-endpoints)
    - [Search Products](#search-products)
    - [Get Product by Barcode](#get-product-by-barcode)
    - [Create Custom Product](#create-custom-product)
    - [Get Custom Products](#get-custom-products)
    - [Modify Custom Product](#modify-custom-product)
    - [Delete Custom Product](#delete-custom-product)
  - [Shopping List Endpoints](#shopping-list-endpoints)
    - [Create Shopping List](#create-shopping-list)
    - [Get all Shopping Lists](#get-all-shopping-lists)
    - [Get Shopping List](#get-shopping-list)
    - [Delete Shopping List](#delete-shopping-list)
    - [Create and Add Item to Shopping List](#create-and-add-item-to-shopping-list)
    - [Remove Item from Shopping List](#remove-item-from-shopping-list)
    - [Toggle Item Checked Status](#toggle-item-checked-status)
  - [Recipe Endpoints](#recipe-endpoints)
    - [Create Recipe](#create-recipe)
    - [Get All Recipes](#get-all-recipes)
    - [Get Recipe](#get-recipe)
    - [Update Recipe](#update-recipe)
    - [Delete Recipe](#delete-recipe)
    - [Add Ingredient](#add-ingredient)
    - [Update Ingredient](#update-ingredient)
    - [Remove Ingredient](#remove-ingredient)
    - [Add Instruction](#add-instruction)
    - [Update Instruction](#update-instruction)
    - [Remove Instruction](#remove-instruction)
    - [Reorder Instructions](#reorder-instructions)
    - [Check Ingredient Availability](#check-ingredient-availability)

## EZ Pantry Features

✅ Login \
✅ Register \
✅ Create, delete, modify pantries \
✅ Add and remove products, modify quantity and expiration \
✅ Product search with autocomplete \
✅ Custom products associated with a user \
✅ Create and save shopping lists \
✅ Barcode scanning \
✅ Recipe management (create, update, delete recipes with ingredients and instructions) \
✅ Ingredient availability checking across pantries \
✅ Recipe serving scaling \
*Product categorization* \
*Shared custom product database* \
*pantries/shopping list sharing between users* \
*LLM recipe generation*

## Quick Start

### Prerequisites
- Node.js
- Postgres
- Make sure you're up to date on any migrations (database/migrations)

### Installation
```bash
git clone https://github.com/Team-EZ-pantries/EZ-Pantry-DB.git
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

Authenication verifies if the JWT is valid and if the account exists
```json
{
    "error": "Account no longer exists"
}
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

Register a new user account in the database. Returns a token.

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
        "userId": 18,
        "username": "Another user",
        "email": "test@hotmail.com",
        "createdAt": "2025-12-02T13:00:52.627Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJlbWFpbCI6InRlc3RAaG90bWFpbC5jb20iLCJpYXQiOjE3NjQ2NTg4NTIsImV4cCI6MTc2NzI1MDg1Mn0.wttXBYZLVQ63XR5VXWCzxGVUnvxdj1WAzf1G-f9tD5Y"
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

**Code:** `401 Unauthorized`
```json
{
    "error": "No account found with this email"
}
```

**Code:** `401 Unauthorized`
```json
{
    "error": "Incorrect password"
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

## User Endpoints

### Get User
**GET** `/api/users/me`

Get the current user's information.

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
    "user": {
        "user_id": 4,
        "username": "New username again",
        "email": "testing@hotmail.com",
        "created_at": "2025-11-07T02:39:32.058Z"
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

### Update Username
**PATCH** `/api/users/username`

Update the current user's username.

#### Request Body 
```json
{
    "username": "New Username"
}
```

| Field | Type | Required |
|-------|------|----------|
| `username` | string | Yes |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "user": {
        "user_id": 4,
        "username": "Test",
        "email": "testing@hotmail.com"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Username is required"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Username may contain letters, numbers, spaces, periods, apostrophes, underscores, and hyphens"
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
    "error": "User not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to update username"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Updated username sucessfully |
| `400` | No username provided |
| `400` | Username format is invalid |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | User not found |
| `500` | Internal server error |

---

### Update Password
**PATCH** `/api/users/password`

Update the current user's password. Current and new password required.

#### Request Body 
```json
{
    "password" : "password123",
    "newPassword" : "password1234"
}
```

| Field | Type | Required |
|-------|------|----------|
| `password` | string | Yes |
| `newPassword` | string | Yes |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`
```json
{
    "message": "Password updated successfully",
    "user": {
        "user_id": 2,
        "username": "New Username",
        "email": "test@gmail.com"
    }
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Current and new password are required"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Password must be at least 6 characters long"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "New password must be different from the old password"
}
```

**Code:** `400 Unauthorized`
```json
{
    "error": "Current password is incorrect"
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
    "error": "User not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to update password"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Updated password sucessfully |
| `400` | Current and new password required |
| `400` | Must be at least 6 characters |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | User not found |
| `500` | Internal server error |

---

### Delete User
**DELETE** `/api/users/me`

Delete the current user. Password required.

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
    "message": "User deleted successfully"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `401 Unauthorized`
```json
{
    "error": "Password is incorrect"
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
    "error": "User not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to delete user"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Delete user successful |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | User not found |
| `500` | Internal server error |

---

## Pantry Endpoints

### Create Pantry
**POST** `/api/pantries/`

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

### Get All Pantries for a User
**GET** `/api/pantries`

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
**GET** `/api/pantries/:pantryid?sort=name_asc`

Get a specific pantry by ID. Pantry contents can be sorted by by name and date and filtered by category*. Sorting can be done for the entire pantry or within categories*.

*coming soon
#### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `sort`    | String | No       | Sort products by:<br>- `name_asc`: Product name ascending (default)<br>- `name_desc`: Product name descending<br>- `date_asc`: Date added ascending (oldest first)<br>- `date_desc`: Date added descending (newest first) |
| `category`| String | No       | Coming soon |


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
    "pantry": {
        "pantry_id": 17,
        "user_id": 4,
        "name": "pantry",
        "is_default": false,
        "created_at": "2025-11-07T02:41:17.481Z",
        "products": [
            {
                "id": 9,
                "product_type": "custom_product",
                "product_name": "Farmer's Market Grape Jelly",
                "brand": null,
                "image_url": null,
                "categories": null,
                "allergens": null,
                "calories_per_100g": null,
                "quantity": 6,
                "expiration_date": null,
                "added_at": "2025-11-11T04:33:41.318Z"
            },
            {
                "id": 1,
                "product_type": "product",
                "product_name": "Natural Concord Grape Spread",
                "brand": "Welch's Concord",
                "image_url": null,
                "categories": [],
                "allergens": [],
                "calories_per_100g": null,
                "quantity": 1,
                "expiration_date": null,
                "added_at": "2025-11-07T08:30:41.620Z"
            }
        ]
    },
    "appliedFilters": {
        "sort": "name_asc",
        "category": null
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
**GET** `/api/pantries/:pantryid/name`

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

### Update Pantry Last Visited Timestamp
**PATCH** `/api/pantries/:pantryid/last-visited`

Update the last visited timestamp of a pantry to the current time. To be called whenever a user opens a pantry.

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
    "message": "Pantry last visited timestamp updated",
    "pantry": {
        "last_visited": "2026-01-22T04:07:26.058Z"
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

**Code:** `404 Bad Request`
```json
{
    "error": "Pantry not found"
}
```

**Code** `500 Internal Server Error`
```json
{
    "error": "Failed to update pantry last visited timestamp"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Pantry timestamp updated  |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Pantry not found |
| `500` | Internal server error |

---

### Delete Pantry
**DELETE** `/api/pantries/:pantryid`

Delete a pantry by ID

*Delete the pantry with ID = 20:*
```
http://localhost:3000/api/pantries/20
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

## Regular and Custom Pantry Product Endpoints
Regular and custom product functionality is identical. Simply substitute **`custom-products`** for `products` in the API URL, e.g.:
```/api/pantries/:pantryid/custom-products/:productId```

### Add Product to Pantry
**POST** `/api/pantries/:pantryid/products/:productId`

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
**DELETE** `/api/pantries/:pantryid/products/:productid`

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
**PATCH** `/api/pantries/:pantryid/products/:productid/quantity`

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
**PATCH** `/api/pantries/:pantryid/products/:productid/expiration`

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
User's Custom products included in search.

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
    "query": "gra",
    "count": 2,
    "products": [
        {
            "id": 9,
            "product_type": "custom_product",
            "product_name": "Farmer's Market Grape Jelly",
            "brand": null,
            "image_url": null,
            "barcode": null,
            "categories": [],
            "allergens": [],
            "calories_per_100g": null
        },
        {
            "id": 1,
            "product_type": "product",
            "product_name": "Natural Concord Grape Spread",
            "brand": "Welch's Concord",
            "image_url": null,
            "barcode": "0123456789",
            "categories": [],
            "allergens": [],
            "calories_per_100g": null
        }
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

---

### Create Shopping List
**POST** `/api/shopping-lists`

Create a new shopping list for the authenticated user.

#### Request Body 
```json
{
    "name": "Weekly Groceries"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Name of the shopping list |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "list_id": 3,
    "user_id": 1,
    "name": "Weekly Groceries",
    "created_at": "2025-11-07T10:30:00.000Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Shopping list name is required"
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
    "error": "Failed to create shopping list"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Shopping list created successfully |
| `400` | Invalid input (missing name) |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Get all Shopping Lists
**GET** `/api/shopping-lists`

Get all shopping lists for the authenticated user.

#### Request Body 
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
[
    {
        "list_id": 1,
        "user_id": 1,
        "name": "Weekly Groceries",
        "created_at": "2025-11-01T10:00:00.000Z",
        "items": [
            {
                "item_id": 1,
                "product_id": 5,
                "product_name": "Milk",
                "brand": "Dairy Farm",
                "quantity": 2,
                "is_checked": false
            },
            {
                "item_id": 2,
                "product_id": 10,
                "product_name": "Bread",
                "brand": "Bakery Fresh",
                "quantity": 1,
                "is_checked": true
            }
        ]
    },
    {
        "list_id": 2,
        "user_id": 1,
        "name": "Party Supplies",
        "created_at": "2025-11-05T14:30:00.000Z",
        "items": []
    }
]
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

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to retrieve shopping lists"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Shopping lists retrieved successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Get Shopping List
**GET** `/api/shopping-lists/:listId`

Get a specific shopping list by ID with all its items.

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
    "list_id": 1,
    "user_id": 1,
    "name": "Weekly Groceries",
    "created_at": "2025-11-01T10:00:00.000Z",
    "items": [
        {
            "item_id": 1,
            "product_id": 5,
            "product_name": "Milk",
            "brand": "Dairy Farm",
            "image_url": null,
            "quantity": 2,
            "is_checked": false
        },
        {
            "item_id": 2,
            "product_id": 10,
            "product_name": "Bread",
            "brand": "Bakery Fresh",
            "image_url": null,
            "quantity": 1,
            "is_checked": true
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

**Code:** `404 Not Found`
```json
{
    "error": "Shopping list not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to retrieve shopping list"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Shopping list retrieved successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Shopping list not found |
| `500` | Internal server error |

---

### Delete Shopping List
**DELETE** `/api/shopping-lists/:listId`

Delete a shopping list by ID. This also deletes all associated items.

*Delete the shopping list with ID = 3:*
```
http://localhost:3000/api/shopping-lists/3
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
    "message": "Shopping list deleted successfully"
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
    "error": "Shopping list not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to delete shopping list"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Shopping list deleted successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Shopping list not found |
| `500` | Internal server error |

---

### Create and Add Item to Shopping List
**POST** `/api/shopping-lists/:listId`

Create and add an item, deliniated by a product, custom product, and/or some custom text to a shopping list. Quantity can be specified.

#### Request Body
```json
{
    "productId": 555,
    "text": "Bunch of milk"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | number | Conditional* | ID of the product to add |
| `customProductId` | number | Conditional* | ID of the custom product to add |
| `text` | String | Conditional* | ID of the custom product to add |
| `quantity` | number | No | Quantity of the product |

**Note*: Must provide one of: `productId`, `customProductId`, or `text`. You can optionally combine `text` with either `productId` or `customProductId` to add a note to an item.

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "item_id": 4,
    "list_id": 1,
    "product_id": 555,
    "custom_product_id": null,
    "text": "Bunch of milk",
    "quantity": null,
    "checked": false,
    "created_at": "2025-11-08T04:15:03.572Z",
    "updated_at": "2025-11-08T04:15:03.572Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Product ID and quantity are required"
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
    "error": "Shopping list not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to add item to shopping list"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Item added successfully |
| `400` | Invalid input (missing productId or quantity) |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Shopping list not found |
| `500` | Internal server error |

---

### Remove Item from Shopping List
**DELETE** `/api/shopping-lists/:listId/items/:itemId`

Remove a specific item from a shopping list.

*Remove item with ID = 5 from list with ID = 1:*
```
http://localhost:3000/api/shopping-lists/1/items/5
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
    "message": "Item removed from shopping list successfully"
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
    "error": "Item not found in shopping list"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to remove item from shopping list"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Item removed successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Item not found in shopping list |
| `500` | Internal server error |

---

### Toggle Item Checked Status
**PATCH** `/api/shopping-lists/:listId/items/:itemId`

Toggle the checked/unchecked status of an item in a shopping list.

*Toggle item with ID = 5 in list with ID = 1:*
```
http://localhost:3000/api/shopping-lists/1/items/5
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
    "item_id": 5,
    "list_id": 1,
    "product_id": 5,
    "quantity": 2,
    "is_checked": true,
    "added_at": "2025-11-07T12:00:00.000Z"
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
    "error": "Item not found in shopping list"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to toggle item checked status"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Item status toggled successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Item not found in shopping list |
| `500` | Internal server error |

---

## Recipe Endpoints

### Create Recipe
**POST** `/api/recipes`

Create a new recipe with ingredients and instructions.

#### Request Body
```json
{
    "recipe_name": "Chocolate Chip Cookies",
    "servings": 24,
    "prep_time_minutes": 15,
    "cook_time_minutes": 12,
    "image_url": "https://example.com/cookies.jpg",
    "ingredients": [
        {
            "product_id": 123,
            "quantity": 2,
            "unit": "cups",
            "display_order": 0
        },
        {
            "custom_product_id": 5,
            "quantity": 1,
            "unit": "cup",
            "display_order": 1
        },
        {
            "free_text": "A pinch of salt",
            "display_order": 2
        }
    ],
    "instructions": [
        {
            "content": "Preheat oven to 375°F",
            "step_number": 1,
            "metadata": {}
        },
        {
            "content": "Mix dry ingredients in a large bowl",
            "step_number": 2
        }
    ]
}
```

| Field                | Type     | Required | Description                                    |
|----------------------|----------|----------|------------------------------------------------|
| `recipe_name`        | string   | Yes      | Name of the recipe                             |
| `servings`           | number   | No       | Number of servings (default: 1)                |
| `prep_time_minutes`  | number   | No       | Preparation time in minutes                    |
| `cook_time_minutes`  | number   | No       | Cooking time in minutes                        |
| `image_url`          | string   | No       | URL to recipe image                            |
| `ingredients`        | array    | No       | Array of ingredient objects                    |
| `instructions`       | array    | No       | Array of instruction objects                   |

**Ingredient Object Fields:**
- Must provide one of: `product_id`, `custom_product_id`, or `free_text`
- Cannot provide both `product_id` and `custom_product_id`
- `quantity` (number, optional): Ingredient quantity
- `unit` (string, optional): Unit of measurement
- `display_order` (number, optional): Order for display (auto-assigned if omitted)

**Instruction Object Fields:**
- `content` (string, required): Instruction text
- `step_number` (number, optional): Step number (auto-assigned if omitted)
- `metadata` (object, optional): Additional metadata as JSON

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "recipe_id": 1,
    "user_id": 4,
    "recipe_name": "Chocolate Chip Cookies",
    "servings": 24,
    "prep_time_minutes": 15,
    "cook_time_minutes": 12,
    "image_url": "https://example.com/cookies.jpg",
    "created_at": "2026-02-04T10:00:00.000Z",
    "updated_at": "2026-02-04T10:00:00.000Z",
    "ingredients": [
        {
            "ingredient_id": 1,
            "recipe_id": 1,
            "product_id": 123,
            "custom_product_id": null,
            "free_text": null,
            "quantity": 2,
            "unit": "cups",
            "display_order": 0
        }
    ],
    "instructions": [
        {
            "instruction_id": 1,
            "recipe_id": 1,
            "step_number": 1,
            "content": "Preheat oven to 375°F",
            "metadata": {}
        }
    ]
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "recipe_name is required"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Cannot provide both product_id and custom_product_id for an ingredient"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Each ingredient must have product_id, custom_product_id, or free_text"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Each instruction must have content"
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
    "error": "Referenced product ID does not exist"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to create recipe"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Recipe created successfully |
| `400` | Invalid input |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Referenced product not found |
| `500` | Internal server error |

---

### Get All Recipes
**GET** `/api/recipes`

Get all recipes for the authenticated user.

#### Request Body
None

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
[
    {
        "recipe_id": 1,
        "user_id": 4,
        "recipe_name": "Chocolate Chip Cookies",
        "servings": 24,
        "prep_time_minutes": 15,
        "cook_time_minutes": 12,
        "image_url": "https://example.com/cookies.jpg",
        "created_at": "2026-02-04T10:00:00.000Z",
        "updated_at": "2026-02-04T10:00:00.000Z"
    },
    {
        "recipe_id": 2,
        "user_id": 4,
        "recipe_name": "Pasta Carbonara",
        "servings": 4,
        "prep_time_minutes": 10,
        "cook_time_minutes": 20,
        "image_url": null,
        "created_at": "2026-02-03T14:30:00.000Z",
        "updated_at": "2026-02-03T14:30:00.000Z"
    }
]
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

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to retrieve recipes"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Recipes retrieved successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Get Recipe
**GET** `/api/recipes/:recipeId?scale=4`

Get a specific recipe with ingredients and instructions. Optionally scale ingredient quantities for a different number of servings.

#### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `scale`   | number | No       | Number of servings to scale to. Ingredient quantities will be adjusted proportionally. |

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
    "recipe_id": 1,
    "user_id": 4,
    "recipe_name": "Chocolate Chip Cookies",
    "servings": 24,
    "prep_time_minutes": 15,
    "cook_time_minutes": 12,
    "image_url": "https://example.com/cookies.jpg",
    "created_at": "2026-02-04T10:00:00.000Z",
    "updated_at": "2026-02-04T10:00:00.000Z",
    "scaled_servings": 4,
    "ingredients": [
        {
            "ingredient_id": 1,
            "product_id": 123,
            "custom_product_id": null,
            "free_text": null,
            "quantity": 2,
            "scaled_quantity": 0.33,
            "unit": "cups",
            "display_order": 0,
            "product_name": "All-Purpose Flour"
        },
        {
            "ingredient_id": 2,
            "product_id": null,
            "custom_product_id": null,
            "free_text": "A pinch of salt",
            "quantity": null,
            "scaled_quantity": null,
            "unit": null,
            "display_order": 1,
            "product_name": null
        }
    ],
    "instructions": [
        {
            "instruction_id": 1,
            "recipe_id": 1,
            "step_number": 1,
            "content": "Preheat oven to 375°F",
            "metadata": {},
            "created_at": "2026-02-04T10:00:00.000Z"
        },
        {
            "instruction_id": 2,
            "recipe_id": 1,
            "step_number": 2,
            "content": "Mix dry ingredients in a large bowl",
            "metadata": {},
            "created_at": "2026-02-04T10:00:00.000Z"
        }
    ]
}
```

**Note:** When `scale` parameter is provided, the response includes `scaled_servings` and `scaled_quantity` for each ingredient.

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
    "error": "Recipe not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to retrieve recipe"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Recipe retrieved successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Recipe not found |
| `500` | Internal server error |

---

### Update Recipe
**PATCH** `/api/recipes/:recipeId`

Update recipe metadata (name, servings, prep/cook times, image). Does not modify ingredients or instructions.

#### Request Body
```json
{
    "recipe_name": "Updated Recipe Name",
    "servings": 12,
    "prep_time_minutes": 20,
    "cook_time_minutes": 15,
    "image_url": "https://example.com/new-image.jpg"
}
```

| Field                | Type   | Required | Description                     |
|----------------------|--------|----------|---------------------------------|
| `recipe_name`        | string | No       | Updated recipe name             |
| `servings`           | number | No       | Updated serving count           |
| `prep_time_minutes`  | number | No       | Updated prep time               |
| `cook_time_minutes`  | number | No       | Updated cook time               |
| `image_url`          | string | No       | Updated image URL               |

**Note:** Only provide fields you want to update. At least one field must be provided.

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "recipe_id": 1,
    "user_id": 4,
    "recipe_name": "Updated Recipe Name",
    "servings": 12,
    "prep_time_minutes": 20,
    "cook_time_minutes": 15,
    "image_url": "https://example.com/new-image.jpg",
    "created_at": "2026-02-04T10:00:00.000Z",
    "updated_at": "2026-02-04T11:30:00.000Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "No valid fields to update"
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
    "error": "Recipe not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to update recipe"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Recipe updated successfully |
| `400` | No valid fields provided |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Recipe not found |
| `500` | Internal server error |

---

### Delete Recipe
**DELETE** `/api/recipes/:recipeId`

Delete a recipe. This also deletes all associated ingredients and instructions.

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
    "message": "Recipe deleted successfully"
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
    "error": "Recipe not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to delete recipe"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Recipe deleted successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Recipe not found |
| `500` | Internal server error |

---

### Add Ingredient
**POST** `/api/recipes/:recipeId/ingredients`

Add an ingredient to a recipe.

#### Request Body
```json
{
    "product_id": 123,
    "quantity": 2,
    "unit": "cups",
    "display_order": 5
}
```

**OR**

```json
{
    "custom_product_id": 5,
    "quantity": 1,
    "unit": "tablespoon"
}
```

**OR**

```json
{
    "free_text": "A pinch of salt"
}
```

| Field               | Type   | Required     | Description                                               |
|---------------------|--------|--------------|-----------------------------------------------------------|
| `product_id`        | number | Conditional* | ID of standard product                                    |
| `custom_product_id` | number | Conditional* | ID of custom product                                      |
| `free_text`         | string | Conditional* | Free text ingredient description                          |
| `quantity`          | number | No           | Ingredient quantity                                       |
| `unit`              | string | No           | Unit of measurement                                       |
| `display_order`     | number | No           | Display order (defaults to end of list if not provided)   |

**Note*:** Must provide one of: `product_id`, `custom_product_id`, or `free_text`. Cannot provide both `product_id` and `custom_product_id`.

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "ingredient_id": 10,
    "recipe_id": 1,
    "product_id": 123,
    "custom_product_id": null,
    "free_text": null,
    "quantity": 2,
    "unit": "cups",
    "display_order": 5,
    "created_at": "2026-02-04T12:00:00.000Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Cannot provide both product_id and custom_product_id"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Must provide product_id, custom_product_id, or free_text"
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
    "error": "Referenced product ID does not exist"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to add ingredient"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Ingredient added successfully |
| `400` | Invalid input |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Product not found |
| `500` | Internal server error |

---

### Update Ingredient
**PATCH** `/api/recipes/:recipeId/ingredients/:ingredientId`

Update an existing ingredient in a recipe.

#### Request Body
```json
{
    "quantity": 3,
    "unit": "tablespoons",
    "display_order": 2
}
```

| Field               | Type   | Required | Description                     |
|---------------------|--------|----------|---------------------------------|
| `product_id`        | number | No       | Updated product ID              |
| `custom_product_id` | number | No       | Updated custom product ID       |
| `free_text`         | string | No       | Updated free text               |
| `quantity`          | number | No       | Updated quantity                |
| `unit`              | string | No       | Updated unit                    |
| `display_order`     | number | No       | Updated display order           |

**Note:** Only provide fields you want to update. Cannot provide both `product_id` and `custom_product_id`.

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "ingredient_id": 10,
    "recipe_id": 1,
    "product_id": 123,
    "custom_product_id": null,
    "free_text": null,
    "quantity": 3,
    "unit": "tablespoons",
    "display_order": 2,
    "created_at": "2026-02-04T12:00:00.000Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Cannot provide both product_id and custom_product_id"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "No valid fields to update"
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
    "error": "Ingredient not found"
}
```

**Code:** `404 Not Found`
```json
{
    "error": "Referenced product ID does not exist"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to update ingredient"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Ingredient updated successfully |
| `400` | Invalid input |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Ingredient or product not found |
| `500` | Internal server error |

---

### Remove Ingredient
**DELETE** `/api/recipes/:recipeId/ingredients/:ingredientId`

Remove an ingredient from a recipe.

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
    "message": "Ingredient removed successfully"
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
    "error": "Ingredient not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to remove ingredient"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Ingredient removed successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Ingredient not found |
| `500` | Internal server error |

---

### Add Instruction
**POST** `/api/recipes/:recipeId/instructions`

Add an instruction step to a recipe. The instruction will be appended at the end.

#### Request Body
```json
{
    "content": "Bake for 12 minutes or until golden brown",
    "metadata": {
        "timer": 720
    }
}
```

| Field      | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| `content`  | string | Yes      | Instruction text                               |
| `metadata` | object | No       | Additional metadata as JSON (e.g., timers)     |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `201 Created`

```json
{
    "instruction_id": 5,
    "recipe_id": 1,
    "step_number": 3,
    "content": "Bake for 12 minutes or until golden brown",
    "metadata": {
        "timer": 720
    },
    "created_at": "2026-02-04T13:00:00.000Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Instruction content is required"
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
    "error": "Failed to add instruction"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `201` | Instruction added successfully |
| `400` | Invalid input (missing content) |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Update Instruction
**PATCH** `/api/recipes/:recipeId/instructions/:instructionId`

Update an existing instruction's content or metadata.

#### Request Body
```json
{
    "content": "Bake for 15 minutes or until golden brown",
    "metadata": {
        "timer": 900,
        "temperature": 375
    }
}
```

| Field      | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `content`  | string | No       | Updated instruction text |
| `metadata` | object | No       | Updated metadata         |

**Note:** Only provide fields you want to update.

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
{
    "instruction_id": 5,
    "recipe_id": 1,
    "step_number": 3,
    "content": "Bake for 15 minutes or until golden brown",
    "metadata": {
        "timer": 900,
        "temperature": 375
    },
    "created_at": "2026-02-04T13:00:00.000Z"
}
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "No valid fields to update"
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
    "error": "Instruction not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to update instruction"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Instruction updated successfully |
| `400` | No valid fields provided |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Instruction not found |
| `500` | Internal server error |

---

### Remove Instruction
**DELETE** `/api/recipes/:recipeId/instructions/:instructionId`

Remove an instruction from a recipe. Remaining steps will be automatically renumbered.

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
    "message": "Instruction removed successfully"
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
    "error": "Instruction not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to remove instruction"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Instruction removed successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Instruction not found |
| `500` | Internal server error |

---

### Reorder Instructions
**PUT** `/api/recipes/:recipeId/instructions/reorder`

Reorder all instructions in a recipe by providing an array of instruction IDs in the desired order.

#### Request Body
```json
{
    "order": [5, 3, 1, 2, 4]
}
```

| Field   | Type  | Required | Description                                                  |
|---------|-------|----------|--------------------------------------------------------------|
| `order` | array | Yes      | Array of instruction IDs in the desired order. Must include all instruction IDs for the recipe. |

#### Request Header
```
Authorization: Bearer user.token.here
```

#### Success Response
**Code:** `200 OK`

```json
[
    {
        "instruction_id": 5,
        "recipe_id": 1,
        "step_number": 1,
        "content": "Preheat oven to 375°F",
        "metadata": {},
        "created_at": "2026-02-04T10:00:00.000Z"
    },
    {
        "instruction_id": 3,
        "recipe_id": 1,
        "step_number": 2,
        "content": "Mix dry ingredients",
        "metadata": {},
        "created_at": "2026-02-04T10:00:00.000Z"
    },
    {
        "instruction_id": 1,
        "recipe_id": 1,
        "step_number": 3,
        "content": "Add wet ingredients",
        "metadata": {},
        "created_at": "2026-02-04T10:00:00.000Z"
    }
]
```

#### Error Responses

<details>
<summary>Click to view all error codes</summary>

**Code:** `400 Bad Request`
```json
{
    "error": "Must provide an array of instruction IDs in \"order\""
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Instruction 5 does not belong to this recipe"
}
```

**Code:** `400 Bad Request`
```json
{
    "error": "Must include all instruction IDs in the reorder"
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
    "error": "Failed to reorder instructions"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Instructions reordered successfully |
| `400` | Invalid input (missing order array, invalid IDs, or incomplete list) |
| `401` | No token |
| `403` | Bad or expired token |
| `500` | Internal server error |

---

### Check Ingredient Availability
**GET** `/api/recipes/:recipeId/availability?scale=4`

Check if you have the ingredients to make a recipe by checking across all your pantries. Optionally scale for a different number of servings.

#### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `scale`   | number | No       | Number of servings to scale to. Needed quantities will be adjusted proportionally. |

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
    "recipe_id": 1,
    "recipe_name": "Chocolate Chip Cookies",
    "servings": 24,
    "status": "partially_available",
    "summary": {
        "total_linked_ingredients": 5,
        "available_count": 3,
        "missing_count": 2,
        "free_text_only_count": 1
    },
    "ingredients": [
        {
            "ingredient_id": 1,
            "free_text": null,
            "product_id": 123,
            "custom_product_id": null,
            "product_name": "All-Purpose Flour",
            "needed_quantity": 2,
            "unit": "cups",
            "available_quantity": 5,
            "is_available": true,
            "pantry_sources": [
                {
                    "pantry_id": 5,
                    "pantry_name": "Kitchen Pantry",
                    "quantity": 5
                }
            ]
        },
        {
            "ingredient_id": 2,
            "free_text": null,
            "product_id": null,
            "custom_product_id": 8,
            "product_name": "Homemade Vanilla Extract",
            "needed_quantity": 1,
            "unit": "teaspoon",
            "available_quantity": 0,
            "is_available": false,
            "pantry_sources": []
        },
        {
            "ingredient_id": 3,
            "free_text": "A pinch of salt",
            "product_id": null,
            "custom_product_id": null,
            "product_name": null,
            "needed_quantity": null,
            "unit": null,
            "available_quantity": 0,
            "is_available": null,
            "pantry_sources": []
        }
    ]
}
```

**Status Values:**
- `can_cook`: All linked ingredients are available
- `partially_available`: Some linked ingredients are available
- `missing_all`: No linked ingredients are available
- `unknown`: Recipe has no linked ingredients (only free text)

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
    "error": "Recipe not found"
}
```

**Code:** `500 Internal Server Error`
```json
{
    "error": "Failed to check ingredient availability"
}
```

</details>

#### Status Codes
| Code | Description |
|------|-------------|
| `200` | Availability checked successfully |
| `401` | No token |
| `403` | Bad or expired token |
| `404` | Recipe not found |
| `500` | Internal server error |

---

