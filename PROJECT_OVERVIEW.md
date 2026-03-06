# Project Overview

## Mazuri Waste Management and Control System

A complete, production-ready MERN stack application for waste management automation.

## What's Included

### ✅ Backend (Express.js + MongoDB)
- Complete REST API with 35+ endpoints
- User authentication with JWT
- Role-based access control
- Waste & collection management
- Analytics & reporting
- Error handling & validation
- CORS configuration

### ✅ Frontend (React.js)
- 7 main pages with full functionality
- Responsive UI components
- Login/authentication flow
- Dashboard with statistics
- Waste & collection management
- Reports generation
- User management
- Real-time status updates

### ✅ Database (MongoDB)
- 4 Mongoose models
- Proper indexing
- Data validation
- Automated ID generation

### ✅ DevOps (Docker)
- Docker containers for backend, frontend, MongoDB
- Docker Compose orchestration
- Multi-service coordination
- Environment configuration

### ✅ Documentation
- Comprehensive README
- Installation guide
- API reference
- Deployment guide
- Contributing guidelines

## Quick Start

### Option 1: Docker (Recommended)
```bash
cd /workspaces/MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM
docker-compose up -d
# Access: http://localhost:3000
```

### Option 2: Manual Development
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm start
```

**Login**: admin@mazuri.com / Admin@123

## File Structure

```
├── backend/                    # Node.js + Express API
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth, validation, errors
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── server.js             # Entry point
│   └── package.json          # Dependencies
│
├── frontend/                  # React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   └── App.js           # Root component
│   └── package.json         # Dependencies
│
├── docker-compose.yml         # Multi-container setup
├── README.md                 # Main documentation
├── INSTALLATION.md           # Setup guide
├── API_REFERENCE.md          # API endpoints
├── DEPLOYMENT.md             # Production deployment
├── CONTRIBUTING.md           # Contribution guidelines
└── LICENSE                   # MIT License
```

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Waste Management
- `GET /api/waste` - List waste
- `POST /api/waste` - Create waste
- `PUT /api/waste/:id` - Update waste
- `DELETE /api/waste/:id` - Delete waste
- `GET /api/waste/stats` - Get statistics

### Collections
- `GET /api/collections` - List collections
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `GET /api/collections/stats` - Get statistics

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Generate report
- `GET /api/reports/:id` - Get report details

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/role` - Change role
- `DELETE /api/users/:id` - Delete user

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access |
| Waste Manager | Create/edit waste, view reports |
| Collector | View assigned collections, update status |
| Supervisor | Monitor collections, generate reports |
| Viewer | Read-only access |

## Technologies

### Backend
- Node.js 18
- Express.js
- MongoDB
- JWT
- bcryptjs

### Frontend
- React 18
- React Router v6
- Axios
- Chart.js
- CSS3

### DevOps
- Docker
- Docker Compose

## Environment Variables

### Backend
```env
MONGODB_URI=mongodb://admin:password@mongo:27017/mazuri
PORT=5000
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## npm Scripts

### Backend
```bash
npm start      # Production start
npm run dev    # Development with nodemon
npm test       # Run tests
```

### Frontend
```bash
npm start      # Development server
npm build      # Production build
npm test       # Run tests
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose up -d --build

# Remove everything
docker-compose down -v
```

## Default Credentials

- **Email**: admin@mazuri.com
- **Password**: Admin@123
- **Role**: Admin (Full access)

## Key Features

✅ Complete waste lifecycle tracking
✅ Real-time collection monitoring
✅ Automated report generation
✅ Role-based access control
✅ Multi-user support
✅ RESTful API
✅ Responsive UI
✅ Docker containerization
✅ MongoDB persistence
✅ JWT authentication
✅ Error handling
✅ Input validation

## Upcoming Enhancements

- 📧 Email/SMS notifications
- 📍 GPS tracking integration
- 📊 Advanced analytics dashboard
- 🔔 Real-time notifications
- 🎥 Photo upload support
- 🔐 Two-factor authentication
- 📱 Mobile app (React Native)
- 🤖 AI waste classification

## Support

- 📖 Check documentation files
- 🐛 Report issues on GitHub
- 💬 Contact: support@mazuri.com
- 📚 API Reference: API_REFERENCE.md
- 🚀 Deployment: DEPLOYMENT.md

## Project Status

✅ **Complete and Ready for Deployment**

All core functionality implemented, tested, and documented. Ready for:
- Local development
- Docker deployment
- Cloud deployment
- Production use

## Next Steps

1. **Run the system**: `docker-compose up -d`
2. **Access frontend**: http://localhost:3000
3. **Test API**: http://localhost:5000/api/health
4. **Read docs**: Review README.md, API_REFERENCE.md
5. **Customize**: Modify environment variables and configurations
6. **Deploy**: Follow DEPLOYMENT.md for production setup

---

**Made with 🌱 for sustainable waste management**

Last Updated: March 2024
