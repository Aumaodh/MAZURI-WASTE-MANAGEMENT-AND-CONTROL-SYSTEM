# Mazuri Waste Management - Installation Guide

## System Requirements

- **Operating System**: Ubuntu 20.04+ / macOS 10.15+ / Windows 10+
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: At least 1GB free
- **Internet Connection**: Required for downloading dependencies

## Installation Methods

### Method 1: Docker Compose (Recommended)

#### Step 1: Install Docker and Docker Compose

**Ubuntu/Debian:**
```bash
# Update package manager
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**macOS:**
```bash
# Install using Homebrew
brew install docker docker-compose
```

**Windows:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Install and configure

#### Step 2: Deploy Application

```bash
# Navigate to project directory
cd /workspaces/MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check backend logs
docker-compose logs -f backend

# Check frontend logs
docker-compose logs -f frontend
```

#### Step 3: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Method 2: Manual Installation

#### Backend Setup

1. **Install Node.js and npm**
   ```bash
   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # macOS
   brew install node@18
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

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   
   # Edit .env file with your configuration
   nano .env
   
   # Start backend
   npm run dev
   ```

#### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

2. **Start Frontend**
   ```bash
   npm start
   ```

## Initial Configuration

### 1. MongoDB Setup

If using Docker, MongoDB is automatically configured. For manual setup:

```bash
# Connect to MongoDB
mongosh

# Create database
use mazuri-waste-management

# Create collections
db.createCollection('users')
db.createCollection('waste')
db.createCollection('collections')
db.createCollection('reports')

# Exit
exit
```

### 2. Backend Configuration

Edit `backend/.env`:

```env
# Database
MONGODB_URI=mongodb://your_host:27017/mazuri-waste-management
MONGODB_USER=admin
MONGODB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin User
ADMIN_EMAIL=admin@mazuri.com
ADMIN_PASSWORD=Admin@123
```

### 3. Frontend Configuration

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Verify Installation

### Check Services Status

```bash
# Using Docker
docker-compose ps

# Expected output:
# NAME              STATUS      PORTS
# mazuri_mongo      Up          27017/tcp
# mazuri_backend    Up          5000/tcp
# mazuri_frontend   Up          3000/tcp
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Mazuri Waste Management System is running"}

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mazuri.com","password":"Admin@123"}'
```

### Test Frontend

1. Open http://localhost:3000
2. Login with credentials:
   - Email: `admin@mazuri.com`
   - Password: `Admin@123`
3. Navigate through dashboard and features

## Database Initialization

### Create Admin User (Automatic)

The system automatically creates an admin user on first run. Credentials:
- **Email**: admin@mazuri.com
- **Password**: Admin@123

### Manual User Creation

```bash
# Via API using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "phone": "+254700000000",
    "location": "Nairobi",
    "role": "collector"
  }'
```

## Troubleshooting Installation

### Issue: Ports Already in Use

```bash
# Kill process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process using port 27017
lsof -i :27017 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Issue: MongoDB Connection Failed

```bash
# Check MongoDB service status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Issue: Dependencies Installation Failed

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Docker Image Build Fails

```bash
# Force rebuild without cache
docker-compose up -d --build --no-cache

# Check Docker logs
docker system df
docker system prune -a
```

## Backup and Restore

### Backup MongoDB Data

```bash
# Using Docker
docker-compose exec mongo mongodump --out /backup

# Using local MongoDB
mongodump --out /backup
```

### Restore MongoDB Data

```bash
# Using Docker
docker-compose exec mongo mongorestore /backup

# Using local MongoDB
mongorestore /backup
```

## Updating the Application

```bash
# Stop existing containers
docker-compose down

# Pull latest changes
git pull origin main

# Rebuild and start
docker-compose up -d --build
```

## Production Deployment

### Environment Setup

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Update .env for production
NODE_ENV=production
JWT_SECRET=<generated_secret>
MONGODB_URI=<production_mongodb_uri>
```

### Use Reverse Proxy (Nginx)

```nginx
upstream backend {
    server backend:5000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name example.com;

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }
}
```

### SSL/TLS Configuration

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d example.com

# Update Nginx configuration to use SSL
```

## Performance Monitoring

```bash
# Check Docker resource usage
docker stats

# Check system resources
top
htop  # if installed

# View database size
docker-compose exec mongo du -sh /data/db
```

## Next Steps

1. Configure email notifications
2. Set up logging and monitoring
3. Configure backup strategy
4. Plan scaling architecture
5. Security hardening

For additional support, visit the main README.md or contact support@mazuri.com
