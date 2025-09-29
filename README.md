# EZ Pantry API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
*not here yet*

## Endpoints

### Health Check
**GET** `/health`

Check if the server and database are running.

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

## Status Codes
- `200` - Success
- `503` - Service Unavailable (database issues)
