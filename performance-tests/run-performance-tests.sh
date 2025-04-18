#!/bin/bash

# Script para ejecutar pruebas de rendimiento con JMeter

# Variables
JMETER_HOME="/path/to/jmeter"
TEST_PLANS_DIR="$(pwd)"
RESULTS_DIR="$(pwd)/results"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Crear directorio de resultados si no existe
mkdir -p "$RESULTS_DIR"

echo -e "${GREEN}Iniciando pruebas de rendimiento...${NC}"

# Obtener un token de autenticación para las pruebas
echo -e "${GREEN}Obteniendo token de autenticación...${NC}"
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r '.token')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Error: No se pudo obtener el token de autenticación.${NC}"
  exit 1
fi

echo -e "${GREEN}Token obtenido correctamente.${NC}"

# Ejecutar prueba de rendimiento para el microservicio de usuarios
echo -e "${GREEN}Ejecutando prueba de rendimiento para el microservicio de usuarios...${NC}"
"$JMETER_HOME/bin/jmeter" -n -t "$TEST_PLANS_DIR/user-service-test-plan.jmx" \
  -l "$RESULTS_DIR/user-service-results_$DATE.jtl" \
  -j "$RESULTS_DIR/user-service-log_$DATE.log" \
  -e -o "$RESULTS_DIR/user-service-report_$DATE"

# Ejecutar prueba de rendimiento para el microservicio de productos
echo -e "${GREEN}Ejecutando prueba de rendimiento para el microservicio de productos...${NC}"
"$JMETER_HOME/bin/jmeter" -n -t "$TEST_PLANS_DIR/product-service-test-plan.jmx" \
  -l "$RESULTS_DIR/product-service-results_$DATE.jtl" \
  -j "$RESULTS_DIR/product-service-log_$DATE.log" \
  -e -o "$RESULTS_DIR/product-service-report_$DATE" \
  -Jtoken="$TOKEN"

echo -e "${GREEN}Pruebas de rendimiento completadas.${NC}"
echo -e "${GREEN}Los resultados están disponibles en: $RESULTS_DIR${NC}" 