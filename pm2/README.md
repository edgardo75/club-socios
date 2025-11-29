# PM2 - Club de Socios

Pasos para dejar el backend corriendo automáticamente con PM2:

1. Instalar PM2 (global):
   ```bash
   npm install -g pm2
   ```

2. Arrancar los procesos definidos en `ecosystem.config.cjs`:
   ```bash
   cd C:\Users\usuario\club-socios
   pm2 start pm2/ecosystem.config.cjs
   ```

3. Guardar la configuración actual (para que respawnee sola si se cae):
   ```bash
   pm2 save
   ```

4. Configurar que PM2 se inicie solo con Windows:
   ```bash
   pm2 startup windows --service-name club-socios
   ```
   El comando mostrará otra línea que tenés que copiar/pegar para completar la instalación del servicio.

5. Comandos útiles:
   ```bash
   pm2 ls                  # Ver procesos
   pm2 logs club-backend   # Ver logs del backend
   pm2 restart club-backend
   pm2 stop club-backend
   pm2 delete club-backend
   ```

> Nota: Actualmente sólo el backend tiene `package.json`, por eso el ecosistema incluye únicamente `club-backend`. Cuando tengas un frontend con su propio `package.json`, podés duplicar la entrada en `ecosystem.config.cjs` cambiando `cwd`, `name` y el script (`npm run dev`, `next start`, etc.).

