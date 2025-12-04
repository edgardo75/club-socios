#!/bin/bash

echo "Iniciando Club de Socios..."

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save

echo "Aplicacion iniciada correctamente."
echo "Puedes acceder en: http://localhost:3001"
