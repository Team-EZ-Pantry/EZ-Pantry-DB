# EZ Pantry Backend API

## 📋 Table of Contents
- [Quick Start](#-quick-start)
- [API Docs](#-api-documentation)
  - [Health Check](#health-check)


## Quick Start

### Prerequisites
- Node.js 16+
- Postgres

### Installation
```bash
git clone https://github.com/Team-EZ-Pantry/EZ-Pantry-DB.git
cd EZ-Pantry-DB
npm install
```

### Environment Setup
```env
DB_USER=devuser
DB_PASSWORD=devpass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
APP_PORT=3000
```

## API Docs

### Base URL
```
http://localhost:3000
```

### Health Check
**GET** `/health`

Check server and database status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🏗️ Project Structure
```
EZ-Pantry-DB/
├── index.js          # Main server file
├── .env              # Environment variables
├── package.json
└── README.md
```

## 💻 Development
```bash
npm run dev
```

## 👥 Team
- Your Name - Backend Developer

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
