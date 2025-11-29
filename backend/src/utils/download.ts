import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export const downloadImage = (url: string, destDir: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validar URL
    try {
      new URL(url);
    } catch (e) {
      return reject(new Error('URL inválida'));
    }

    // Generar nombre de archivo único
    const ext = path.extname(url).split('?')[0] || '.jpg';
    const filename = `download-${Date.now()}${ext}`;
    const filepath = path.join(destDir, filename);

    // Asegurar que el directorio existe
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Normalizar URL de Google Drive
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        url = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }
    
    // Normalizar URL de Dropbox
    if (url.includes('dropbox.com') && url.includes('dl=0')) {
      url = url.replace('dl=0', 'raw=1');
    }

    const download = (currentUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        return reject(new Error('Demasiadas redirecciones'));
      }

      const client = currentUrl.startsWith('https') ? https : http;

      client.get(currentUrl, (response) => {
        // Manejar redirecciones
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return download(response.headers.location, redirectCount + 1);
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`Falló la descarga: ${response.statusCode}`));
        }

        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
          return reject(new Error(`La URL no es una imagen válida (Content-Type: ${contentType})`));
        }

        const file = fs.createWriteStream(filepath);
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve(filename);
        });

        file.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Borrar archivo incompleto
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    };

    download(url);
  });
};
