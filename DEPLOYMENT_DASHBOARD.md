# 🎛️ Mazuri Deployment Dashboard

**System Status & Quick Access Hub**

---

## 📊 Quick Status Check

```
Last Updated: 2024-03-06
Status: ✅ Production Ready
Services: 3/3 Running
Health: 100%
```

---

## 🚀 One-Command Startup

### Using the Quick Start Script (Recommended)

```bash
# Make script executable
chmod +x start.sh

# Start the system
./start.sh start

# View logs
./start.sh logs

# Check status
./start.sh status

# Stop the system
./start.sh stop
```

### Using Docker Compose Directly

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

---

## 🌐 Service Access Links

| Service | URL | Status |
|---------|-----|--------|
| **Frontend UI** | [http://localhost:3000](http://localhost:3000) | ✅ Ready |
| **Backend API** | [http://localhost:5000/api](http://localhost:5000/api) | ✅ Ready |
| **API Health** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | ✅ Ready |
| **Database** | mongodb://localhost:27017 | ✅ Ready |

---

## 👤 Login Credentials

Default admin account for testing:

```
Email:    admin@mazuri.com
Password: Admin@123
Role:     Administrator
```

> ⚠️ **Security Note**: Change these credentials in production!

---

## 📡 API Quick Reference

### Base URL
```
http://localhost:5000/api
```

### Common Endpoints

#### Authentication
```http
POST /auth/register        # Register new user
POST /auth/login           # Login user
GET  /auth/me              # Get current user
```

#### Waste Management
```http
GET    /waste              # List all waste
POST   /waste              # Create waste entry
GET    /waste/{id}         # Get waste details
PUT    /waste/{id}         # Update waste
DELETE /waste/{id}         # Delete waste
GET    /waste/stats        # Get statistics
```

#### Collections
```http
GET    /collections        # List collections
POST   /collections        # Create collection
GET    /collections/{id}   # Get details
PUT    /collections/{id}   # Update collection
DELETE /collections/{id}   # Delete collection
GET    /collections/stats  # Get statistics
```

#### Reports
```http
GET    /reports            # List reports
POST   /reports            # Generate report
GET    /reports/{id}       # Get report
PUT    /reports/{id}       # Update report
DELETE /reports/{id}       # Delete report
```

#### Users (Admin Only)
```http
GET    /users              # List users
GET    /users/{id}         # Get user
PUT    /users/{id}         # Update user
PATCH  /users/{id}/role    # Change role
DELETE /users/{id}         # Delete user
```

---

## 🔍 Health Check

### Check Frontend Health
```bash
curl http://localhost:3000
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### Check Database Connection
```bash
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

### Full System Status
```bash
./start.sh status
```

---

## 📊 Docker Management

### View All Images
```bash
docker images | grep mazuri
```

### View Running Containers
```bash
docker-compose ps
```

### Check Container Resources
```bash
docker stats
```

### View Container Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Access Container Shell
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend bash

# Database
docker-compose exec mongo mongosh
```

---

## 🔧 Troubleshooting Dashboard

### Service Won't Start?

1. **Check Docker**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Check Logs**
   ```bash
   docker-compose logs
   ```

3. **Check Ports**
   ```bash
   lsof -i :3000  # Frontend
   lsof -i :5000  # Backend
   lsof -i :27017 # MongoDB
   ```

4. **Restart Services**
   ```bash
   ./start.sh restart
   ```

### Can't Login?

1. Verify credentials: `admin@mazuri.com` / `Admin@123`
2. Check backend logs: `./start.sh logs`
3. Verify database: `docker-compose exec mongo mongosh`

### API Not Responding?

1. Check backend is running: `./start.sh status`
2. Test endpoint: `curl http://localhost:5000/api/health`
3. Check logs: `docker-compose logs backend`

### Database Connection Issues?

1. Verify MongoDB: `docker-compose ps`
2. Check connection: `docker-compose exec mongo mongosh`
3. View logs: `docker-compose logs mongo`

---

## 📈 Performance Monitoring

### CPU & Memory Usage
```bash
docker stats
```

### Database Size
```bash
docker-compose exec mongo mongosh --eval "db.stats()"
```

### API Response Times
```bash
curl -w "Response time: %{time_total}s\n" http://localhost:5000/api/health
```

---

## 🗄️ Data Management

### Backup Database
```bash
docker-compose exec mongo mongodump --out /backup
```

### Restore Database
```bash
docker-compose exec mongo mongorestore /backup
```

### Clear All Data
```bash
./start.sh clean
```

---

## 🚀 Advanced Management

### Rebuild Images
```bash
./start.sh rebuild
```

### Scale Services (if using Swarm/K8s)
```bash
docker-compose up -d --scale backend=3
```

### Update Images
```bash
docker-compose pull
docker-compose up -d
```

### View Environment Variables
```bash
docker-compose exec backend env
docker-compose exec frontend env
```

---

## 📋 Deployment Checklist

- [ ] Docker & Docker Compose installed
- [ ] Ports 3000, 5000, 27017 available
- [ ] .env files configured
- [ ] Services starting successfully
- [ ] Frontend accessible at localhost:3000
- [ ] Backend API responding at localhost:5000
- [ ] Database connected
- [ ] Default admin login works
- [ ] All collections created in database

---

## 📚 Additional Resources

| Resource | Location |
|----------|----------|
| **Complete Guide** | [MASTER_GUIDE.md](MASTER_GUIDE.md) |
| **API Reference** | [API_REFERENCE.md](API_REFERENCE.md) |
| **Installation** | [INSTALLATION.md](INSTALLATION.md) |
| **Deployment** | [DEPLOYMENT.md](DEPLOYMENT.md) |
| **Contributing** | [CONTRIBUTING.md](CONTRIBUTING.md) |
| **Getting Started** | [GETTING_STARTED.md](GETTING_STARTED.md) |
| **Project Overview** | [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) |

---

## 🆘 Quick Help

### Script Commands Summary
```bash
./start.sh start      # 🟢 Start all services
./start.sh stop       # 🔴 Stop all services
./start.sh restart    # 🔄 Restart services
./start.sh status     # 📊 Check status
./start.sh logs       # 📋 View logs
./start.sh clean      # 🗑️ Clean up
./start.sh rebuild    # 🔨 Rebuild images
./start.sh setup      # ⚙️ Initial setup
./start.sh help       # ❓ Show this help
```

### Essential URLs
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000/api
Database:  mongodb://localhost:27017
```

### Default Credentials
```
Email: admin@mazuri.com
Password: Admin@123
```

---

## 📞 Support

- **Documentation**: See [MASTER_GUIDE.md](MASTER_GUIDE.md)
- **Issues**: Report on GitHub
- **Logs**: Check `./start.sh logs`
- **Status**: Run `./start.sh status`

---

**Last Updated:** March 6, 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

🌱 **Made for sustainable waste management**
