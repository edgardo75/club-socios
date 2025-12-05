[![Leer en Español](https://img.shields.io/badge/Leer%20en-Espa%C3%B1ol-ES?style=for-the-badge&logo=es)](DOCKER_GUIDE.md)

# Docker Guide - Club Socios

## Is Docker too much for this app?

**No, it is not too much.** In fact, Docker greatly simplifies installation on new computers.

**Advantages:**
1.  **1-Command Installation**: You don't need to install Node.js, nor configure versions, nor worry about dependencies. You only need Docker.
2.  **Isolation**: The app runs in its own environment and doesn't clutter your operating system.
3.  **Portability**: It works exactly the same on Windows, Linux, or Mac.

**Disadvantages:**
1.  Requires installing Docker Desktop (which consumes some RAM).
2.  If you never used Docker, it has a small initial learning curve.

---

## How to use it

I have created the necessary files (`Dockerfile` in backend/frontend and `docker-compose.yml`).

### Steps:

1.  **Install Docker Desktop**: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2.  **Configure IP (Optional)**:
    *   If you are going to use the app from other computers, edit `docker-compose.yml`.
    *   Change `NEXT_PUBLIC_API_URL=http://localhost:3000` to your local IP (e.g., `http://192.168.1.15:3000`).
3.  **Start**:
    Open a terminal in the project folder and run:
    ```powershell
    docker-compose up -d --build
    ```
    *(This will download, build, and lift everything automatically).*

4.  **Access**:
    *   Frontend: `http://localhost:3001`
    *   Backend: `http://localhost:3000`

5.  **Stop**:
    ```powershell
    docker-compose down
    ```

### Persistent Data
The database and photos will be saved in the `backend/data` and `backend/uploads` folders of your computer, so you won't lose anything if you restart the containers.
