# Getting Started with Mazuri

Welcome to the Mazuri Waste Management and Control System! This guide will help you get started quickly.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose installed

### Step 1: Start the Application
```bash
cd /workspaces/MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM
docker-compose up -d
```

### Step 2: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:27017

### Step 3: Login
- **Email**: admin@mazuri.com
- **Password**: Admin@123

## 📚 Documentation Overview

### For Users
- **README.md** - Get overview of features and architecture
- **PROJECT_OVERVIEW.md** - Quick reference and project status
- **INSTALLATION.md** - Detailed setup instructions

### For Developers
- **API_REFERENCE.md** - Complete API documentation
- **DEPLOYMENT.md** - Production deployment guide
- **CONTRIBUTING.md** - Contribution guidelines

## 🎯 What Can You Do?

### Dashboard
View statistics and key metrics:
- Total waste collected
- Collection count
- Waste distribution by type

### Waste Management
- Create new waste entries
- Filter by status, source, and type
- Track waste from creation to disposal
- View waste statistics

### Collections
- Schedule waste collections
- Assign collectors
- Update collection status
- Track collection statistics

### Reports
- Generate reports (daily, weekly, monthly, quarterly, annual)
- View waste analysis
- Get insights and recommendations
- Export report data

### User Management (Admin Only)
- Create and manage users
- Assign roles (Admin, Waste Manager, Collector, Supervisor, Viewer)
- Change user permissions
- Deactivate users

## 📊 Available Roles

| Role | Can Do |
|------|--------|
| **Admin** | Everything - full system access |
| **Waste Manager** | Create waste, schedule collections, view reports |
| **Collector** | View assigned collections, update status |
| **Supervisor** | Monitor collections, generate reports |
| **Viewer** | View data (read-only) |

## 🔧 Common Tasks

### Change Login Credentials
After first login with default credentials:

1. Create a new admin user via the API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "youremail@example.com",
    "password": "YourPassword123!",
    "role": "admin"
  }'
```

2. Logout and login with your new credentials

### Add New Waste Entry
1. Go to Waste menu → "Add New Waste"
2. Fill in the details:
   - Source (residential, commercial, etc.)
   - Location
   - Waste Type
   - Quantity
   - Pickup Date/Time
   - Contact Person
3. Click Save

### Schedule Collection
1. Go to Collections
2. Click "New Collection"
3. Select waste entry
4. Select collector
5. Enter collection date and location
6. Click Create

### Generate Report
1. Go to Reports
2. Click "Generate Report"
3. Select report type and date range
4. Generate report
5. View insights and statistics

## 🔐 Security Notes

### Change JWT Secret (Production)
Edit backend/.env:
```env
JWT_SECRET=generate_a_long_random_string_here
```

### Change MongoDB Password (Production)
Edit docker-compose.yml and backend/.env:
```env
MONGODB_PASSWORD=your_secure_password
```

### Enable HTTPS (Production)
Follow DEPLOYMENT.md for SSL/TLS setup

## 🐛 Troubleshooting

### Application won't start
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart

# Full clean restart
docker-compose down -v
docker-compose up -d
```

### Can't login
- Verify backend is running: http://localhost:5000/api/health
- Check email and password
- Try admin credentials: admin@mazuri.com / Admin@123

### Port conflicts
```bash
# Change ports in docker-compose.yml
# Or kill existing processes:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📞 Need Help?

1. **Review Documentation**
   - README.md - Full features
   - API_REFERENCE.md - API details
   - INSTALLATION.md - Setup help
   - DEPLOYMENT.md - Production guide

2. **Check Logs**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs mongo
   ```

3. **Test Connectivity**
   ```bash
   curl http://localhost:5000/api/health
   curl http://localhost:3000
   ```

## 🔄 Development Workflow

### Without Docker

**Backend**: 
```bash
cd backend
npm install
npm run dev
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
npm start
```

### With Docker
```bash
# Rebuild after code changes
docker-compose up -d --build

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📦 Project Structure Summary

```
─ Backend (Express.js + MongoDB)
  ├─ 35+ API endpoints
  ├─ User authentication
  ├─ 4 data models
  └─ Complete CRUD operations

─ Frontend (React)
  ├─ 7 main pages
  ├─ Dashboard with charts
  ├─ Forms for data entry
  └─ Real-time status updates

─ Database (MongoDB)
  ├─ Users
  ├─ Waste entries
  ├─ Collections
  └─ Reports

─ Documentation
  ├─ README - Features & overview
  ├─ API_REFERENCE - Endpoint docs
  ├─ INSTALLATION - Setup guide
  ├─ DEPLOYMENT - Production guide
  └─ CONTRIBUTING - Dev guidelines
```

## ✅ Next Steps

1. **Explore the Dashboard**
   - Familiarize yourself with the UI
   - Review the statistics

2. **Create Test Data**
   - Add some waste entries
   - Create collections
   - Generate reports

3. **Test Different Roles**
   - Create users with different roles
   - Experience the role-based access control

4. **Review API**
   - Check API_REFERENCE.md
   - Try API endpoints with curl
   - Test with Postman

5. **Setup Production** (When Ready)
   - Follow DEPLOYMENT.md
   - Configure SSL/TLS
   - Set strong passwords
   - Enable backups

## 🌟 Features Highlight

✅ **Complete Waste Lifecycle**
- From creation to final disposal
- Status tracking at each stage

✅ **Real-time Monitoring**
- Live collection status
- Dashboard statistics
- Performance metrics

✅ **Comprehensive Analytics**
- Waste distribution reports
- Collection performance
- Type-based analysis

✅ **Role-Based Access**
- 5 predefined roles
- Fine-grained permissions
- User management

✅ **Ready for Deployment**
- Docker containerized
- Environment configuration
- Scalable architecture

## 🎓 Learning Resources

- **Understand the API**: Read API_REFERENCE.md
- **Learn Deployment**: Check DEPLOYMENT.md
- **Contribute Code**: See CONTRIBUTING.md
- **Database Schema**: Review backend/models/

## 🚀 Performance Tips

1. **Use Filters** - Filter waste by status to reduce results
2. **Pagination** - Will be implemented for large datasets
3. **Caching** - Consider Redis for frequently accessed data
4. **Indexes** - Database is already optimized with indexes

## 📝 Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Contact the team: support@mazuri.com

---

**You're all set! Happy waste managing! 🌱**

Start with the dashboard and explore each feature. The UI is intuitive and self-explanatory.
