# Guía de Docker - Club Socios

## ¿Es mucho Docker para esta app?

**No, no es mucho.** De hecho, Docker simplifica enormemente la instalación en equipos nuevos.

**Ventajas:**
1.  **Instalación en 1 comando**: No necesitas instalar Node.js, ni configurar versiones, ni preocuparte por dependencias. Solo necesitas Docker.
2.  **Aislamiento**: La app corre en su propio entorno y no ensucia tu sistema operativo.
3.  **Portabilidad**: Funciona exactamente igual en Windows, Linux o Mac.

**Desventajas:**
1.  Requiere instalar Docker Desktop (que consume algo de RAM).
2.  Si nunca usaste Docker, tiene una pequeña curva de aprendizaje inicial.

---

## Cómo usarlo

He creado los archivos necesarios (`Dockerfile` en backend/frontend y `docker-compose.yml`).

### Pasos:

1.  **Instalar Docker Desktop**: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2.  **Configurar IP (Opcional)**:
    *   Si vas a usar la app desde otros equipos, edita `docker-compose.yml`.
    *   Cambia `NEXT_PUBLIC_API_URL=http://localhost:3000` por tu IP local (ej: `http://192.168.1.15:3000`).
3.  **Iniciar**:
    Abre una terminal en la carpeta del proyecto y ejecuta:
    ```powershell
    docker-compose up -d --build
    ```
    *(Esto descargará, construirá y levantará todo automáticamente).*

4.  **Acceder**:
    *   Frontend: `http://localhost:3001`
    *   Backend: `http://localhost:3000`

5.  **Detener**:
    ```powershell
    docker-compose down
    ```

### Datos Persistentes
La base de datos y las fotos se guardarán en las carpetas `backend/data` y `backend/uploads` de tu equipo, así que no perderás nada si reinicias los contenedores.
