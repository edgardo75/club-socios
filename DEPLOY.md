# Guía de Instalación y Despliegue - Club Socios

Esta guía detalla los pasos para instalar la aplicación en un nuevo equipo.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en el nuevo equipo:

1.  **Node.js**: Versión 18 o superior (LTS recomendada).
    *   Descargar: [https://nodejs.org/](https://nodejs.org/)
2.  **Git** (Opcional, si vas a clonar el repositorio):
    *   Descargar: [https://git-scm.com/](https://git-scm.com/)

## Opción 1: Instalación desde Cero (Recomendada)

Si tienes el código fuente (por ejemplo, en un pendrive o repositorio git):

1.  **Copiar el código**: Copia la carpeta del proyecto `club-socios` al nuevo equipo (ej: `C:\club-socios`).
2.  **Abrir una terminal**: Abre PowerShell o CMD y navega a la carpeta.
    ```powershell
    cd C:\club-socios
    ```
3.  **Instalar dependencias**:
    Ejecuta el siguiente script para instalar todo automáticamente:
    ```powershell
    npm install
    cd frontend && npm install && cd ..
    cd backend && npm install && cd ..
    ```
4.  **Configurar entorno**:
    *   Asegúrate de que existan los archivos `.env` en `frontend` y `backend`. Si no existen, créalos copiando los ejemplos (o usa los valores por defecto).
    *   **Backend (.env)**: `PORT=3000`
    *   **Frontend (.env)**: `NEXT_PUBLIC_API_URL=http://localhost:3000`

5.  **Construir la aplicación**:
    Para optimizar el rendimiento, compila la aplicación:
    ```powershell
    cd frontend && npm run build && cd ..
    cd backend && npm run build && cd ..
    ```

6.  **Iniciar la aplicación**:
    Puedes usar el script de inicio rápido si lo copiaste, o usar PM2.
    
    *   **Instalar PM2 globalmente** (si no lo tienes):
        ```powershell
        npm install -g pm2
        ```
    *   **Iniciar servicios**:
        ```powershell
        pm2 start ecosystem.config.js
        pm2 save
        pm2 startup
        ```

## Opción 2: Migrar con Datos Existentes

Si quieres mover la aplicación **CON** la base de datos actual:

1.  Sigue los pasos de la **Opción 1**.
2.  **Antes de iniciar**, copia los siguientes archivos/carpetas del equipo viejo al nuevo:
    *   `backend/data/club.db` (Base de datos)
    *   `backend/uploads/` (Fotos de los socios)
3.  Pégalos en las mismas ubicaciones en el nuevo equipo.

## Solución de Problemas Comunes

*   **Error de conexión**: Verifica que el backend esté corriendo (`pm2 status`).
*   **Puerto ocupado**: Asegúrate de que no haya otros programas usando los puertos 3000 o 3001.
*   **Error de SQLite**: Si tienes errores de `better-sqlite3` al cambiar de sistema operativo o versión de Node, ejecuta:
    ```powershell
    cd backend
    npm rebuild better-sqlite3
    ```

## Comandos Útiles

*   `pm2 status`: Ver estado de los servicios.
*   `pm2 logs`: Ver registros de errores.
*   `pm2 restart all`: Reiniciar todo.
*   `pm2 stop all`: Detener todo.

## Acceso desde otros equipos (Red Local)

Sí, es posible acceder a la aplicación desde otros equipos conectados a la misma red Wi-Fi o cableada. El equipo donde instalaste la aplicación actuará como "Servidor".

### Pasos para configurar el acceso en red:

1.  **Averiguar la IP del Servidor**:
    *   En el equipo servidor, abre una terminal y escribe `ipconfig`.
    *   Busca la dirección IPv4 (ejemplo: `192.168.1.15`).

2.  **Configurar el Frontend**:
    *   Edita el archivo `frontend/.env`.
    *   Cambia `NEXT_PUBLIC_API_URL` para usar la IP en lugar de localhost:
        ```env
        NEXT_PUBLIC_API_URL=http://192.168.1.15:3000
        ```
    *   **Importante**: Debes reconstruir el frontend para que este cambio surta efecto:
        ```powershell
        cd frontend
        npm run build
        pm2 restart club-frontend
        ```

3.  **Abrir Puertos (Firewall)**:
    *   Asegúrate de que el Firewall de Windows permita el tráfico en los puertos **3000** (Backend) y **3001** (Frontend).
    *   Si tienes un antivirus de terceros, también revisa su firewall.

4.  **Acceder desde otro equipo**:
    *   En el navegador del otro equipo (o celular), escribe la dirección IP y el puerto del frontend:
        `http://192.168.1.15:3001`

## Inicio Automático con Windows

Para que la aplicación se inicie sola cuando enciendes la computadora:

### Opción A: Usando PM2 (Recomendado)

1.  Instala el complemento de inicio para Windows:
    ```powershell
    npm install -g pm2-windows-startup
    ```
2.  Ejecuta el comando de instalación:
    ```powershell
    pm2-startup install
    ```
3.  Guarda la lista de procesos actuales:
    ```powershell
    pm2 save
    ```
    *Listo. Ahora PM2 revivirá tus procesos automáticamente al reiniciar.*

### Opción B: Método Manual (Carpeta de Inicio)

Si la opción A falla, puedes crear un acceso directo:

1.  Crea un archivo llamado `iniciar_club.bat` en la carpeta del proyecto con este contenido:
    ```bat
    @echo off
    cd C:\club-socios
    pm2 start ecosystem.config.js
    ```
2.  Presiona `Windows + R`, escribe `shell:startup` y dale Enter.
3.  Crea un **Acceso Directo** a ese archivo `iniciar_club.bat` dentro de esa carpeta.


