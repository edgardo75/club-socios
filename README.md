[![Read in English](https://img.shields.io/badge/Read%20in-English-blue?style=for-the-badge&logo=appveyor)](README.en.md)

# Club Socios - Sistema de Gestión

Sistema integral para la gestión de socios, pagos y carnets de la **Unión Vecinal Barrio 25 de Mayo**.

## 🏗️ Arquitectura del Sistema

La aplicación sigue una arquitectura moderna de cliente-servidor desacoplada:

### Frontend (Interfaz de Usuario)
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router).
- **Librería UI**: [React](https://react.dev/).
- **Estilos**: [TailwindCSS](https://tailwindcss.com/) (Diseño responsivo y moderno).
- **Gestión de Estado/Caché**: [TanStack Query](https://tanstack.com/query/latest) (React Query) para optimización de peticiones y caché.
- **Renderizado**: Híbrido (SSR para carga inicial rápida + CSR para interactividad).

### Backend (API & Lógica)
- **Runtime**: [Node.js](https://nodejs.org/).
- **Framework**: [Express.js](https://expressjs.com/).
- **Base de Datos**: [SQLite](https://www.sqlite.org/) (vía `better-sqlite3`).
- **Modo de Base de Datos**: WAL (Write-Ahead Logging) para mejor concurrencia y rendimiento.
- **Validación**: Zod y validaciones personalizadas.

---

## 💻 Requisitos del Sistema

Para ejecutar el sistema en un entorno de producción o desarrollo, se recomienda el siguiente hardware y software:

### Hardware Mínimo
- **Procesador**: Dual Core 2.0 GHz o superior.
- **Memoria RAM**: 
  - **Mínimo**: 4 GB.
  - **Recomendado**: 8 GB (especialmente si se ejecuta frontend y backend en la misma máquina).
- **Almacenamiento**: 
  - ~500 MB para la instalación de la aplicación.
  - Espacio adicional para la base de datos y las imágenes de los socios (crece con el uso).

### Software Requerido
- **Sistema Operativo**: Windows 10/11, Linux (Ubuntu/Debian), o macOS.
- **Node.js**: Versión 18 LTS o superior (v20 recomendado).
- **Navegador Web**: 
  - **Recomendado**: Google Chrome (Mejor compatibilidad para impresión de carnets).
  - Soportados: Microsoft Edge, Mozilla Firefox.

---

## 🚀 Instalación y Despliegue

Para instrucciones detalladas sobre cómo instalar, configurar y desplegar la aplicación, por favor consulta la guía de despliegue:

👉 **[Ver Guía de Despliegue (DEPLOY.md)](./DEPLOY.md)**
👉 **[Ver Guía de Base de Datos y Migraciones (MIGRATION_GUIDE.md)](./MIGRATION_GUIDE.md)**

## 📚 Documentación de API

El backend incluye documentación interactiva (Swagger). Una vez iniciado el servidor, puedes verla en:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Comandos Rápidos

```bash
# Instalar dependencias (Frontend y Backend)
cd backend && npm install
cd ../frontend && npm install

# Iniciar en modo desarrollo
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

## ⚡ Características Destacadas

- **Carga Instantánea**: Implementación de SSR y Caché para una experiencia de usuario fluida.
- **Impresión de Carnets**: Diseño optimizado para impresión directa desde el navegador.
- **Gestión de Pagos**: Control de estados (Al día / Deudor) automático.
- **Seguridad**: Validaciones estrictas de datos y manejo de errores robusto.
- **Respaldo**: Base de datos SQLite fácil de copiar y respaldar (`club-socios.db`).

---

**Desarrollado para la Unión Vecinal Barrio 25 de Mayo.**
