# Deployment Guide

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- SSL certificate (for HTTPS)
- Domain name
- Cloud provider account (AWS, GCP, Azure, etc.)

## Docker Deployment

### 1. Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### 2. Running in Production

```bash
# Start in detached mode
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Environment Configuration

Create `.env` file in root directory:

```env
# Database
MONGODB_URI=mongodb://admin:password@mongo:27017/mazuri-waste-management
MONGODB_USER=admin
MONGODB_PASSWORD=set_secure_password

# Backend
PORT=5000
NODE_ENV=production
JWT_SECRET=generate_long_random_string
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com

# Frontend
REACT_APP_API_URL=https://yourdomain.com/api
```

## Cloud Deployment

### AWS Deployment

#### Step 1: ECR Setup

```bash
# Create ECR repositories
aws ecr create-repository --repository-name mazuri-backend
aws ecr create-repository --repository-name mazuri-frontend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t mazuri-backend:latest backend/
docker tag mazuri-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/mazuri-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/mazuri-backend:latest
```

#### Step 2: ECS Deployment

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name mazuri-cluster

# Register task definitions
aws ecs register-task-definition --cli-input-json file://backend-task-def.json
aws ecs register-task-definition --cli-input-json file://frontend-task-def.json

# Create services
aws ecs create-service --cluster mazuri-cluster --service-name backend --task-definition mazuri-backend:1 --desired-count 1
aws ecs create-service --cluster mazuri-cluster --service-name frontend --task-definition mazuri-frontend:1 --desired-count 1
```

#### Step 3: Database Setup (RDS)

```bash
# Create RDS instance for MongoDB Atlas or DocumentDB
aws docdb create-db-cluster --db-cluster-identifier mazuri-cluster --master-username admin --master-user-password password

# Update connection string in .env
```

### Google Cloud Deployment

#### Step 1: Set up GCP

```bash
gcloud init
gcloud config set project PROJECT_ID
```

#### Step 2: Container Registry

```bash
# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Build and push
docker build -t gcr.io/PROJECT_ID/mazuri-backend:latest backend/
docker push gcr.io/PROJECT_ID/mazuri-backend:latest

docker build -t gcr.io/PROJECT_ID/mazuri-frontend:latest frontend/
docker push gcr.io/PROJECT_ID/mazuri-frontend:latest
```

#### Step 3: Cloud Run Deployment

```bash
# Deploy backend
gcloud run deploy mazuri-backend \
  --image gcr.io/PROJECT_ID/mazuri-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend
gcloud run deploy mazuri-frontend \
  --image gcr.io/PROJECT_ID/mazuri-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Step 4: Cloud Firestore/MongoDB Atlas

```bash
# Use MongoDB Atlas for managed database
# Or use Firestore for GCP-native solution
```

### Azure Deployment

#### Step 1: Create Resources

```bash
# Create resource group
az group create --name mazuri-rg --location eastus

# Create container registry
az acr create --resource-group mazuri-rg --name mazuriregistry --sku Basic

# Get login credentials
az acr login --name mazuriregistry
```

#### Step 2: Push Images

```bash
# Build and push
docker build -t mazuriregistry.azurecr.io/mazuri-backend:latest backend/
docker push mazuriregistry.azurecr.io/mazuri-backend:latest

docker build -t mazuriregistry.azurecr.io/mazuri-frontend:latest frontend/
docker push mazuriregistry.azurecr.io/mazuri-frontend:latest
```

#### Step 3: Deploy to Container Instances

```bash
# Deploy backend
az container create --resource-group mazuri-rg \
  --name mazuri-backend \
  --image mazuriregistry.azurecr.io/mazuri-backend:latest \
  --ports 5000 \
  --environment-variables NODE_ENV=production

# Deploy frontend
az container create --resource-group mazuri-rg \
  --name mazuri-frontend \
  --image mazuriregistry.azurecr.io/mazuri-frontend:latest \
  --ports 3000
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster
- kubectl installed
- kubectl configured to access cluster

### Step 1: Create Namespace

```bash
kubectl create namespace mazuri
```

### Step 2: Create ConfigMaps and Secrets

```bash
# Create configmap
kubectl create configmap mazuri-config \
  --from-literal=NODE_ENV=production \
  --from-literal=FRONTEND_URL=https://yourdomain.com \
  -n mazuri

# Create secret
kubectl create secret generic mazuri-secrets \
  --from-literal=JWT_SECRET=your_secret \
  --from-literal=MONGODB_URI=mongodb://... \
  -n mazuri
```

### Step 3: Create Deployments

```bash
# Save this as deployment.yaml
kubectl apply -f deployment.yaml -n mazuri

# Roll out deployment
kubectl rollout status deployment/mazuri-backend -n mazuri
kubectl rollout status deployment/mazuri-frontend -n mazuri
```

### Step 4: Create Services

```bash
# Expose services
kubectl expose deployment mazuri-backend --type=LoadBalancer --port=5000 -n mazuri
kubectl expose deployment mazuri-frontend --type=LoadBalancer --port=3000 -n mazuri
```

## SSL/TLS Setup

### Using Nginx and Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/mazuri

# Enable site
sudo ln -s /etc/nginx/sites-available/mazuri /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Auto-renew certificates
sudo certbot renew --dry-run
```

### Nginx Configuration

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

## Monitoring & Logging

### Docker Compose Monitoring

```bash
# View real-time resource usage
docker-compose stats

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Save logs
docker-compose logs > logs.txt
```

### Application Monitoring

```bash
# Health check
curl http://localhost:5000/api/health

# Monitor endpoint
watch -n 1 'curl -s http://localhost:5000/api/health | jq'
```

## Backup Strategy

### MongoDB Backup

```bash
# Create backup
docker-compose exec mongo mongodump --out /backup

# Restore backup
docker-compose exec mongo mongorestore /backup
```

### Automated Backups

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$DATE"

mkdir -p "$BACKUP_PATH"
docker-compose exec -T mongo mongodump --out "$BACKUP_PATH"

# Keep only last 7 days
find "$BACKUP_DIR" -type d -mtime +7 -exec rm -rf {} \;

# Schedule with cron
0 2 * * * /path/to/backup.sh
```

## Performance Optimization

### Database Optimization

```bash
# Create indexes
db.waste.createIndex({ status: 1 })
db.waste.createIndex({ source: 1 })
db.collections.createIndex({ collectorId: 1 })
```

### Caching Strategy

- Implement Redis for caching
- Cache expensive queries
- Cache static assets

### Load Balancing

```bash
# Use Nginx upstream block
upstream backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend containers
docker-compose up --scale backend=3

# Scale frontend containers
docker-compose up --scale frontend=2
```

### Database Scaling

- MongoDB Replication Set
- MongoDB Sharding
- Use MongoDB Atlas for managed scaling

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and rotate logs
- Monitor disk usage
- Check backup integrity
- Update SSL certificates

### Zero-Downtime Deployments

```bash
# Blue-green deployment
# Deploy new version to green environment
# Run tests
# Switch traffic to green
# Keep blue as rollback
```

## Troubleshooting

### Common Issues

**Port already in use**
```bash
lsof -i :3000
kill -9 <PID>
```

**Container not starting**
```bash
docker-compose logs backend
docker-compose exec backend bash
```

**Database connection failed**
```bash
docker-compose exec mongo mongo --eval "db.adminCommand('ping')"
```

## Disaster Recovery

### Recovery Plan

1. Identify the issue
2. Check backups are available
3. Document the issue
4. Restore from backup if needed
5. Verify restoration
6. Update documentation

---

For more information, see the main README.md and INSTALLATION.md
