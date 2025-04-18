#!/bin/bash

# Simple helper script for Docker operations

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display usage
function display_help {
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  $0 [command]"
    echo
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}start${NC}        Start all services"
    echo -e "  ${GREEN}stop${NC}         Stop all services"
    echo -e "  ${GREEN}restart${NC}      Restart all services"
    echo -e "  ${GREEN}status${NC}       Check status of services"
    echo -e "  ${GREEN}logs [service]${NC} Show logs (optional: specific service)"
    echo -e "  ${GREEN}rebuild${NC}      Rebuild and restart services"
    echo -e "  ${GREEN}clean${NC}        Remove all containers and volumes"
}

# Check if Docker is running
function check_docker {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
}

# Base directory (where docker-compose.yml is located)
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BASE_DIR"

# Check command
case "$1" in
    start)
        check_docker
        echo -e "${GREEN}Starting all services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Services started successfully${NC}"
        ;;
    stop)
        check_docker
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down
        echo -e "${GREEN}Services stopped successfully${NC}"
        ;;
    restart)
        check_docker
        echo -e "${YELLOW}Restarting all services...${NC}"
        docker-compose down
        docker-compose up -d
        echo -e "${GREEN}Services restarted successfully${NC}"
        ;;
    status)
        check_docker
        echo -e "${GREEN}Services status:${NC}"
        docker-compose ps
        ;;
    logs)
        check_docker
        if [ -z "$2" ]; then
            echo -e "${GREEN}Showing logs for all services:${NC}"
            docker-compose logs --tail=100 -f
        else
            echo -e "${GREEN}Showing logs for $2:${NC}"
            docker-compose logs --tail=100 -f "$2"
        fi
        ;;
    rebuild)
        check_docker
        echo -e "${YELLOW}Rebuilding and restarting services...${NC}"
        docker-compose down
        docker-compose build
        docker-compose up -d
        echo -e "${GREEN}Services rebuilt and restarted successfully${NC}"
        ;;
    clean)
        check_docker
        echo -e "${RED}Removing all containers and volumes...${NC}"
        docker-compose down -v
        echo -e "${GREEN}Clean completed${NC}"
        ;;
    *)
        display_help
        ;;
esac 