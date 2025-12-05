[![Leer en Español](https://img.shields.io/badge/Leer%20en-Espa%C3%B1ol-ES?style=for-the-badge&logo=es)](MIGRATION_GUIDE.md)

# Database and Migration Guide

## Is SQLite safe for the future?

**Yes, absolutely.**

SQLite is a professional database, robust and extremely fast. It is the most used database in the world (it acts in all Android/iPhone phones, browsers, etc.).

### Myths vs Reality

*   **Myth**: "SQLite is only for testing".
    *   **Reality**: SQLite handles terabytes of data and thousands of transactions. For a member club (even with thousands of members), SQLite is more than enough.
*   **Myth**: "If I update the app, I lose the data".
    *   **Reality**: No. The database is a file (`club-socios.db`). As long as you don't delete that file, your data is safe.

---

## How do I add new features? (Migrations)

When you need to add new fields (e.g., "Blood Type" to the member), you don't need to delete the database or edit it manually. We use an **Automatic Migrations** system.

### How does it work today?

Currently, the system checks the database structure every time it starts (`src/db/index.ts`).

### For future developers:

If you need to modify the database, follow these steps:

1.  **Do not modify existing tables directly** if they already have data.
2.  **Create a migration**:
    *   Edit the file `backend/src/db/migrate.ts`.
    *   Add a new column using standard SQL.

    ```typescript
    // Example: Add column 'blood_type'
    try {
      db.exec("ALTER TABLE socios ADD COLUMN blood_type TEXT");
      console.log("Column blood_type added.");
    } catch (error) {
      // Ignore error if the column already exists
    }
    ```

3.  **Restart the server**:
    *   Upon startup, the backend will run your code.
    *   If the column doesn't exist, it will create it.
    *   If it already exists, it will do nothing (thanks to the `try/catch` or checks).
    *   **Your existing data remains intact.**

---

## Cloud Considerations

The only "risk" with SQLite in the cloud is **forgetting persistence**.

*   **On your PC**: The file is saved on your hard drive. If you update the code, the file is still there.
*   **In the Cloud (Docker/PaaS)**: Containers are "ephemeral" (they are destroyed and recreated upon updating).
    *   **Solution**: Configure a **Volume**.
    *   You tell the cloud: *"Save the file `/app/backend/data/club.db` on a real disk, not in the container"*.
    *   Thus, when you update the app, the new container will read the same file from the real disk.

## Summary

1.  **Updates**: They are safe. New code simply adds columns to the existing file.
2.  **Backup**: Copying the `club-socios.db` file is your complete backup. Easier impossible!
3.  **Scalability**: Supports thousands of members without problems. You would only have to migrate to PostgreSQL if you plan to have **multiple backend servers** writing at the same time (something very rare for this scale).
