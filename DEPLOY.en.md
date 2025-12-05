[![Leer en Español](https://img.shields.io/badge/Leer%20en-Espa%C3%B1ol-ES?style=for-the-badge&logo=es)](DEPLOY.md)

# Installation and Deployment Guide - Club Socios

This guide details the steps to install the application on a new machine.

## Prerequisites

Before starting, make sure you have installed on the new machine:

1.  **Node.js**: Version 18 or higher (LTS recommended).
    *   Download: [https://nodejs.org/](https://nodejs.org/)
2.  **Git** (Optional, if you are going to clone the repository):
    *   Download: [https://git-scm.com/](https://git-scm.com/)

## Option 1: Clean Installation (Recommended)

If you have the source code (e.g., on a USB drive or git repository):

1.  **Copy the code**: Copy the `club-socios` project folder to the new machine (e.g., `C:\club-socios`).
2.  **Open a terminal**: Open PowerShell or CMD and navigate to the folder.
    ```powershell
    cd C:\club-socios
    ```
3.  **Install dependencies**:
    You must install the libraries in both the frontend and backend folders. Run these commands one by one:
    
    ```powershell
    # Install backend
    cd backend
    npm install
    cd ..

    # Install frontend
    cd frontend
    npm install
    cd ..
    ```
4.  **Configure environment**:
    Create a file named `.env` inside each folder with the following minimum content:

    *   **In `backend/.env`**:
        ```env
        PORT=3000
        ```

    *   **In `frontend/.env`**:
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:3000
        ```
        *(Note: If installing on a network, change `localhost` to the server IP, e.g., `http://192.168.1.15:3000`)*

5.  **Build the application**:
    To facilitate this step, we have created an automatic script. Simply run:
    
    **Windows:**
    ```powershell
    .\build_app.bat
    ```
    
    **Linux / Mac:**
    ```bash
    chmod +x build_app.sh
    ./build_app.sh
    ```
    
    *This script will install all dependencies and build both the frontend and backend.*

6.  **Start the application**:
    You can use the quick start script if you copied it, or use PM2.
    
    *   **Install PM2 globally** (if you don't have it):
        ```powershell
        npm install -g pm2
        ```
    *   **Start services**:
        ```powershell
        pm2 start ecosystem.config.js
        pm2 save
        ```
        *(Note: For the app to start automatically when turning on the PC, see the **"Automatic Startup with Windows"** section at the end of this guide).*

## Option 2: Migrate with Existing Data

If you want to move the application **WITH** the current database:

1.  Follow the steps in **Option 1**.
2.  **Before starting**, copy the following files/folders from the old machine to the new one:
    *   `backend/data/club.db` (Database)
    *   `backend/uploads/` (Member photos)
3.  Paste them in the same locations on the new machine.

## Common Troubleshooting

*   **Connection Error**: Check that the backend is running (`pm2 status`).
*   **Port Busy**: Make sure no other programs are using ports 3000 or 3001.
*   **SQLite Error**: If you have `better-sqlite3` errors when changing OS or Node version, run:
    ```powershell
    cd backend
    npm rebuild better-sqlite3
    ```

## Useful Commands

*   `pm2 status`: View service status.
*   `pm2 logs`: View error logs.
*   `pm2 restart all`: Restart everything.
*   `pm2 stop all`: Stop everything.

## Access from other computers (Local Network)

Yes, it is possible to access the application from other computers connected to the same Wi-Fi or wired network. The machine where you installed the application will act as a "Server".

### Steps to configure network access:

1.  **Find out the Server IP**:
    *   On the server machine, open a terminal and type `ipconfig` (Windows) or `ifconfig` (Linux).
    *   Look for the IPv4 address (example: `192.168.1.15`).

2.  **Configure the Frontend**:
    *   Edit the `frontend/.env` file.
    *   Change `NEXT_PUBLIC_API_URL` to use the IP instead of localhost:
        ```env
        NEXT_PUBLIC_API_URL=http://192.168.1.15:3000
        ```
    *   **Important**: You must rebuild the frontend for this change to take effect:
        ```powershell
        cd frontend
        npm run build
        pm2 restart club-frontend
        ```

3.  **Open Ports (Firewall)**:
    *   Make sure the Windows Firewall allows traffic on ports **3000** (Backend) and **3001** (Frontend).
    *   If you have third-party antivirus, also check its firewall.

4.  **Access from another computer**:
    *   In the browser of the other computer (or mobile phone), type the IP address and frontend port:
        `http://192.168.1.15:3001`

## Automatic Startup with Windows

To make the application start alone when you turn on the computer:

### Option A: Using PM2 (Recommended)

1.  Install the startup plugin for Windows:
    ```powershell
    npm install -g pm2-windows-startup
    ```
2.  Run the installation command:
    ```powershell
    pm2-startup install
    ```
3.  Save the current process list:
    ```powershell
    pm2 save
    ```
    *Done. Now PM2 will revive your processes automatically upon restart.*

### Option B: Manual Method (Startup Folder)

If Option A fails, you can create a shortcut:

1.  Create a file named `start_club.bat` in the project folder with this content:
    ```bat
    @echo off
    cd C:\club-socios
    pm2 start ecosystem.config.js
    ```
2.  Press `Windows + R`, type `shell:startup`, and hit Enter.
3.  Create a **Shortcut** to that `start_club.bat` file inside that folder.

## Cloud Deployment

Yes, you can upload this application to the cloud to access it from anywhere (not just local network).

### Recommended Option: VPS (Virtual Private Server)
Services like **DigitalOcean, AWS Lightsail, or Hetzner**.

1.  **Requirement**: A server with Linux (Ubuntu 20.04+).
2.  **Method**: Docker (it is the easiest and most robust).
3.  **Steps**:
    *   Upload your project to the server (git clone or scp).
    *   Install Docker and Docker Compose on the server.
    *   Run `docker-compose up -d --build`.

### PaaS Option (Railway, Render, etc.)
Services where you only upload the code.

*   **Warning**: This app uses **SQLite** (a local file) and saves images to disk.
*   **Critical Requirement**: You need to configure **Persistent Volumes** for:
    *   `/app/backend/data` (Database)
    *   `/app/backend/uploads` (Photos)
*   *If you don't configure volumes, you will lose all data every time the app restarts or updates.*

### What do I need to change?
Generally nothing in the code. Just make sure to configure the environment variables in your cloud provider's control panel:
*   `PORT`: 3000 (or whatever the provider assigns).
*   `NEXT_PUBLIC_API_URL`: The public URL of your domain (e.g., `https://my-club.com/api`).
