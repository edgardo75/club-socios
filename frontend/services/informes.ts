import { fetchApi } from './api';
import { Socio } from '../types/socio';
import { Pago } from '../types/pago';

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

export const informesService = {
  getEstadoSocios: async (): Promise<InformeEstado> => {
    return fetchApi('/informes');
  },
};
