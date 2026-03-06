# API Reference - Mazuri Waste Management System

Complete API documentation for the Mazuri Waste Management System.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

Include the token in the request header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+254700000000",
  "location": "Nairobi",
  "role": "collector"
}
```

**Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "collector"
  }
}
```

---

### Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "collector"
  }
}
```

---

### Get Current User

**Endpoint**: `GET /auth/me`

**Description**: Get authenticated user's profile

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "role": "collector",
  "location": "Nairobi",
  "isActive": true,
  "createdAt": "2024-03-01T10:00:00Z"
}
```

---

## Waste Management Endpoints

### Create Waste Entry

**Endpoint**: `POST /waste`

**Description**: Create a new waste entry

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "source": "residential",
  "location": "Downtown Nairobi",
  "wasteType": "organic",
  "quantity": {
    "amount": 100,
    "unit": "kg"
  },
  "description": "Food waste from restaurant",
  "pickupScheduled": "2024-03-10T10:00:00",
  "contactPerson": {
    "name": "Jane Doe",
    "phone": "+254700000000",
    "email": "jane@example.com"
  }
}
```

**Response (201 Created)**:
```json
{
  "message": "Waste entry created successfully",
  "waste": {
    "_id": "507f1f77bcf86cd799439012",
    "wasteId": "WASTE-1709899200000-1",
    "source": "residential",
    "location": "Downtown Nairobi",
    "wasteType": "organic",
    "quantity": {
      "amount": 100,
      "unit": "kg"
    },
    "status": "pending",
    "pickupScheduled": "2024-03-10T10:00:00Z"
  }
}
```

---

### Get All Waste Entries

**Endpoint**: `GET /waste`

**Description**: Retrieve all waste entries with optional filters

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status`: Filter by status (pending, scheduled, collected, processed, disposed)
- `source`: Filter by source (residential, commercial, industrial, institutional, agricultural)
- `wasteType`: Filter by type (organic, recyclable, hazardous, electronic, mixed)

**Example**: `GET /waste?status=pending&source=residential`

**Response (200 OK)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "wasteId": "WASTE-1709899200000-1",
    "source": "residential",
    "location": "Downtown Nairobi",
    "wasteType": "organic",
    "quantity": {
      "amount": 100,
      "unit": "kg"
    },
    "status": "pending",
    "pickupScheduled": "2024-03-10T10:00:00Z"
  }
]
```

---

### Get Single Waste Entry

**Endpoint**: `GET /waste/{id}`

**Description**: Get details of a specific waste entry

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "wasteId": "WASTE-1709899200000-1",
  "source": "residential",
  "location": "Downtown Nairobi",
  "wasteType": "organic",
  "quantity": {
    "amount": 100,
    "unit": "kg"
  },
  "status": "pending",
  "pickupScheduled": "2024-03-10T10:00:00Z",
  "assignedTo": null,
  "contactPerson": {
    "name": "Jane Doe",
    "phone": "+254700000000",
    "email": "jane@example.com"
  }
}
```

---

### Update Waste Entry

**Endpoint**: `PUT /waste/{id}`

**Description**: Update a waste entry

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Any field from the create request

**Response (200 OK)**:
```json
{
  "message": "Waste entry updated successfully",
  "waste": { ... }
}
```

---

### Delete Waste Entry

**Endpoint**: `DELETE /waste/{id}`

**Description**: Delete a waste entry

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "Waste entry deleted successfully"
}
```

---

### Get Waste Statistics

**Endpoint**: `GET /waste/stats`

**Description**: Get aggregated waste statistics

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
[
  {
    "_id": "organic",
    "count": 15,
    "totalQuantity": 1500
  },
  {
    "_id": "recyclable",
    "count": 23,
    "totalQuantity": 2300
  },
  {
    "_id": "hazardous",
    "count": 5,
    "totalQuantity": 50
  }
]
```

---

## Collections Endpoints

### Create Collection

**Endpoint**: `POST /collections`

**Description**: Create a new collection record

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "wasteId": "507f1f77bcf86cd799439012",
  "collectorId": "507f1f77bcf86cd799439013",
  "collectionDate": "2024-03-10T10:00:00",
  "actualQuantity": {
    "amount": 95,
    "unit": "kg"
  },
  "location": "Downtown Nairobi",
  "vehicleId": "VEH-001",
  "notes": "Successfully collected"
}
```

**Response (201 Created)**:
```json
{
  "message": "Collection record created",
  "collection": {
    "_id": "507f1f77bcf86cd799439014",
    "collectionId": "COLL-1709899200000-1",
    "wasteId": {...},
    "collectorId": {...},
    "status": "scheduled",
    "actualQuantity": {
      "amount": 95,
      "unit": "kg"
    }
  }
}
```

---

### Get All Collections

**Endpoint**: `GET /collections`

**Description**: Retrieve all collection records

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status`: Filter by status (scheduled, in-progress, completed, failed)

**Response (200 OK)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "collectionId": "COLL-1709899200000-1",
    "wasteId": {...},
    "collectorId": {...},
    "status": "scheduled"
  }
]
```

---

### Update Collection

**Endpoint**: `PUT /collections/{id}`

**Description**: Update collection status and details

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "completed",
  "actualQuantity": {
    "amount": 95,
    "unit": "kg"
  },
  "notes": "Collection completed successfully"
}
```

**Response (200 OK)**:
```json
{
  "message": "Collection updated",
  "collection": { ... }
}
```

---

### Get Collection Statistics

**Endpoint**: `GET /collections/stats`

**Description**: Get collection statistics by status

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
[
  {
    "_id": "completed",
    "count": 45,
    "totalQuantity": 4500
  },
  {
    "_id": "scheduled",
    "count": 12,
    "totalQuantity": 1200
  }
]
```

---

## Reports Endpoints

### Generate Report

**Endpoint**: `POST /reports`

**Description**: Generate a new report

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "reportType": "monthly",
  "startDate": "2024-03-01",
  "endDate": "2024-03-31"
}
```

**Response (201 Created)**:
```json
{
  "message": "Report generated successfully",
  "report": {
    "_id": "507f1f77bcf86cd799439015",
    "reportId": "RPT-1709899200000-1",
    "reportType": "monthly",
    "period": {
      "startDate": "2024-03-01T00:00:00Z",
      "endDate": "2024-03-31T23:59:59Z"
    },
    "summary": {
      "totalWasteCollected": {
        "amount": 4500,
        "unit": "kg"
      },
      "collectionCount": 45,
      "completionRate": 100
    },
    "status": "published"
  }
}
```

---

### Get All Reports

**Endpoint**: `GET /reports`

**Description**: Retrieve all reports

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status`: Filter by status (draft, published, archived)
- `reportType`: Filter by type (daily, weekly, monthly, quarterly, annual)

**Response (200 OK)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "reportId": "RPT-1709899200000-1",
    "reportType": "monthly",
    "summary": { ... },
    "status": "published"
  }
]
```

---

## Users Endpoints

### Get All Users

**Endpoint**: `GET /users`

**Description**: Retrieve all users

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `role`: Filter by role
- `isActive`: Filter by active status

**Response (200 OK)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "collector",
    "location": "Nairobi",
    "isActive": true
  }
]
```

---

### Get Single User

**Endpoint**: `GET /users/{id}`

**Description**: Get details of a specific user

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "role": "collector",
  "location": "Nairobi",
  "isActive": true,
  "createdAt": "2024-03-01T10:00:00Z"
}
```

---

### Update User

**Endpoint**: `PUT /users/{id}`

**Description**: Update user information

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "+254711111111",
  "location": "Kisumu"
}
```

**Response (200 OK)**:
```json
{
  "message": "User updated",
  "user": { ... }
}
```

---

### Change User Role

**Endpoint**: `PATCH /users/{id}/role`

**Description**: Update user role (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "role": "supervisor"
}
```

**Valid Roles**:
- admin
- waste-manager
- collector
- supervisor
- viewer

**Response (200 OK)**:
```json
{
  "message": "User role updated",
  "user": { ... }
}
```

---

### Delete User

**Endpoint**: `DELETE /users/{id}`

**Description**: Delete a user account

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "User deleted"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "message": "Waste entry not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": {}
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently not implemented. Consider implementing for production.

---

## Pagination

Not yet implemented. Raw all results are returned.

---

For more information, visit the main README.md
