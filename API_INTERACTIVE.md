# 📡 Interactive API Documentation

**Mazuri Waste Management System - Complete API Guide with Examples**

---

## Quick Navigation

- [Base URL & Authentication](#base-url--authentication)
- [Authentication Endpoints](#authentication-endpoints)
- [Waste Management API](#waste-management-api)
- [Collections API](#collections-api)
- [Reports API](#reports-api)
- [Users API](#users-api)
- [Testing Guide](#testing-guide)
- [Common Responses](#common-responses)

---

## Base URL & Authentication

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
All requests (except login/register) require:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

---

## Authentication Endpoints

### 1. Register New User

**Endpoint:**
```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Collector",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+254700000000",
  "location": "Nairobi",
  "role": "collector"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Collector",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+254700000000",
    "location": "Nairobi",
    "role": "collector"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Collector",
      "email": "john@example.com",
      "role": "collector",
      "location": "Nairobi"
    }
  },
  "message": "User registered successfully"
}
```

---

### 2. Login

**Endpoint:**
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@mazuri.com",
  "password": "Admin@123"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mazuri.com",
    "password": "Admin@123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Admin User",
      "email": "admin@mazuri.com",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

---

### 3. Get Current User

**Endpoint:**
```http
GET /auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example with cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439010",
    "name": "Admin User",
    "email": "admin@mazuri.com",
    "phone": "+254700000000",
    "role": "admin",
    "location": "Nairobi",
    "isActive": true,
    "createdAt": "2024-03-01T10:00:00Z",
    "updatedAt": "2024-03-01T10:00:00Z"
  },
  "message": "User retrieved successfully"
}
```

---

## Waste Management API

### 1. Create Waste Entry

**Endpoint:**
```http
POST /waste
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "source": "residential",
  "location": "Downtown Nairobi",
  "wasteType": "organic",
  "quantity": {
    "amount": 150,
    "unit": "kg"
  },
  "description": "Food waste from restaurant",
  "pickupScheduled": "2024-03-10T14:00:00",
  "contactPerson": {
    "name": "Jane Doe",
    "phone": "+254700000001",
    "email": "jane@restaurant.com"
  }
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/waste \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "residential",
    "location": "Downtown Nairobi",
    "wasteType": "organic",
    "quantity": {
      "amount": 150,
      "unit": "kg"
    },
    "description": "Food waste from restaurant",
    "pickupScheduled": "2024-03-10T14:00:00",
    "contactPerson": {
      "name": "Jane Doe",
      "phone": "+254700000001",
      "email": "jane@restaurant.com"
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "wasteId": "WASTE-001",
    "source": "residential",
    "location": "Downtown Nairobi",
    "wasteType": "organic",
    "quantity": {
      "amount": 150,
      "unit": "kg",
      "_id": "507f1f77bcf86cd799439011"
    },
    "description": "Food waste from restaurant",
    "pickupScheduled": "2024-03-10T14:00:00",
    "status": "pending",
    "contactPerson": {
      "name": "Jane Doe",
      "phone": "+254700000001",
      "email": "jane@restaurant.com",
      "_id": "507f1f77bcf86cd799439013"
    },
    "createdAt": "2024-03-06T10:30:00Z"
  },
  "message": "Waste entry created successfully"
}
```

---

### 2. Get All Waste

**Endpoint:**
```http
GET /waste?status=pending&source=residential&limit=10&page=1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | pending, scheduled, collected, processed, disposed |
| source | string | residential, commercial, industrial, institutional, agricultural |
| wasteType | string | organic, recyclable, hazardous, electronic, mixed |
| limit | number | Results per page (default: 10) |
| page | number | Page number (default: 1) |

**Example with cURL:**
```bash
curl -X GET "http://localhost:5000/api/waste?status=pending&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "wasteId": "WASTE-001",
      "source": "residential",
      "location": "Downtown Nairobi",
      "wasteType": "organic",
      "quantity": {
        "amount": 150,
        "unit": "kg"
      },
      "status": "pending",
      "pickupScheduled": "2024-03-10T14:00:00",
      "createdAt": "2024-03-06T10:30:00Z"
    }
  ],
  "message": "Waste entries retrieved"
}
```

---

### 3. Get Waste by ID

**Endpoint:**
```http
GET /waste/{id}
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example with cURL:**
```bash
curl -X GET http://localhost:5000/api/waste/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Update Waste

**Endpoint:**
```http
PUT /waste/{id}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "status": "scheduled",
  "quantity": {
    "amount": 145,
    "unit": "kg"
  }
}
```

**Example with cURL:**
```bash
curl -X PUT http://localhost:5000/api/waste/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "scheduled",
    "quantity": {
      "amount": 145,
      "unit": "kg"
    }
  }'
```

---

### 5. Delete Waste

**Endpoint:**
```http
DELETE /waste/{id}
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example with cURL:**
```bash
curl -X DELETE http://localhost:5000/api/waste/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 6. Get Waste Statistics

**Endpoint:**
```http
GET /waste/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example with cURL:**
```bash
curl -X GET http://localhost:5000/api/waste/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "organic",
      "count": 15,
      "totalQuantity": 2250
    },
    {
      "_id": "recyclable",
      "count": 23,
      "totalQuantity": 3450
    },
    {
      "_id": "hazardous",
      "count": 8,
      "totalQuantity": 240
    },
    {
      "_id": "electronic",
      "count": 5,
      "totalQuantity": 75
    }
  ],
  "message": "Waste statistics retrieved"
}
```

---

## Collections API

### 1. Create Collection

**Endpoint:**
```http
POST /collections
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "wasteId": "507f1f77bcf86cd799439012",
  "collectorId": "507f1f77bcf86cd799439013",
  "collectionDate": "2024-03-10T14:00:00",
  "actualQuantity": {
    "amount": 148,
    "unit": "kg"
  },
  "location": "Downtown Nairobi",
  "vehicleId": "VEH-001",
  "notes": "Collected from primary location"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/collections \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "wasteId": "507f1f77bcf86cd799439012",
    "collectorId": "507f1f77bcf86cd799439013",
    "collectionDate": "2024-03-10T14:00:00",
    "actualQuantity": {
      "amount": 148,
      "unit": "kg"
    },
    "location": "Downtown Nairobi",
    "vehicleId": "VEH-001",
    "notes": "Collected from primary location"
  }'
```

---

### 2. Get All Collections

**Endpoint:**
```http
GET /collections?status=completed&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
| Parameter | Values |
|-----------|--------|
| status | scheduled, in-progress, completed, failed |
| collectorId | User ID filter |
| limit | Results per page |
| page | Page number |

---

### 3. Update Collection

**Endpoint:**
```http
PUT /collections/{id}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed",
  "actualQuantity": {
    "amount": 148,
    "unit": "kg"
  },
  "notes": "Successfully completed collection"
}
```

---

### 4. Get Collection Statistics

**Endpoint:**
```http
GET /collections/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCollections": 45,
    "completedToday": 12,
    "pendingCollections": 5,
    "totalQuantityCollected": 3250,
    "averageQuantity": 72.2
  }
}
```

---

## Reports API

### 1. Generate Report

**Endpoint:**
```http
POST /reports
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "reportType": "monthly",
  "startDate": "2024-03-01",
  "endDate": "2024-03-31"
}
```

**Supported Report Types:**
- `daily` - Daily statistics
- `weekly` - Weekly summary
- `monthly` - Monthly analysis
- `quarterly` - Quarterly report
- `annual` - Annual report

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "monthly",
    "startDate": "2024-03-01",
    "endDate": "2024-03-31"
  }'
```

---

### 2. Get All Reports

**Endpoint:**
```http
GET /reports?reportType=monthly&status=published
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "reportId": "REPORT-001",
      "reportType": "monthly",
      "period": {
        "startDate": "2024-03-01",
        "endDate": "2024-03-31"
      },
      "summary": {
        "totalWasteCollected": {
          "amount": 3250,
          "unit": "kg"
        },
        "wasteByType": {
          "organic": 1500,
          "recyclable": 1000,
          "hazardous": 400,
          "electronic": 200,
          "mixed": 150
        },
        "collectionCount": 45,
        "completionRate": 95
      },
      "insights": {
        "peakCollection": "Wednesday",
        "leastCollected": "Monday",
        "recommendations": [
          "Increase collection frequency on weekends",
          "Focus on hazardous waste separation"
        ]
      },
      "status": "published",
      "createdAt": "2024-03-31T18:00:00Z"
    }
  ]
}
```

---

### 3. Get Report by ID

**Endpoint:**
```http
GET /reports/{id}
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Users API

### 1. Get All Users

**Endpoint:**
```http
GET /users?role=collector&isActive=true&limit=20
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Collector",
      "email": "john@example.com",
      "phone": "+254700000001",
      "role": "collector",
      "location": "Nairobi",
      "isActive": true,
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ],
  "message": "Users retrieved successfully"
}
```

---

### 2. Update User

**Endpoint:**
```http
PUT /users/{id}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+254711111111",
  "location": "Kisumu"
}
```

---

### 3. Change User Role

**Endpoint:**
```http
PATCH /users/{id}/role
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "supervisor"
}
```

**Valid Roles:**
- `admin` - Full system access
- `waste-manager` - Create/manage waste
- `supervisor` - Monitor collections
- `collector` - Update collection status
- `viewer` - Read-only access

---

## Testing Guide

### Using Postman

1. **Import the collection** (if available)
2. **Set Base URL** in variables: `http://localhost:5000/api`
3. **On login**, save token: `{{token}}`
4. **Use in headers**: `Authorization: Bearer {{token}}`

### Using cURL Scripts

**Save as `test-api.sh`:**
```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# Login
echo "Logging in..."
LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mazuri.com",
    "password": "Admin@123"
  }')

TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Get all waste
echo -e "\n\nFetching waste entries..."
curl -X GET "$BASE_URL/waste" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | json_pp

# Get statistics
echo -e "\n\nFetching statistics..."
curl -X GET "$BASE_URL/waste/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | json_pp
```

**Run:**
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Common Responses

### Success Response (200)
```json
{
  "success": true,
  "data": { /* your data */ },
  "message": "Operation successful"
}
```

### Created Response (201)
```json
{
  "success": true,
  "data": { /* created resource */ },
  "message": "Resource created successfully"
}
```

### Error Response (400)
```json
{
  "success": false,
  "error": "Invalid input",
  "message": "Please provide all required fields"
}
```

### Unauthorized Response (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "No token provided or token is invalid"
}
```

### Not Found Response (404)
```json
{
  "success": false,
  "error": "Not found",
  "message": "Resource not found"
}
```

### Server Error Response (500)
```json
{
  "success": false,
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

---

## Error Codes Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format and required fields |
| 401 | Unauthorized | Include valid Authorization header |
| 404 | Not Found | Verify resource ID exists |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Server Error | Check server logs |

---

## Rate Limiting

- **Free tier**: 100 requests/minute
- **Premium**: 1000 requests/minute

Current limits returned in headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1646574000
```

---

## Pagination

**Request:**
```http
GET /waste?limit=10&page=2
```

**Response includes:**
```json
{
  "success": true,
  "data": [ /* results */ ],
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

---

## Best Practices

✅ **Do:**
- Use HTTPS in production
- Store tokens securely
- Validate input on client-side
- Use pagination for large datasets
- Implement error handling
- Cache responses when appropriate

❌ **Don't:**
- Send passwords in requests
- Expose tokens in logs
- Use GET for sensitive operations
- Store tokens in localStorage (use secure cookies)
- Ignore rate limits

---

## Additional Resources

- [Complete Setup Guide](MASTER_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Quick Start](GETTING_STARTED.md)

---

**Last Updated:** March 6, 2024  
**API Version:** 1.0.0  
**Status:** Production Ready

🌱 Made for sustainable waste management
