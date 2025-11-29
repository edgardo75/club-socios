import db from '../db';
import { Socio } from '../types/socio';
import { Pago } from '../types/pago';
import { AppConfig } from './config.service';

export interface SocioEstado extends Socio {
  estadoCuota: 'al_dia' | 'deudor';
  mesesAdeudados: number;
  montoAdeudado: number;
  ultimoPago?: Pago;
}

export interface InformeEstado {
  alDia: SocioEstado[];
  deudores: SocioEstado[];
  resumen: {
    totalSocios: number;
    totalAlDia: number;
    totalDeudores: number;
    montoTotalAdeudado: number;
  };
}

export class InformesService {
  async getEstadoSocios(): Promise<InformeEstado> {
    const socios = db.prepare("SELECT * FROM socios WHERE estado = 'activo' ORDER BY apellido ASC, nombre ASC").all() as Socio[];
    const pagos = db.prepare('SELECT * FROM pagos ORDER BY fecha DESC').all() as Pago[];
    
    // Get current config for fees
    const configRows = db.prepare('SELECT key, value FROM config').all() as { key: string, value: string }[];
    const config: any = {};
    configRows.forEach(row => config[row.key] = Number(row.value));
    
    const cuotaActivo = config.cuotaActivo || 1000;
    const cuotaAdherente = config.cuotaAdherente || 500;

    const hoy = new Date();
    const diaActual = hoy.getDate();
    const mesActual = hoy.getMonth(); // 0-11
    const anioActual = hoy.getFullYear();

    // Determine the target month that SHOULD be paid
    // If today <= 10, we expect payment up to PREVIOUS month
    // If today > 10, we expect payment up to CURRENT month
    let targetDate: Date;
    if (diaActual <= 10) {
      targetDate = new Date(anioActual, mesActual - 1, 1);
    } else {
      targetDate = new Date(anioActual, mesActual, 1);
    }

    // Helper to get month string YYYY-MM
    const getMonthStr = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    const targetMonthStr = getMonthStr(targetDate);
    
    const alDia: SocioEstado[] = [];
    const deudores: SocioEstado[] = [];
    let montoTotalAdeudado = 0;

    for (const socio of socios) {
      const pagosSocio = pagos.filter(p => p.socioDni === socio.dni);
      const ultimoPago = pagosSocio[0]; // Assuming sorted by date DESC

      // Check if they have paid the target month or a future month
      const tienePagoAlDia = pagosSocio.some(p => p.mes >= targetMonthStr);

      if (tienePagoAlDia) {
        alDia.push({
          ...socio,
          estadoCuota: 'al_dia',
          mesesAdeudados: 0,
          montoAdeudado: 0,
          ultimoPago
        });
      } else {
        // Calculate debt
        // Simple logic: Count months from last payment (or admission date) to target date
        let lastPaidDate: Date;
        
        if (ultimoPago) {
          // Parse YYYY-MM
          const [year, month] = ultimoPago.mes.split('-').map(Number);
          lastPaidDate = new Date(year, month - 1, 1);
        } else {
          // If no payments, use admission date
          const admission = new Date(socio.fechaIngreso);
          lastPaidDate = new Date(admission.getFullYear(), admission.getMonth() - 1, 1);
        }

        // Calculate months difference
        // We want to know how many months passed between lastPaidDate (exclusive) and targetDate (inclusive)
        let monthsOwed = (targetDate.getFullYear() - lastPaidDate.getFullYear()) * 12 + (targetDate.getMonth() - lastPaidDate.getMonth());
        
        // Ensure at least 1 month if they are deudores
        monthsOwed = Math.max(1, monthsOwed);

        const cuotaValor = socio.tipo === 'adherente' ? cuotaAdherente : cuotaActivo;
        const deuda = monthsOwed * cuotaValor;

        montoTotalAdeudado += deuda;

        deudores.push({
          ...socio,
          estadoCuota: 'deudor',
          mesesAdeudados: monthsOwed,
          montoAdeudado: deuda,
          ultimoPago
        });
      }
    }

    return {
      alDia,
      deudores,
      resumen: {
        totalSocios: socios.length,
        totalAlDia: alDia.length,
        totalDeudores: deudores.length,
        montoTotalAdeudado
      }
    };
  }
}
