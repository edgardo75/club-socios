@echo off
cd /d "c:\Users\usuario\club-socios"
echo Iniciando Club de Socios...
call pm2 start ecosystem.config.js
call pm2 save
echo Aplicacion iniciada correctamente.
start http://localhost:3001
timeout /t 5
