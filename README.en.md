[![Leer en Español](https://img.shields.io/badge/Leer%20en-Espa%C3%B1ol-ES?style=for-the-badge&logo=es)](README.md)

# Club Socios - Management System

Comprehensive system for managing members, payments, and ID cards for the **Unión Vecinal Barrio 25 de Mayo**.

## 🏗️ System Architecture

The application follows a modern decoupled client-server architecture:

### Frontend (User Interface)
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router).
- **UI Library**: [React](https://react.dev/).
- **Styles**: [TailwindCSS](https://tailwindcss.com/) (Responsive and modern design).
- **State/Cache Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query) for request optimization and caching.
- **Rendering**: Hybrid (SSR for fast initial load + CSR for interactivity).

### Backend (API & Logic)
- **Runtime**: [Node.js](https://nodejs.org/).
- **Framework**: [Express.js](https://expressjs.com/).
- **Database**: [SQLite](https://www.sqlite.org/) (via `better-sqlite3`).
- **Database Mode**: WAL (Write-Ahead Logging) for better concurrency and performance.
- **Validation**: Zod and custom validations.

---

## 💻 System Requirements

To run the system in a production or development environment, the following hardware and software are recommended:

### Minimum Hardware
- **Processor**: Dual Core 2.0 GHz or higher.
- **RAM**: 
  - **Minimum**: 4 GB.
  - **Recommended**: 8 GB (especially if running frontend and backend on the same machine).
- **Storage**: 
  - ~500 MB for application installation.
  - Additional space for the database and member photos (grows with usage).

### Required Software
- **Operating System**: Windows 10/11, Linux (Ubuntu/Debian), or macOS.
- **Node.js**: Version 18 LTS or higher (v20 recommended).
- **Web Browser**: 
  - **Recommended**: Google Chrome (Better compatibility for ID card printing).
  - Supported: Microsoft Edge, Mozilla Firefox.

---

## 🚀 Installation and Deployment

For detailed instructions on how to install, configure, and deploy the application, please consult the deployment guide:

👉 **[View Deployment Guide (DEPLOY.en.md)](./DEPLOY.en.md)**
👉 **[View Database and Migration Guide (MIGRATION_GUIDE.en.md)](./MIGRATION_GUIDE.en.md)**

## 📚 API Documentation

The backend includes interactive documentation (Swagger). Once the server is started, you can view it at:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Quick Commands

```bash
# Install dependencies (Frontend and Backend)
cd backend && npm install
cd ../frontend && npm install

# Start in development mode
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

## ⚡ Key Features

- **Instant Load**: Implementation of SSR and Cache for a smooth user experience.
- **ID Card Printing**: Optimized design for direct printing from the browser.
- **Payment Management**: Automatic status control (Up to date / Defaulter).
- **Security**: Strict data validation and robust error handling.
- **Backup**: SQLite database easy to copy and backup (`club-socios.db`).

---

**Developed for Unión Vecinal Barrio 25 de Mayo.**
