import { SociosService } from './socios.service';
import { PagosService } from './pagos.service';
import { ValidacionCarnet } from '../types/validacion';

export class ValidacionService {
  private sociosService: SociosService;
  private pagosService: PagosService;

  constructor() {
    this.sociosService = new SociosService();
    this.pagosService = new PagosService();
  }

  /**
   * Validar carnet de un socio
   * Retorna información completa para mostrar en pantalla del portero
   */
  async validarCarnet(dni: string): Promise<ValidacionCarnet> {
    const socio = await this.sociosService.getByDni(dni);

    if (!socio) {
      return {
        valido: false,
        socio: {
          dni,
          nombre: 'No encontrado',
          apellido: '',
        },
        razones: ['Socio no encontrado en el sistema'],
        estado: 'ROJO',
      };
    }

    // Verificar estado del socio
    if (socio.estado !== 'activo') {
      return {
        valido: false,
        socio: {
          dni: socio.dni,
          nombre: socio.nombre,
          apellido: socio.apellido,
          foto: socio.foto,
          numeroSocio: socio.numeroSocio,
        },
        razones: [`Socio con estado: ${socio.estado}`],
        estado: 'ROJO',
      };
    }

    const razones: string[] = [];

    // Verificar pago al día
    const tienePagoAlDia = await this.pagosService.tienePagoAlDia(dni);
    if (!tienePagoAlDia) {
      razones.push('Falta pago');
    }

    // Verificar revisión médica
    const revisionMedicaVigente = this.verificarRevisionMedica(socio);
    if (!revisionMedicaVigente) {
      razones.push('Falta revisión médica');
    }

    // Obtener último pago para mostrar información
    const ultimoPago = await this.pagosService.getUltimoPago(dni);

    const valido = razones.length === 0;

    return {
      valido,
      socio: {
        dni: socio.dni,
        nombre: socio.nombre,
        apellido: socio.apellido,
        foto: socio.foto,
        numeroSocio: socio.numeroSocio,
      },
      razones,
      ultimoPago: ultimoPago
        ? {
            mes: ultimoPago.mes,
            fecha: ultimoPago.fecha,
          }
        : undefined,
      proximaRevisionMedica: socio.proximaRevisionMedica,
      estado: valido ? 'VERDE' : 'ROJO',
    };
  }

  /**
   * Verificar si la revisión médica está vigente
   * Se considera vigente si tiene fecha de próxima revisión en el futuro
   * o si no tiene fecha de próxima revisión pero tiene última revisión reciente (menos de 1 año)
   */
  private verificarRevisionMedica(socio: any): boolean {
    // Si tiene próxima revisión médica, verificar que no haya vencido
    if (socio.proximaRevisionMedica) {
      const fechaProxima = new Date(socio.proximaRevisionMedica);
      const hoy = new Date();
      // Comparar solo la fecha (sin hora) para evitar problemas de zona horaria
      hoy.setHours(0, 0, 0, 0);
      fechaProxima.setHours(0, 0, 0, 0);
      return fechaProxima >= hoy;
    }

    // Si no tiene próxima revisión pero tiene última revisión, verificar que sea reciente (menos de 1 año)
    if (socio.ultimaRevisionMedica) {
      const fechaUltima = new Date(socio.ultimaRevisionMedica);
      const hoy = new Date();
      const unAnoAtras = new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate());
      unAnoAtras.setHours(0, 0, 0, 0);
      fechaUltima.setHours(0, 0, 0, 0);
      return fechaUltima >= unAnoAtras;
    }

    // Si no tiene ninguna revisión médica registrada, se considera que falta
    return false;
  }
}

