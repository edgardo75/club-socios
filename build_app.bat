@echo off
echo ==========================================
echo      INSTALANDO Y CONSTRUYENDO APP
echo ==========================================

echo.
echo [1/4] Instalando dependencias del Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del backend.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Construyendo Backend...
call npm run build
if %errorlevel% neq 0 (
    echo Error al construir el backend.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Instalando dependencias del Frontend...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del frontend.
    pause
    exit /b %errorlevel%
)

echo.
echo [4/4] Construyendo Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Error al construir el frontend.
    pause
    exit /b %errorlevel%
)

cd ..
echo.
echo ==========================================
echo      CONSTRUCCION COMPLETADA CON EXITO
echo ==========================================
echo.
echo Ahora puedes ejecutar 'start_app.bat' para iniciar el sistema.
pause
