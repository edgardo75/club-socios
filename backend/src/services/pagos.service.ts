import { Pago, CreatePagoDto } from '../types/pago';
import db from '../db';

export class PagosService {
  /**
   * Obtener todos los pagos de un socio
   */
  async getBySocioDni(socioDni: string): Promise<Pago[]> {
    const stmt = db.prepare('SELECT * FROM pagos WHERE socioDni = ? ORDER BY fecha DESC');
    return stmt.all(socioDni) as Pago[];
  }

  /**
   * Obtener el último pago de un socio
   */
  async getUltimoPago(socioDni: string): Promise<Pago | null> {
    const stmt = db.prepare('SELECT * FROM pagos WHERE socioDni = ? ORDER BY fecha DESC LIMIT 1');
    return stmt.get(socioDni) as Pago | null;
  }

  /**
   * Verificar si el socio tiene pago al día
   * Retorna true si tiene pago del mes actual o anterior
   */
  async tienePagoAlDia(socioDni: string): Promise<boolean> {
    const ultimoPago = await this.getUltimoPago(socioDni);
    if (!ultimoPago) return false;

    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const mesAnteriorStr = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}`;

    return ultimoPago.mes === mesActual || ultimoPago.mes === mesAnteriorStr;
  }

  /**
   * Crear un nuevo pago
   */
  async create(data: CreatePagoDto): Promise<Pago> {
    const nuevoPago: Pago = {
      id: `pago-${Date.now()}`,
      socioDni: data.socioDni,
      monto: data.monto,
      fecha: data.fecha || new Date().toISOString(),
      mes: data.mes,
      concepto: data.concepto,
      metodoPago: data.metodoPago,
      createdAt: new Date().toISOString(),
    };

    const stmt = db.prepare(`
      INSERT INTO pagos (
        id, socioDni, monto, fecha, mes, concepto, metodoPago, createdAt
      ) VALUES (
        @id, @socioDni, @monto, @fecha, @mes, @concepto, @metodoPago, @createdAt
      )
    `);

    stmt.run(nuevoPago);
    return nuevoPago;
  }

  /**
   * Obtener todos los pagos
   */
  async getAll(): Promise<Pago[]> {
    const stmt = db.prepare('SELECT * FROM pagos ORDER BY fecha DESC');
    return stmt.all() as Pago[];
  }

  /**
   * Eliminar un pago
   */
  async delete(id: string): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM pagos WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      throw new Error('Pago no encontrado');
    }
    return true;
  }
}

