# 🌱 Mazuri Waste Management and Control System - Master Guide

**Complete Documentation | Setup | API Reference | Deployment | Contributing**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [Project Structure](#project-structure)
7. [API Reference](#api-reference)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Deployment Guide](#deployment-guide)
10. [Development Workflow](#development-workflow)
11. [Contributing](#contributing)
12. [Troubleshooting](#troubleshooting)
13. [License & Support](#license--support)

---

## Project Overview

### What is Mazuri?

The **Mazuri Waste Management and Control System** is a comprehensive web-based platform designed to streamline waste collection, monitoring, and disposal. It automates scheduling, tracks waste sources, and generates reports, reducing manual errors, enhancing efficiency, and promoting environmental sustainability in communities and institutions.

### System Status

✅ **Complete and Production-Ready**

- Full MERN stack implementation
- Docker containerization
- Comprehensive documentation
- Ready for cloud deployment

### Key Statistics

- **54 Files** deployed
- **5,380 Lines** of code
- **35+ API Endpoints**
- **7 Main Pages** (UI)
- **4 Database Models**
- **5 User Roles**

---

## Quick Start

### Prerequisites

- Docker & Docker Compose installed

### 5-Minute Setup

```bash
# 1. Navigate to project
cd /workspaces/MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM

# 2. Start services
docker compose up -d

# 3. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:27017
```

### Default Credentials

```
Email: admin@mazuri.com
Password: Admin@123
Role: Admin (Full access)
```

### Verify Deployment

```bash
# Check services
docker compose ps

# Test API
curl http://localhost:5000/api/health

# View logs
docker compose logs -f
```

---

## Features

### 1. Waste Management
- Create and manage waste entries from various sources
- Track waste types and quantities
- Schedule automatic pickups
- Monitor waste status lifecycle (pending → scheduled → collected → processed → disposed)
- Filter and search waste entries
- View waste statistics by type

### 2. Collection Management
- Assign waste collections to specific collectors
- Track collection progress in real-time
- Record actual quantities collected vs. scheduled
- Add location and vehicle information
- Update collection status at each stage
- View collection statistics

### 3. User Management
- Create and manage user accounts
- Assign roles with specific permissions
- Track user activity and assignments
- Deactivate inactive users
- Change user roles and permissions
- Role-based access control

### 4. Analytics & Reporting
- Generate reports (daily, weekly, monthly, quarterly, annual)
- View waste distribution by:
  - Type (organic, recyclable, hazardous, electronic, mixed)
  - Source (residential, commercial, industrial, institutional, agricultural)
- Track completion rates
- Get insights and recommendations
- Export report data

### 5. Dashboard
- Overview of total waste collected
- Real-time collection statistics
- Waste type distribution charts
- System status monitoring
- Quick access to main features

### 6. Real-time Tracking
- Live collection status updates
- Progress monitoring
- Status change notifications
- Performance metrics

### 7. Responsive UI
- Mobile-friendly design
- Intuitive navigation
- Real-time data updates
- Charts and visualizations

---

## Technology Stack

### Backend
- **Runtime**: Node.js v18
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Library**: React.js v18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: CSS3
- **Package Manager**: npm

### Database
- **Primary**: MongoDB v6.0
- **Data Format**: JSON/BSON
- **Collections**: 4 (Users, Waste, Collections, Reports)

### DevOps & Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git/GitHub
- **Cloud Ready**: AWS, GCP, Azure, Kubernetes

### Additional Tools
- Nodemon (development)
- Jest (testing framework)
- Postman (API testing)

---

## Installation & Setup

### Option 1: Docker Deployment (Recommended)

#### Step 1: Install Docker
**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**macOS:**
```bash
brew install docker docker-compose
```

**Windows:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop
- Open PowerShell in project root and run `docker compose up -d`

#### Step 2: Start Application
```bash
cd /workspaces/MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM
docker compose up -d
```

#### Step 3: Verify Services
```bash
docker compose ps
# Expected: mongo, backend, frontend all "Up"
```

Optional ngrok tunnel (M-Pesa callback testing):

```bash
docker compose --env-file backend/.env --profile tunnel up -d
```

#### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Manual Setup (Development)

#### Backend Setup

1. **Install Node.js**
   ```bash
   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # macOS
   brew install node@18
   ```

  ```powershell
  # Windows (PowerShell)
  winget install OpenJS.NodeJS.LTS
  node -v
  npm -v
  ```

2. **Install MongoDB**
   ```bash
   # Ubuntu
   curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   
   # macOS
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

  ```powershell
  # Windows (PowerShell)
  winget install MongoDB.Server
  net start MongoDB
  Get-Service MongoDB
  ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   
   # Edit .env with your configuration
   npm run dev
   ```

  ```powershell
  # Windows (PowerShell)
  cd backend
  npm install
  Copy-Item .env.example .env
  code .env
  npm run dev
  ```

#### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

  ```powershell
  # Windows (PowerShell)
  cd frontend
  npm install
  Copy-Item .env.example .env
  ```

2. **Start Development Server**
   ```bash
   npm start
   # Opens http://localhost:3000
   ```

### Configuration Files

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://admin:password@mongo:27017/mazuri-waste-management
MONGODB_USER=admin
MONGODB_PASSWORD=password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin User
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@mazuri.com
ADMIN_PASSWORD=Admin@123

# Optional ngrok tunnel profile
NGROK_AUTHTOKEN=your_ngrok_authtoken
NGROK_DOMAIN=your-reserved-domain.ngrok-free.dev
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Project Structure

```
MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM/
│
├── backend/                           # Node.js + Express Backend
│   ├── config/
│   │   └── database.js               # MongoDB configuration
│   ├── controllers/                  # Business logic
│   │   ├── authController.js         # Authentication
│   │   ├── wasteController.js        # Waste operations
│   │   ├── collectionController.js   # Collection operations
│   │   ├── reportController.js       # Report generation
│   │   └── userController.js         # User management
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                   # JWT authentication
│   │   ├── errorHandler.js           # Error handling
│   │   └── validate.js               # Input validation
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                   # User model
│   │   ├── Waste.js                  # Waste model
│   │   ├── Collection.js             # Collection model
│   │   └── Report.js                 # Report model
│   ├── routes/                       # API routes
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── wasteRoutes.js            # Waste endpoints
│   │   ├── collectionRoutes.js       # Collection endpoints
│   │   ├── reportRoutes.js           # Report endpoints
│   │   └── userRoutes.js             # User endpoints
│   ├── server.js                     # Entry point
│   ├── package.json                  # Dependencies
│   ├── Dockerfile                    # Container config
│   ├── .env.example                  # Environment template
│   └── .gitignore                    # Git ignore rules
│
├── frontend/                          # React Frontend
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.js             # Navigation bar
│   │   │   ├── PrivateRoute.js       # Protected routes
│   │   │   └── WasteForm.js          # Waste form
│   │   ├── pages/                    # Page components
│   │   │   ├── LoginPage.js          # Login/authentication
│   │   │   ├── DashboardPage.js      # Main dashboard
│   │   │   ├── WasteListPage.js      # Waste list
│   │   │   ├── WasteFormPage.js      # Waste form page
│   │   │   ├── CollectionsPage.js    # Collections
│   │   │   ├── ReportsPage.js        # Reports
│   │   │   └── UsersPage.js          # Users (admin)
│   │   ├── services/                 # API services
│   │   │   ├── api.js                # Axios config
│   │   │   └── index.js              # Service modules
│   │   ├── styles/
│   │   │   └── index.css             # Global styles
│   │   ├── App.js                    # Root component
│   │   └── index.js                  # Entry point
│   ├── package.json                  # Dependencies
│   ├── Dockerfile                    # Container config
│   ├── .env.example                  # Environment template
│   └── .gitignore                    # Git ignore rules
│
├── docker-compose.yml                # Multi-container setup
├── .dockerignore                     # Docker ignore rules
├── .gitignore                        # Git ignore rules
│
├── README.md                         # Features overview
├── GETTING_STARTED.md                # Quick start guide
├── INSTALLATION.md                   # Installation guide
├── API_REFERENCE.md                  # API documentation
├── DEPLOYMENT.md                     # Deployment guide
├── CONTRIBUTING.md                   # Contributing guidelines
├── PROJECT_OVERVIEW.md               # Technical summary
├── MASTER_GUIDE.md                   # This file
├── LICENSE                           # MIT License
└── .github/                          # GitHub configuration
```

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except register/login) require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
All responses follow this standard format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - No/invalid token |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal issue |

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+254700000000",
  "location": "Nairobi",
  "role": "collector"
}
```

**Response (201)**
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

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200)**
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

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200)**
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

### Waste Endpoints

#### Create Waste
```http
POST /waste
Authorization: Bearer <token>
Content-Type: application/json

{
  "source": "residential",
  "location": "Downtown Nairobi",
  "wasteType": "organic",
  "quantity": {
    "amount": 100,
    "unit": "kg"
  },
  "description": "Food waste",
  "pickupScheduled": "2024-03-10T10:00:00",
  "contactPerson": {
    "name": "Jane Doe",
    "phone": "+254700000000",
    "email": "jane@example.com"
  }
}
```

#### Get All Waste
```http
GET /waste?status=pending&source=residential
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - pending, scheduled, collected, processed, disposed
- `source` - residential, commercial, industrial, institutional, agricultural
- `wasteType` - organic, recyclable, hazardous, electronic, mixed

#### Get Single Waste
```http
GET /waste/{id}
Authorization: Bearer <token>
```

#### Update Waste
```http
PUT /waste/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "scheduled",
  "quantity": { "amount": 100, "unit": "kg" }
}
```

#### Delete Waste
```http
DELETE /waste/{id}
Authorization: Bearer <token>
```

#### Get Waste Statistics
```http
GET /waste/stats
Authorization: Bearer <token>
```

**Response**
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
  }
]
```

### Collection Endpoints

#### Create Collection
```http
POST /collections
Authorization: Bearer <token>
Content-Type: application/json

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

#### Get All Collections
```http
GET /collections?status=completed
Authorization: Bearer <token>
```

#### Get Collection by ID
```http
GET /collections/{id}
Authorization: Bearer <token>
```

#### Update Collection
```http
PUT /collections/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "actualQuantity": { "amount": 95, "unit": "kg" },
  "notes": "Collection completed"
}
```

#### Delete Collection
```http
DELETE /collections/{id}
Authorization: Bearer <token>
```

#### Get Collection Statistics
```http
GET /collections/stats
Authorization: Bearer <token>
```

### Report Endpoints

#### Generate Report
```http
POST /reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "reportType": "monthly",
  "startDate": "2024-03-01",
  "endDate": "2024-03-31"
}
```

**Report Types:** daily, weekly, monthly, quarterly, annual

#### Get All Reports
```http
GET /reports?status=published&reportType=monthly
Authorization: Bearer <token>
```

#### Get Report by ID
```http
GET /reports/{id}
Authorization: Bearer <token>
```

#### Update Report
```http
PUT /reports/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "published"
}
```

#### Delete Report
```http
DELETE /reports/{id}
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users
```http
GET /users?role=collector&isActive=true
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /users/{id}
Authorization: Bearer <token>
```

#### Update User
```http
PUT /users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+254711111111",
  "location": "Kisumu"
}
```

#### Change User Role
```http
PATCH /users/{id}/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "supervisor"
}
```

**Valid Roles:** admin, waste-manager, collector, supervisor, viewer

#### Delete User
```http
DELETE /users/{id}
Authorization: Bearer <token>
```

---

## User Roles & Permissions

### Role Hierarchy

| Role | Level | Permissions |
|------|-------|-------------|
| **Admin** | 5 | Full system access, all operations |
| **Waste Manager** | 4 | Create/edit waste, schedule collections, view reports |
| **Supervisor** | 3 | Monitor collections, generate reports, manage collectors |
| **Collector** | 2 | View assigned collections, update status, view profile |
| **Viewer** | 1 | Read-only access to all data |

### Permission Matrix

| Feature | Admin | Waste Manager | Supervisor | Collector | Viewer |
|---------|-------|---------------|-----------|-----------|--------|
| Create Waste | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Waste | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Waste | ✅ | ✅ | ❌ | ❌ | ❌ |
| Schedule Collections | ✅ | ✅ | ✅ | ❌ | ❌ |
| Update Collection Status | ✅ | ✅ | ✅ | ✅ | ❌ |
| Generate Reports | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change Roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |

### Default Admin Account

```
Email: admin@mazuri.com
Password: Admin@123
Role: Admin
```

> **Security Note**: Change these credentials immediately in production.

---

## Deployment Guide

### Environment Selection

Choose based on your needs:

| Environment | Use Case | Scaling |
|-------------|----------|---------|
| **Local (Docker)** | Development, testing | Single machine |
| **Single Server** | Small deployments | Vertical only |
| **Cloud (AWS/GCP)** | Growing deployments | Horizontal + Vertical |
| **Kubernetes** | Large scale | Auto-scaling |

### Docker Deployment (Recommended for Start)

```bash
# Pull latest code
git pull origin main

# Start services
docker-compose up -d

# Verify
docker-compose ps

# View logs
docker-compose logs -f backend
```

### AWS Deployment

#### Step 1: Setup ECR
```bash
# Create repositories
aws ecr create-repository --repository-name mazuri-backend
aws ecr create-repository --repository-name mazuri-frontend

# Login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/mazuri-backend:latest backend/
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/mazuri-backend:latest
```

#### Step 2: ECS Deployment
```bash
# Create cluster
aws ecs create-cluster --cluster-name mazuri-cluster

# Create services
aws ecs create-service --cluster mazuri-cluster \
  --service-name mazuri-backend \
  --task-definition mazuri-backend:1 \
  --desired-count 1
```

#### Step 3: RDS Database
```bash
# MongoDB Atlas recommended for managed service
# Or use AWS DocumentDB
```

### Google Cloud Deployment

```bash
# Initialize
gcloud init

# Push to Container Registry
docker build -t gcr.io/PROJECT_ID/mazuri-backend:latest backend/
docker push gcr.io/PROJECT_ID/mazuri-backend:latest

# Deploy to Cloud Run
gcloud run deploy mazuri-backend \
  --image gcr.io/PROJECT_ID/mazuri-backend:latest \
  --platform managed \
  --region us-central1
```

### Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace mazuri

# Create configmap
kubectl create configmap mazuri-config \
  --from-literal=NODE_ENV=production \
  -n mazuri

# Create secrets
kubectl create secret generic mazuri-secrets \
  --from-literal=JWT_SECRET=your_secret \
  --from-literal=MONGODB_URI=mongodb://... \
  -n mazuri

# Deploy
kubectl apply -f kubernetes-deployment.yaml -n mazuri
```

### Production Checklist

- [ ] Change default credentials (admin@mazuri.com)
- [ ] Generate secure JWT secret
- [ ] Set strong MongoDB password
- [ ] Configure SSL/TLS with Let's Encrypt
- [ ] Enable CORS for your domain
- [ ] Setup automated backups
- [ ] Configure database indexes
- [ ] Enable logging and monitoring
- [ ] Setup rate limiting
- [ ] Configure auto-scaling policies
- [ ] Plan disaster recovery
- [ ] Document deployment process

### SSL/TLS Setup (Recommended)

#### Using Nginx + Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/mazuri

# Test and restart
sudo nginx -t
sudo systemctl restart nginx

# Auto-renewal
sudo certbot renew --dry-run
```

#### Nginx Configuration

```nginx
upstream backend {
    server backend:5000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }
}
```

### Monitoring & Logging

```bash
# Docker resource monitoring
docker stats

# View logs
docker-compose logs -f backend

# Health check
curl http://localhost:5000/api/health

# Database monitoring
docker-compose exec mongo mongo --eval "db.stats()"
```

### Backup Strategy

```bash
# Backup database
docker-compose exec mongo mongodump --out /backup

# Restore database
docker-compose exec mongo mongorestore /backup

# Automated daily backup script
0 2 * * * /path/to/backup.sh
```

### Scaling Considerations

**Vertical Scaling:**
- Increase server resources (CPU, RAM)
- Better for small to medium deployments

**Horizontal Scaling:**
- Multiple server instances
- Load balancing across instances
- Database replication

**Database Scaling:**
- MongoDB replication sets
- Sharding for large datasets
- Connection pooling

---

## Development Workflow

### Local Development Setup

#### With Docker (Recommended)

```bash
# Start services
docker-compose up -d

# Watch backend logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Without Docker

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Terminal 3 - MongoDB:**
```bash
mongod
```

### Code Structure

#### Backend Organization
- `config/` - Database and startup configuration
- `controllers/` - Business logic and request handlers
- `middleware/` - Authentication, validation, error handling
- `models/` - MongoDB schemas and database models
- `routes/` - API endpoint definitions
- `server.js` - Express app configuration

#### Frontend Organization
- `components/` - Reusable UI components
- `pages/` - Full page components
- `services/` - API integration services
- `styles/` - CSS styling
- `App.js` - Main app component

### Development Best Practices

1. **Code Style**
   - Use meaningful variable names
   - Write comments for complex logic
   - Keep functions small and focused
   - Use async/await over promises

2. **Git Workflow**
   ```bash
   # Create feature branch
   git checkout -b feature/feature-name
   
   # Make commits
   git commit -m "feat: Add feature description"
   
   # Push and create PR
   git push origin feature/feature-name
   ```

3. **Testing**
   - Test before pushing
   - Check API responses
   - Verify UI functionality
   - Test with different roles

4. **Code Review**
   - Review your own code first
   - Request reviews for PRs
   - Respond to feedback
   - Update based on comments

### Common Development Tasks

#### Add New API Endpoint

1. Create controller function in `controllers/`
2. Add route in `routes/`
3. Test with curl or Postman
4. Update API_REFERENCE.md
5. Commit and push

#### Add New Frontend Page

1. Create component in `pages/`
2. Add route in `App.js`
3. Add navigation link in `Navbar.js`
4. Test navigation
5. Commit and push

#### Modify Database Schema

1. Update model in `models/`
2. Create migration if needed
3. Update API accordingly
4. Test data persistence
5. Document changes

#### Fix a Bug

1. Create issue/branch
2. Reproduce the bug
3. Locate the issue
4. Fix and test
5. Create PR with description

---

## Contributing

### Getting Started as a Contributor

1. **Fork the repository**
   ```bash
   # On GitHub: Click Fork
   # Locally:
   git clone https://github.com/YOUR_USERNAME/MAZURI...
   cd MAZURI...
   git remote add upstream https://github.com/Aumaodh/MAZURI...
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Follow code style
   - Write clear commits
   - Test thoroughly

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Contribution Areas

- 🐛 **Bug Fixes** - Fix existing issues
- ✨ **Features** - Add new functionality
- 📚 **Documentation** - Improve guides
- 🧪 **Tests** - Increase test coverage
- ♻️ **Refactoring** - Improve code quality
- 🎨 **UI/UX** - Design improvements
- ⚡ **Performance** - Optimize speed

### Code Style Guidelines

**JavaScript/Node.js:**
```javascript
// Use const/let (not var)
const MAX_SIZE = 100;

// Use meaningful names
const calculateTotalWaste = () => { ... };

// Add comments for complex logic
// Calculate waste by type aggregation
const wasteByType = data.reduce(...);

// Use async/await
const getData = async () => {
  try {
    const response = await api.get('/waste');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
```

**React Components:**
```javascript
// Use functional components
const WasteList = ({ items }) => {
  const [data, setData] = useState([]);
  
  const handleClick = () => { ... };
  
  return (
    <div>
      {/* Clean JSX */}
    </div>
  );
};

export default WasteList;
```

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code restructuring
- `perf:` - Performance
- `test:` - Tests

**Examples:**
```
feat(waste): Add waste filtering by source
fix(auth): Resolve token expiration issue
docs(api): Update API endpoint documentation
```

### Pull Request Process

1. **Update documentation**
   - README.md if adding features
   - API_REFERENCE.md if changing API
   - Add comments to complex code

2. **Test thoroughly**
   - Manual testing completed
   - No existing tests broken
   - Different scenarios tested

3. **Create descriptive PR**
   - Clear title
   - Detailed description
   - Link related issues
   - Mention breaking changes

4. **Respond to feedback**
   - Address reviewer comments promptly
   - Update code as requested
   - Mark conversations as resolved

### Issue Reporting

**When reporting bugs:**
- Clear description of issue
- Steps to reproduce
- Current vs. expected behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

**When requesting features:**
- Describe the feature
- Explain use case
- Provide examples
- Check if similar exists

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Services Won't Start

**Problem:** `docker-compose up` fails

**Solution:**
```bash
# Check logs
docker-compose logs

# Clean and restart
docker-compose down -v
docker-compose up -d --build

# Check resource availability
docker system df
```

#### 2. Port Conflicts

**Problem:** "Port already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change ports in docker-compose.yml
```

#### 3. Can't Access Frontend

**Problem:** http://localhost:3000 not loading

**Solution:**
```bash
# Check if service is running
docker-compose ps

# Check logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Ensure REACT_APP_API_URL is correct in .env
```

#### 4. Backend API Not Responding

**Problem:** HTTP errors from API calls

**Solution:**
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check backend logs
docker-compose logs backend

# Verify JWT secret is set
# Test endpoint with curl
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/waste
```

#### 5. Database Connection Failed

**Problem:** MongoDB connection error

**Solution:**
```bash
# Check MongoDB is running
docker-compose ps mongo

# Verify connection string in .env
MONGODB_URI=mongodb://admin:password@mongo:27017/mazuri

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

#### 6. Login Fails

**Problem:** "Invalid credentials"

**Solution:**
- Verify correct email and password
- Try default credentials: admin@mazuri.com / Admin@123
- Check database has user data
- Verify MONGODB_URI is correct
- Check backend logs for errors

#### 7. CORS Errors

**Problem:** "CORS policy" error in frontend

**Solution:**
```bash
# In backend, verify backend/.env has:
FRONTEND_URL=http://localhost:3000

# Restart backend after changing .env
docker-compose restart backend
```

#### 8. Dependencies Won't Install

**Problem:** npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or in Docker
docker-compose build --no-cache
```

### Getting Help

1. **Check Documentation**
   - Review README.md
   - Check API_REFERENCE.md
   - Read INSTALLATION.md

2. **Check Logs**
   ```bash
   docker-compose logs -f
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Test Connectivity**
   ```bash
   curl http://localhost:5000/api/health
   curl http://localhost:3000
   ```

4. **Review Error Messages**
   - Console output
   - Browser dev tools
   - Docker logs

5. **Search Issues**
   - GitHub issues
   - Stack Overflow
   - Community forums

---

## Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  role: String (admin|waste-manager|collector|supervisor|viewer),
  location: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Waste Model
```javascript
{
  wasteId: String (unique, auto-generated),
  source: String (residential|commercial|industrial|institutional|agricultural),
  location: String (required),
  wasteType: String (organic|recyclable|hazardous|electronic|mixed),
  quantity: {
    amount: Number,
    unit: String (kg|tons|liters|bags|boxes)
  },
  description: String,
  pickupScheduled: Date (required),
  status: String (pending|scheduled|collected|processed|disposed),
  assignedTo: ObjectId (ref: User),
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection Model
```javascript
{
  collectionId: String (unique, auto-generated),
  wasteId: ObjectId (ref: Waste, required),
  collectorId: ObjectId (ref: User, required),
  collectionDate: Date (required),
  actualQuantity: {
    amount: Number,
    unit: String
  },
  location: String (required),
  vehicleId: String,
  status: String (scheduled|in-progress|completed|failed),
  notes: String,
  photos: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Report Model
```javascript
{
  reportId: String (unique, auto-generated),
  reportType: String (daily|weekly|monthly|quarterly|annual),
  period: {
    startDate: Date,
    endDate: Date
  },
  generatedBy: ObjectId (ref: User),
  summary: {
    totalWasteCollected: {
      amount: Number,
      unit: String
    },
    wasteByType: {
      organic: Number,
      recyclable: Number,
      hazardous: Number,
      electronic: Number,
      mixed: Number
    },
    wasteBySource: {
      residential: Number,
      commercial: Number,
      industrial: Number,
      institutional: Number,
      agricultural: Number
    },
    collectionCount: Number,
    completionRate: Number
  },
  insights: {
    peakCollection: String,
    leastCollected: String,
    recommendations: [String]
  },
  status: String (draft|published|archived),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Docker Commands Reference

### Container Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart

# View status
docker-compose ps

# View resource usage
docker stats
```

### Logs & Debugging
```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100
```

### Building & Updates
```bash
# Build images
docker-compose build

# Build specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache

# Pull and update
git pull
docker-compose up -d --build
```

### Accessing Containers
```bash
# Execute command
docker-compose exec backend npm install

# Open shell
docker-compose exec backend bash

# View file content
docker-compose exec mongo cat /etc/mongod.conf
```

### Cleaning Up
```bash
# Remove unused images
docker image prune

# Remove unused containers
docker container prune

# Remove all unused resources
docker system prune -a

# Remove specific image
docker rmi image_name
```

---

## Performance Optimization

### Database Optimization
```javascript
// Create indexes
db.waste.createIndex({ status: 1 })
db.waste.createIndex({ source: 1 })
db.collections.createIndex({ collectorId: 1 })
db.collections.createIndex({ collectionDate: -1 })
```

### Caching Strategy
- Implement Redis for frequently accessed data
- Cache waste statistics
- Cache user roles and permissions
- Set appropriate TTLs

### API Optimization
- Implement pagination for large datasets
- Use filtering to reduce results
- Optimize database queries
- Add request caching

### Frontend Optimization
- Code splitting for lazy loading
- Minify CSS/JS in production
- Use CDN for static assets
- Implement service workers

---

## Upcoming Enhancements

### Version 2.0 Roadmap
- 📧 Email/SMS notifications
- 📍 GPS tracking integration
- 📊 Advanced analytics dashboard
- 🔔 Real-time push notifications
- 🖼️ Photo upload support
- 🔐 Two-factor authentication
- 📱 Mobile app (React Native)
- 🤖 AI-powered waste classification

---

## License

This project is licensed under the MIT License.

```
Copyright (c) 2024 Mazuri Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

See LICENSE file for complete terms.

---

## Support & Contact

### Getting Help

1. **Documentation**
   - Review this master guide
   - Check API_REFERENCE.md
   - Read INSTALLATION.md

2. **Issues**
   - GitHub Issues: Create detailed bug reports
   - Include error logs and screenshots
   - Link relevant code/documentation

3. **Contact**
   - Email: support@mazuri.com
   - GitHub: Aumaodh/MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM

### Contributing

See CONTRIBUTING.md for guidelines on:
- Code style
- Commit messages
- Pull requests
- Testing requirements

### Community

- Share improvements
- Report bugs
- Suggest features
- Provide feedback

---

## Quick Reference

### Default Credentials
```
Email: admin@mazuri.com
Password: Admin@123
```

### Important URLs
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
Database: localhost:27017
```

### Essential Commands
```bash
# Start system
docker-compose up -d

# Stop system
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Important Files
```
.env.example - Environment template
docker-compose.yml - Service setup
server.js - Backend entry
App.js - Frontend entry
```

---

**Made with 🌱 for sustainable waste management**

**Last Updated:** March 2024  
**Version:** 1.0.0  
**Status:** Production Ready
