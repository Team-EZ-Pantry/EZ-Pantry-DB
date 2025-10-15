# EZ Pantry Database and Backend API

## Table of Contents
- [Quick Start](#-quick-start)
  - [Authentication](#authentication-🔒)
- [API Docs](#api-docs)
  - [Health Check](#health-check)
  - [Authentication Endpoints](#authentication-endpoints)
    - [Register](#register)
    - [Login](#login)
    - [Me 🔒](#me)
  - [Pantry Endpoints](#pantry-endpoints)
    - [Create Pantry 🔒](#create-pantry)
    - [Delete Pantry 🔒](#delete-pantry)


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
## Authentication 🔒
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

#### Request Parameters
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

#### Request Parameters
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

### Me
**GET** `/api/auth/me` 🔒

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

## Pantry Endpoints

### Create Pantry
**POST** `/api/pantry/` 🔒

Create a new pantry

#### Request Body 
```json
{
    "name" : "New Pantry"
}
```

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

### Delete Pantry
**DELETE** `/api/pantry/:pantryid` 🔒

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
    "error": "Failed to create pantry"
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