import { PagosService } from '../services/pagos.service';
import db from '../db';

// Mock database
jest.mock('../db', () => ({
  prepare: jest.fn(),
}));

describe('PagosService - Validación', () => {
  let pagosService: PagosService;

  beforeEach(() => {
    pagosService = new PagosService();
    jest.clearAllMocks();
  });

  describe('tienePagoAlDia', () => {
    it('should return true if socio has payment for current month', async () => {
      const hoy = new Date();
      const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
      
      const mockPago = {
        id: 'pago-1',
        socioDni: '12345678',
        mes: mesActual,
        fecha: new Date().toISOString()
      };

      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(mockPago),
      });

      const result = await pagosService.tienePagoAlDia('12345678');
      expect(result).toBe(true);
    });

    it('should return true if socio has payment for previous month', async () => {
      const hoy = new Date();
      const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      const mesAnteriorStr = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}`;
      
      const mockPago = {
        id: 'pago-1',
        socioDni: '12345678',
        mes: mesAnteriorStr,
        fecha: new Date().toISOString()
      };

      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(mockPago),
      });

      const result = await pagosService.tienePagoAlDia('12345678');
      expect(result).toBe(true);
    });

    it('should return false if socio has payment older than previous month', async () => {
      const hoy = new Date();
      const dosMesesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1);
      const dosMesesAtrasStr = `${dosMesesAtras.getFullYear()}-${String(dosMesesAtras.getMonth() + 1).padStart(2, '0')}`;
      
      const mockPago = {
        id: 'pago-1',
        socioDni: '12345678',
        mes: dosMesesAtrasStr,
        fecha: new Date().toISOString()
      };

      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(mockPago),
      });

      const result = await pagosService.tienePagoAlDia('12345678');
      expect(result).toBe(false);
    });

    it('should return false if socio has no payments', async () => {
      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      });

      const result = await pagosService.tienePagoAlDia('12345678');
      expect(result).toBe(false);
    });
  });
});
