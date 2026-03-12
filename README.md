# 🌱 Mazuri Waste Management and Control System

A comprehensive web-based platform designed to streamline waste collection, monitoring, and disposal. It automates scheduling, tracks waste sources, and generates reports, reducing manual errors, enhancing efficiency, and promoting environmental sustainability in communities and institutions.

## Features

- **Waste Management**: Log, track, and manage waste from various sources (residential, commercial, industrial, institutional, agricultural)
- **Waste Types**: Support for multiple waste types (organic, recyclable, hazardous, electronic, mixed)
- **Collection Scheduling**: Automated scheduling of waste collection with assignment to collectors
- **M-Pesa Collection Payments**: Trigger STK Push payments for each collection and track payment status
- **User Management**: Role-based access control with multiple user roles (Admin, Waste Manager, Collector, Supervisor, Viewer)
- **Analytics & Reporting**: Generate daily, weekly, monthly, quarterly, and annual reports with insights
- **Real-time Tracking**: Monitor waste collection status in real-time
- **Responsive Dashboard**: Comprehensive dashboard with key metrics and statistics

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React.js
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: CSS3

### DevOps
- **Containerization**: Docker & Docker Compose
- **MongoDB**: Document Database

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Start the Application

```bash
# Navigate to project directory
cd MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Login Credentials
- **Email**: admin@mazuri.com
- **Password**: Admin@123

## Project Structure

```
MAZURI-WASTE-MANAGEMENT-AND-CONTROL-SYSTEM/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── README.md
├── INSTALLATION.md
└── API_REFERENCE.md
```

## Documentation

- **[README.md](README.md)** - Full project documentation and features
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup and installation guide
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API endpoint documentation

## Key Features

### 1. Waste Management
- Create and manage waste entries from various sources
- Track waste types and quantities
- Schedule pickups automatically
- Monitor waste status (pending → scheduled → collected → processed → disposed)

### 2. Collection Management
- Assign waste collections to collectors
- Track collection progress in real-time
- Record actual quantities collected
- Add location and vehicle information

### 3. Reporting & Analytics
- Generate comprehensive reports (daily, weekly, monthly, quarterly, annual)
- View waste distribution by type and source
- Track completion rates
- Get actionable insights and recommendations

### 4. User Management
- Create and manage user accounts
- Assign roles with specific permissions
- Track user activity and assignments
- Deactivate inactive users

### 5. Dashboard
- Overview of total waste collected
- Collection statistics
- Waste type distribution
- Real-time status updates

## API Quick Reference

### Authentication
```bash
# Register
POST /api/auth/register

# Login
POST /api/auth/login

# Get current user
GET /api/auth/me
```

### Waste Management
```bash
# GET /api/waste              - List all waste
# POST /api/waste             - Create waste entry
# GET /api/waste/:id          - Get waste details
# PUT /api/waste/:id          - Update waste
# DELETE /api/waste/:id       - Delete waste
# GET /api/waste/stats        - Get statistics
```

### Collections
```bash
# GET /api/collections        - List collections
# POST /api/collections       - Create collection
# PUT /api/collections/:id    - Update collection
# DELETE /api/collections/:id - Delete collection
# GET /api/collections/stats  - Get statistics
# POST /api/collections/:id/payment/initiate - Send M-Pesa STK push
# GET /api/collections/:id/payment           - Check payment status
# POST /api/collections/payment/callback     - M-Pesa callback endpoint
```

### Reports
```bash
# GET /api/reports            - List reports
# POST /api/reports           - Generate report
# GET /api/reports/:id        - Get report details
# PUT /api/reports/:id        - Update report
```

### Users
```bash
# GET /api/users              - List users
# GET /api/users/:id          - Get user details
# PUT /api/users/:id          - Update user
# PATCH /api/users/:id/role   - Change user role
# DELETE /api/users/:id       - Delete user
```

## User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, configuration |
| **Waste Manager** | Create/edit waste, schedule collections, view reports |
| **Collector** | View assigned collections, update status |
| **Supervisor** | Monitor collections, generate reports |
| **Viewer** | View-only access |

## Development Setup

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild
docker-compose up -d --build
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://admin:password@mongo:27017/mazuri-waste-management
PORT=5000
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

# Collection payment pricing
COLLECTION_RATE_PER_UNIT=50

# M-Pesa Daraja config
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=https://your-public-domain/api/collections/payment/callback
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## M-Pesa Integration Notes

- Every collection now carries a payment object with amount and status (`unpaid`, `pending`, `paid`, `failed`).
- A collection cannot be marked `completed` until payment status is `paid`.
- In the Collections page, use the `Pay with M-Pesa` action to prompt for amount and phone number and send an STK push.
- For local callback testing, expose your backend URL using a tunnel tool (for example ngrok) and set `MPESA_CALLBACK_URL` to that public URL.

## Database Models

- **User** - User accounts with roles and permissions
- **Waste** - Waste entries from various sources
- **Collection** - Waste collection records and status
- **Report** - Generated reports with analytics

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Error handling middleware

## Performance Features

- Database indexing
- Efficient queries
- Async/await error handling
- Request validation
- Response caching ready

## Upcoming Features

- 📅 Email/SMS notifications
- 📍 Google Maps integration
- 📊 Advanced analytics dashboards
- 🔔 Real-time push notifications
- 🖼️ Image upload for documentation
- 🔐 Two-factor authentication
- 📱 Mobile app
- 🤖 AI-powered waste classification

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Create a pull request

## Support & Issues

For support or to report issues:
- 📧 Email: support@mazuri.com
- 🐛 GitHub Issues: Create an issue on the repository

## License

This project is licensed under the MIT License.

## Team

**Developed by**: Mazuri Team

---

**Made with 🌱 for sustainable waste management**

For detailed documentation, see:
- [Full Documentation](README.md)
- [Installation Guide](INSTALLATION.md)
- [API Reference](API_REFERENCE.md)
