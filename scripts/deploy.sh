#!/bin/bash

# Simple deployment script for MiliconStore e-commerce system

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="miliconstore"
REPO_URL="https://github.com/yourusername/milicons-ecommerce.git"
DEPLOY_DIR="/opt/miliconstore"
BACKUP_DIR="/opt/miliconstore/backups"
LOG_FILE="/var/log/miliconstore-deploy.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root${NC}"
  exit 1
fi

# Log function
log() {
  echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

# Error function
error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
  exit 1
}

# Check if Docker is running
docker_running() {
  if ! docker info > /dev/null 2>&1; then
    return 1
  else
    return 0
  fi
}

# Create necessary directories
create_dirs() {
  log "Creating necessary directories..."
  mkdir -p "$DEPLOY_DIR"
  mkdir -p "$BACKUP_DIR"
  mkdir -p "$(dirname "$LOG_FILE")"
  touch "$LOG_FILE"
  chmod 644 "$LOG_FILE"
}

# Create backup of current deployment
backup() {
  if [ -d "$DEPLOY_DIR/current" ]; then
    log "Creating backup of current deployment..."
    tar -czf "$BACKUP_DIR/${APP_NAME}_${TIMESTAMP}.tar.gz" -C "$DEPLOY_DIR" current
    log "Backup created at $BACKUP_DIR/${APP_NAME}_${TIMESTAMP}.tar.gz"
  else
    log "No current deployment found, skipping backup."
  fi
}

# Deploy the application
deploy() {
  log "Starting deployment..."
  
  # Check if Docker is running
  if ! docker_running; then
    error "Docker is not running. Please start Docker and try again."
  fi
  
  # Create temp directory
  TEMP_DIR=$(mktemp -d)
  log "Created temporary directory: $TEMP_DIR"

  # Clone repository
  log "Cloning repository..."
  git clone --depth 1 "$REPO_URL" "$TEMP_DIR" || error "Failed to clone repository"
  
  # Stop current services
  if [ -f "$DEPLOY_DIR/current/docker-compose.yml" ]; then
    log "Stopping current services..."
    (cd "$DEPLOY_DIR/current" && docker-compose down) || log "Warning: Failed to stop services"
  fi
  
  # Create release directory
  RELEASE_DIR="$DEPLOY_DIR/releases/${APP_NAME}_${TIMESTAMP}"
  mkdir -p "$RELEASE_DIR"
  
  # Copy files to release directory
  log "Copying files to release directory..."
  cp -a "$TEMP_DIR/." "$RELEASE_DIR/"
  
  # Create symlink to current
  log "Updating current symlink..."
  ln -sfn "$RELEASE_DIR" "$DEPLOY_DIR/current"
  
  # Start services
  log "Starting services..."
  (cd "$DEPLOY_DIR/current" && docker-compose up -d) || error "Failed to start services"
  
  # Cleanup
  log "Cleaning up..."
  rm -rf "$TEMP_DIR"
  
  # Keep only the 5 most recent backups
  log "Removing old backups..."
  ls -t "$BACKUP_DIR" | tail -n +6 | xargs -I {} rm -f "$BACKUP_DIR/{}"
  
  # Keep only the 5 most recent releases
  log "Removing old releases..."
  ls -t "$DEPLOY_DIR/releases" | tail -n +6 | xargs -I {} rm -rf "$DEPLOY_DIR/releases/{}"
  
  log "Deployment completed successfully!"
}

# Main execution
echo -e "${GREEN}===== MiliconStore Deployment Script =====${NC}"
create_dirs
backup
deploy
echo -e "${GREEN}===== Deployment Completed =====${NC}" 