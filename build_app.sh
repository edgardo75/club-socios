#!/bin/bash

echo "=========================================="
echo "     INSTALANDO Y CONSTRUYENDO APP"
echo "=========================================="
echo ""

# Backend
echo "[1/4] Instalando dependencias del Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error al instalar dependencias del backend."
    exit 1
fi

echo ""
echo "[2/4] Construyendo Backend..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error al construir el backend."
    exit 1
fi

# Frontend
echo ""
echo "[3/4] Instalando dependencias del Frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error al instalar dependencias del frontend."
    exit 1
fi

echo ""
echo "[4/4] Construyendo Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error al construir el frontend."
    exit 1
fi

cd ..
echo ""
echo "=========================================="
echo "     CONSTRUCCION COMPLETADA CON EXITO"
echo "=========================================="
echo ""
echo "Ahora puedes ejecutar './start_app.sh' para iniciar el sistema."
echo "Nota: Asegúrate de dar permisos de ejecución con: chmod +x start_app.sh"
