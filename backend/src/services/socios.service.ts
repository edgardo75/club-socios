import { Socio, CreateSocioDto, UpdateSocioDto } from '../types/socio';
import db from '../db';
import crypto from 'crypto';

export class SociosService {
  async getAll(search?: string): Promise<Socio[]> {
    let query = 'SELECT * FROM socios';
    const params: any[] = [];

    if (search) {
      query += ' WHERE nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?';
      const term = `%${search}%`;
      params.push(term, term, term);
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
    // Check if DNI exists
    const existing = db.prepare('SELECT dni FROM socios WHERE dni = ?').get(data.dni);
    if (existing) {
      throw new Error('Ya existe un socio con este DNI');
    }

    const nuevoSocio: Socio = {
      id: crypto.randomUUID(),
      ...data,
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

    stmt.run({
      ...nuevoSocio,
      revisionMedicaVigente: nuevoSocio.revisionMedicaVigente ? 1 : 0
    });

    return nuevoSocio;
  }

  async update(dni: string, data: UpdateSocioDto): Promise<Socio> {
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
    const stmt = db.prepare('DELETE FROM socios WHERE dni = ?');
    const result = stmt.run(dni);
    
    if (result.changes === 0) {
      throw new Error('Socio no encontrado');
    }
    
    return true;
  }
}
