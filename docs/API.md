# Sistema-Cloud API Documentation

## 🌐 API Overview

The Sistema-Cloud API provides endpoints for managing safety function analysis according to ISO 13849-1 standards. It allows users to create projects, model safety functions, manage component libraries, and generate compliance reports.

## 🔗 Base URL

- Development: `http://localhost:8000`
- Production: `https://api.sistema-cloud.com` (placeholder for future deployment)

## 🔐 Authentication

API endpoints are protected with OAuth 2.0 / JWT authentication.

**Authentication Flow:**
1. User logs in via `/auth/token` endpoint
2. API returns a JWT token
3. Include token in all subsequent requests in the Authorization header:
   ```
   Authorization: Bearer <token>
   ```

## 📡 Endpoints

### Health Check

#### GET /health

Check the health status of the API.

**Response:**
```json
{
  "status": "healthy"
}
```

### Authentication

#### POST /auth/token

Authenticate and get a JWT token.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Projects

#### GET /projects

List all projects accessible to the authenticated user.

**Response:**
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Cobot Safety Analysis",
      "description": "Safety analysis for collaborative robot",
      "created_at": "2025-06-26T10:23:54Z",
      "updated_at": "2025-06-26T14:12:33Z"
    },
    ...
  ],
  "total": 5,
  "page": 1,
  "size": 10
}
```

#### GET /projects/{project_id}

Get a specific project by ID.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Cobot Safety Analysis",
  "description": "Safety analysis for collaborative robot",
  "created_at": "2025-06-26T10:23:54Z",
  "updated_at": "2025-06-26T14:12:33Z",
  "owner_id": "user123",
  "status": "active",
  "metadata": {
    "machine_type": "collaborative_robot",
    "industry": "automotive"
  }
}
```

#### POST /projects

Create a new project.

**Request Body:**
```json
{
  "name": "New Safety Project",
  "description": "Analysis of new conveyor system",
  "metadata": {
    "machine_type": "conveyor",
    "industry": "food_processing"
  }
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "New Safety Project",
  "description": "Analysis of new conveyor system",
  "created_at": "2025-06-27T09:30:00Z",
  "updated_at": "2025-06-27T09:30:00Z",
  "owner_id": "current_user_id",
  "status": "draft",
  "metadata": {
    "machine_type": "conveyor",
    "industry": "food_processing"
  }
}
```

### Safety Functions

#### GET /projects/{project_id}/safety-functions

List all safety functions in a project.

**Response:**
```json
{
  "items": [
    {
      "id": "456e4567-e89b-12d3-a456-426614174000",
      "name": "Emergency Stop",
      "pl_required": "e",
      "pl_achieved": "d",
      "category": 3,
      "status": "warning"
    },
    ...
  ],
  "total": 3,
  "page": 1,
  "size": 10
}
```

#### GET /projects/{project_id}/safety-functions/{function_id}

Get a specific safety function.

**Response:**
```json
{
  "id": "456e4567-e89b-12d3-a456-426614174000",
  "name": "Emergency Stop",
  "description": "Emergency stop function for main production line",
  "pl_required": "e",
  "pl_achieved": "d",
  "category": 3,
  "mttfd": 45.5,
  "dc": 90,
  "ccf": "passed",
  "pfhd": 2.47e-6,
  "status": "warning",
  "components": [
    {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "name": "E-Stop Button XYZ",
      "type": "sensor",
      "mttfd": 50,
      "dc": 99
    },
    ...
  ]
}
```

## 📊 Models

### Project
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "created_at": "string (datetime)",
  "updated_at": "string (datetime)",
  "owner_id": "string",
  "status": "draft|active|archived",
  "metadata": {
    "key": "value"
  }
}
```

### SafetyFunction
```json
{
  "id": "string (UUID)",
  "project_id": "string (UUID)",
  "name": "string",
  "description": "string",
  "pl_required": "a|b|c|d|e",
  "pl_achieved": "a|b|c|d|e|none",
  "category": "integer (1-4)",
  "mttfd": "number",
  "dc": "number (percentage)",
  "ccf": "passed|failed",
  "pfhd": "number",
  "status": "ok|warning|error",
  "created_at": "string (datetime)",
  "updated_at": "string (datetime)"
}
```

### Component
```json
{
  "id": "string (UUID)",
  "name": "string",
  "type": "sensor|logic|actuator",
  "manufacturer": "string",
  "model": "string",
  "mttfd": "number",
  "dc": "number (percentage)",
  "b10d": "number (optional)",
  "sil_equivalent": "string (optional)"
}
```

## 🔄 Error Handling

Errors follow a standard format:

```json
{
  "status_code": 400,
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": [
      "error message"
    ]
  }
}
```

Common error status codes:
- 400: Bad Request - Invalid input data
- 401: Unauthorized - Authentication required
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 422: Unprocessable Entity - Valid input but unable to process
- 500: Internal Server Error - Server-side error

## 🔄 Rate Limiting

API requests are limited to 100 requests per minute per user. Rate limiting information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1624716120
```

## 📝 Versioning

The API is versioned using URL path versioning:
- Current version: `/api/v1/`
- Future versions: `/api/v2/`, etc.

The current documentation applies to API version 1.
