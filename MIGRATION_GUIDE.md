# Guía de Base de Datos y Migraciones

## ¿Es SQLite segura para el futuro?

**Sí, absolutamente.**

SQLite es una base de datos profesional, robusta y extremadamente rápida. Es la base de datos más usada del mundo (está en todos los teléfonos Android/iPhone, navegadores, etc.).

### Mitos vs Realidad

*   **Mito**: "SQLite es solo para pruebas".
    *   **Realidad**: SQLite maneja terabytes de datos y miles de transacciones. Para un club de socios (incluso con miles de miembros), SQLite sobra.
*   **Mito**: "Si actualizo la app, pierdo los datos".
    *   **Realidad**: No. La base de datos es un archivo (`club-socios.db`). Mientras no borres ese archivo, tus datos están seguros.

---

## ¿Cómo agrego nuevas características? (Migraciones)

Cuando necesites agregar nuevos campos (ej: "Grupo Sanguíneo" al socio), no necesitas borrar la base de datos ni editarla manualmente. Usamos un sistema de **Migraciones Automáticas**.

### ¿Cómo funciona hoy?

Actualmente, el sistema verifica la estructura de la base de datos cada vez que se inicia (`src/db/index.ts`).

### Para desarrolladores futuros:

Si necesitas modificar la base de datos, sigue estos pasos:

1.  **No modifiques las tablas existentes directamente** si ya tienen datos.
2.  **Crea una migración**:
    *   Edita el archivo `backend/src/db/migrate.ts`.
    *   Agrega una nueva columna usando SQL estándar.

    ```typescript
    // Ejemplo: Agregar columna 'grupo_sanguineo'
    try {
      db.exec("ALTER TABLE socios ADD COLUMN grupo_sanguineo TEXT");
      console.log("Columna grupo_sanguineo agregada.");
    } catch (error) {
      // Ignorar error si la columna ya existe
    }
    ```

3.  **Reinicia el servidor**:
    *   Al iniciarse, el backend ejecutará tu código.
    *   Si la columna no existe, la creará.
    *   Si ya existe, no hará nada (gracias al `try/catch` o verificaciones).
    *   **Tus datos existentes se mantienen intactos.**

---

## Consideraciones para la Nube (Cloud)

El único "riesgo" con SQLite en la nube es **olvidar la persistencia**.

*   **En tu PC**: El archivo se guarda en tu disco duro. Si actualizas el código, el archivo sigue ahí.
*   **En la Nube (Docker/PaaS)**: Los contenedores son "efímeros" (se destruyen y recrean al actualizar).
    *   **Solución**: Configurar un **Volumen**.
    *   Le dices a la nube: *"Guarda el archivo `/app/backend/data/club.db` en un disco real, no en el contenedor"*.
    *   Así, cuando actualices la app, el nuevo contenedor leerá el mismo archivo del disco real.

## Resumen

1.  **Actualizaciones**: Son seguras. El código nuevo simplemente agrega columnas al archivo existente.
2.  **Backup**: Copiar el archivo `club-socios.db` es tu copia de seguridad completa. ¡Más fácil imposible!
3.  **Escalabilidad**: Soporta miles de socios sin problemas. Solo tendrías que migrar a PostgreSQL si planeas tener **múltiples servidores backend** escribiendo a la vez (algo muy raro para esta escala).
