import { Socio, CreateSocioDto, UpdateSocioDto } from '../types/socio';
import db from '../db';
import crypto from 'crypto';

export class SociosService {
  async getAll(search?: string, includeDeleted: boolean = false): Promise<Socio[]> {
    let query = 'SELECT * FROM socios';
    const params: any[] = [];
    const conditions: string[] = [];

    if (!includeDeleted) {
      conditions.push('deletedAt IS NULL');
    }

    if (search) {
      conditions.push('(nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY apellido ASC, nombre ASC';

    const stmt = db.prepare(query);
    const socios = stmt.all(...params) as Socio[];
    
    // Convert integer boolean back to boolean
    return socios.map(s => ({
      ...s,
      revisionMedicaVigente: Boolean(s.revisionMedicaVigente)
    }));
  }

  async getByDni(dni: string): Promise<Socio> {
    const stmt = db.prepare('SELECT * FROM socios WHERE dni = ?');
    const socio = stmt.get(dni) as Socio;
    
    if (!socio) {
      throw new Error('Socio no encontrado');
    }

    return {
      ...socio,
      revisionMedicaVigente: Boolean(socio.revisionMedicaVigente)
    };
  }

  async create(data: CreateSocioDto): Promise<Socio> {
    console.log('[CREATE] Validating data:', JSON.stringify(data));
    // Validate Name and Surname
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(data.nombre) || !nameRegex.test(data.apellido)) {
      console.error('[CREATE] Validation failed for name/surname');
      throw new Error('Nombre y Apellido solo pueden contener letras y espacios');
    }
    console.log('[CREATE] Validation passed');

    // Check if DNI exists
    const existing = db.prepare('SELECT * FROM socios WHERE dni = ?').get(data.dni) as Socio;
    
    if (existing) {
      if (existing.deletedAt) {
        // Auto-restore logic
        await this.restore(data.dni);
        return this.update(data.dni, data);
      }
      throw new Error('Ya existe un socio con este DNI');
    }

    // Generate numeroSocio if not provided
    let numeroSocio = data.numeroSocio;
    if (!numeroSocio) {
      const lastSocio = db.prepare('SELECT numeroSocio FROM socios ORDER BY CAST(numeroSocio AS INTEGER) DESC LIMIT 1').get() as { numeroSocio: string };
      let lastNum = 0;
      if (lastSocio && lastSocio.numeroSocio) {
        const parsed = parseInt(lastSocio.numeroSocio);
        if (!isNaN(parsed)) {
          lastNum = parsed;
        }
      }
      numeroSocio = (lastNum + 1).toString();
    }

    const nuevoSocio: Socio = {
      id: crypto.randomUUID(),
      ...data,
      numeroSocio,
      fechaIngreso: data.fechaIngreso || new Date().toISOString().split('T')[0],
      estado: data.estado || 'activo',
      tipo: data.tipo || 'activo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revisionMedicaVigente: false
    };

    const stmt = db.prepare(`
      INSERT INTO socios (
        id, dni, nombre, apellido, email, telefono, fechaNacimiento, 
        direccion, fechaIngreso, estado, tipo, numeroSocio, foto, 
        observaciones, ultimaRevisionMedica, proximaRevisionMedica, 
        revisionMedicaVigente, createdAt, updatedAt
      ) VALUES (
        @id, @dni, @nombre, @apellido, @email, @telefono, @fechaNacimiento, 
        @direccion, @fechaIngreso, @estado, @tipo, @numeroSocio, @foto, 
        @observaciones, @ultimaRevisionMedica, @proximaRevisionMedica, 
        @revisionMedicaVigente, @createdAt, @updatedAt
      )
    `);

    // Sanitize undefined values to null for SQLite
    const params = {
      ...nuevoSocio,
      email: nuevoSocio.email || null,
      telefono: nuevoSocio.telefono || null,
      fechaNacimiento: nuevoSocio.fechaNacimiento || null,
      direccion: nuevoSocio.direccion || null,
      foto: nuevoSocio.foto || null,
      observaciones: nuevoSocio.observaciones || null,
      ultimaRevisionMedica: nuevoSocio.ultimaRevisionMedica || null,
      proximaRevisionMedica: nuevoSocio.proximaRevisionMedica || null,
      revisionMedicaVigente: nuevoSocio.revisionMedicaVigente ? 1 : 0
    };

    stmt.run(params);

    return nuevoSocio;
  }

  async update(dni: string, data: UpdateSocioDto & { numeroSocio?: string }): Promise<Socio> {
    // Validate Name and Surname if provided
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if ((data.nombre && !nameRegex.test(data.nombre)) || (data.apellido && !nameRegex.test(data.apellido))) {
      throw new Error('Nombre y Apellido solo pueden contener letras y espacios');
    }

    const currentSocio = await this.getByDni(dni);
    
    const updatedSocio: Socio = {
      ...currentSocio,
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Determine revision medica status if dates changed
    if (data.ultimaRevisionMedica || data.proximaRevisionMedica) {
      const proxima = new Date(updatedSocio.proximaRevisionMedica || '');
      const hoy = new Date();
      updatedSocio.revisionMedicaVigente = proxima > hoy;
    }

    const stmt = db.prepare(`
      UPDATE socios SET
        nombre = @nombre,
        apellido = @apellido,
        email = @email,
        telefono = @telefono,
        fechaNacimiento = @fechaNacimiento,
        direccion = @direccion,
        fechaIngreso = @fechaIngreso,
        estado = @estado,
        tipo = @tipo,
        numeroSocio = @numeroSocio,
        foto = @foto,
        observaciones = @observaciones,
        ultimaRevisionMedica = @ultimaRevisionMedica,
        proximaRevisionMedica = @proximaRevisionMedica,
        revisionMedicaVigente = @revisionMedicaVigente,
        updatedAt = @updatedAt
      WHERE dni = @dni
    `);

    stmt.run({
      ...updatedSocio,
      revisionMedicaVigente: updatedSocio.revisionMedicaVigente ? 1 : 0
    });

    return updatedSocio;
  }

  async delete(dni: string): Promise<boolean> {
    // Soft delete
    const stmt = db.prepare('UPDATE socios SET deletedAt = ? WHERE dni = ?');
    const result = stmt.run(new Date().toISOString(), dni);
    
    if (result.changes === 0) {
      throw new Error('Socio no encontrado');
    }
    
    return true;
  }

  async restore(dni: string): Promise<boolean> {
    const stmt = db.prepare('UPDATE socios SET deletedAt = NULL WHERE dni = ?');
    const result = stmt.run(dni);
    
    if (result.changes === 0) {
      throw new Error('Socio no encontrado');
    }
    
    return true;
  }

  async hasDeleted(): Promise<boolean> {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM socios WHERE deletedAt IS NOT NULL');
    const result = stmt.get() as { count: number };
    return result.count > 0;
  }
}
