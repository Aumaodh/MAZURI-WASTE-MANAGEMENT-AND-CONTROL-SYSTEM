#!/bin/bash

# Mazuri Waste Management System - Quick Start Script
# This script simplifies system startup and management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  Mazuri Waste Management System${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

show_menu() {
  echo -e "\n${BLUE}Available Commands:${NC}\n"
  echo "  ./start.sh start        - Start all services"
  echo "  ./start.sh stop         - Stop all services"
  echo "  ./start.sh restart      - Restart all services"
  echo "  ./start.sh logs         - View service logs"
  echo "  ./start.sh status       - Check service status"
  echo "  ./start.sh clean        - Clean up containers and volumes"
  echo "  ./start.sh rebuild      - Rebuild images"
  echo "  ./start.sh setup        - Initial setup"
  echo "  ./start.sh help         - Show this menu"
  echo ""
}

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    print_info "Please install Docker from https://www.docker.com"
    exit 1
  fi
  print_success "Docker is installed"
}

check_docker_compose() {
  if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed"
    print_info "Please install Docker Compose"
    exit 1
  fi
  print_success "Docker Compose is installed"
}

# Start services
start_services() {
  print_header
  print_info "Starting Mazuri services..."
  
  check_docker
  check_docker_compose
  
  docker-compose up -d
  
  print_success "Services started!"
  print_info "Waiting for services to be ready..."
  sleep 5
  
  # Check service health
  check_health
}

# Stop services
stop_services() {
  print_header
  print_info "Stopping Mazuri services..."
  
  docker-compose down
  
  print_success "Services stopped!"
}

# Restart services
restart_services() {
  print_header
  print_info "Restarting Mazuri services..."
  
  stop_services
  sleep 2
  start_services
}

# View logs
view_logs() {
  print_header
  echo -e "${YELLOW}Showing live logs (Ctrl+C to exit)${NC}\n"
  docker-compose logs -f
}

# Check service status
check_status() {
  print_header
  print_info "Checking service status...\n"
  
  docker-compose ps
  
  echo ""
  print_info "Testing connectivity..."
  
  # Test Frontend
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend: http://localhost:3000"
  else
    print_error "Frontend: Not responding"
  fi
  
  # Test Backend
  if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend: http://localhost:5000/api"
  else
    print_error "Backend: Not responding"
  fi
  
  # Test Database
  if docker-compose exec -T mongo ping -c 1 localhost > /dev/null 2>&1; then
    print_success "Database: mongodb://localhost:27017"
  else
    print_error "Database: Not responding"
  fi
  
  echo ""
}

# Check health
check_health() {
  print_info "Checking service health...\n"
  
  # Give services time to start
  sleep 3
  
  # Frontend health
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is healthy"
  else
    print_error "Frontend is not ready yet"
  fi
  
  # Backend health
  if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend is healthy"
  else
    print_error "Backend is not ready yet"
  fi
  
  echo ""
  print_success "System is ready!"
  print_info "Access the system at: http://localhost:3000"
  print_info "API available at: http://localhost:5000/api"
  print_info "Default credentials: admin@mazuri.com / Admin@123"
  echo ""
}

# Clean up
clean_system() {
  print_header
  print_info "Cleaning up containers and volumes..."
  
  read -p "Are you sure? This will delete all data. (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    print_success "System cleaned!"
  else
    print_info "Cleanup cancelled"
  fi
}

# Rebuild images
rebuild_images() {
  print_header
  print_info "Rebuilding Docker images..."
  
  docker-compose build --no-cache
  
  print_success "Images rebuilt!"
  print_info "Run './start.sh start' to start services"
}

# Setup
initial_setup() {
  print_header
  print_info "Setting up Mazuri Waste Management System..."
  
  check_docker
  check_docker_compose
  
  # Check if .env files exist
  if [ ! -f "backend/.env" ]; then
    print_info "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    print_success "backend/.env created"
  fi
  
  if [ ! -f "frontend/.env" ]; then
    print_info "Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    print_success "frontend/.env created"
  fi
  
  print_success "Setup complete!"
  print_info "Run './start.sh start' to start the system"
}

# Main script
main() {
  case "${1:-help}" in
    start)
      start_services
      ;;
    stop)
      stop_services
      ;;
    restart)
      restart_services
      ;;
    logs)
      view_logs
      ;;
    status)
      check_status
      ;;
    clean)
      clean_system
      ;;
    rebuild)
      rebuild_images
      ;;
    setup)
      initial_setup
      ;;
    help)
      print_header
      show_menu
      ;;
    *)
      print_error "Unknown command: $1"
      show_menu
      exit 1
      ;;
  esac
}

# Run main function
main "$@"
