# Guía para subir tu proyecto a GitHub

Sigue estos pasos para guardar tu código en la nube (GitHub).

## Paso 1: Preparación (Ya realizado)
He creado un archivo `.gitignore` para evitar que se suban archivos pesados (como `node_modules`) o datos privados (como la base de datos y las fotos).

## Paso 2: Inicializar el repositorio local

Abre una terminal en la carpeta `club-socios` y ejecuta:

```powershell
# 1. Inicializar git
git init

# 2. Agregar todos los archivos
git add .

# 3. Guardar la primera versión
git commit -m "Versión inicial del Club Socios"
```

## Paso 3: Crear el repositorio en GitHub

1.  Entra a [github.com](https://github.com) e inicia sesión.
2.  Haz clic en el botón **+** (arriba a la derecha) y selecciona **"New repository"**.
3.  Ponle un nombre (ej: `club-socios`).
4.  Elige si quieres que sea **Público** o **Privado**.
5.  **NO** marques ninguna casilla de "Initialize this repository with...".
6.  Haz clic en **"Create repository"**.

## Paso 4: Conectar y subir

GitHub te mostrará unos comandos. Copia y pega los que se parecen a estos (reemplaza `TU_USUARIO` con tu usuario real):

```powershell
# Cambiar el nombre de la rama principal a 'main'
git branch -M main

# Conectar con GitHub (reemplaza la URL con la tuya)
git remote add origin https://github.com/TU_USUARIO/club-socios.git

# Subir los archivos
git push -u origin main
```

¡Listo! Tu código ya está seguro en GitHub.

## Notas Importantes

*   **Base de Datos y Fotos**: Por seguridad, la base de datos (`club.db`) y las fotos de los socios **NO se suben** a GitHub. Si cambias de PC, tendrás que copiarlas manualmente (como se explica en `DEPLOY.md`).
*   **Archivos .env**: Las configuraciones privadas tampoco se suben.
