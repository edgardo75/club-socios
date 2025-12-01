import { SociosService } from '../services/socios.service';
import { CreateSocioDto } from '../types/socio';
import db from '../db';

// Mock database
jest.mock('../db', () => ({
  prepare: jest.fn(),
}));

describe('SociosService', () => {
  let sociosService: SociosService;

  beforeEach(() => {
    sociosService = new SociosService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a socio successfully with valid data', async () => {
      const mockSocioData: CreateSocioDto = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        telefono: '123456789',
        estado: 'activo',
        fechaIngreso: '2023-01-01',
      };

      // Mock DB responses
      (db.prepare as jest.Mock).mockImplementation((query) => {
        if (query.includes('SELECT * FROM socios WHERE dni')) {
          return { get: jest.fn().mockReturnValue(undefined) }; // No existing socio
        }
        if (query.includes('SELECT numeroSocio FROM socios')) {
          return { get: jest.fn().mockReturnValue({ numeroSocio: '100' }) }; // Last socio number
        }
        if (query.includes('INSERT INTO socios')) {
          return { run: jest.fn() };
        }
        return { get: jest.fn(), run: jest.fn(), all: jest.fn() };
      });

      const result = await sociosService.create(mockSocioData);

      expect(result).toBeDefined();
      expect(result.dni).toBe(mockSocioData.dni);
      expect(result.numeroSocio).toBe('101'); // 100 + 1
      expect(db.prepare).toHaveBeenCalledTimes(3); // Check exist, get last num, insert
    });

    it('should throw error if name contains invalid characters', async () => {
      const mockSocioData: CreateSocioDto = {
        dni: '12345678',
        nombre: 'Juan123', // Invalid
        apellido: 'Perez',
        telefono: '123456789',
      };

      await expect(sociosService.create(mockSocioData)).rejects.toThrow('Nombre y Apellido solo pueden contener letras y espacios');
    });

    it('should throw error if socio with DNI already exists', async () => {
      const mockSocioData: CreateSocioDto = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        telefono: '123456789',
      };

      // Mock existing socio
      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue({ dni: '12345678' }),
      });

      await expect(sociosService.create(mockSocioData)).rejects.toThrow('Ya existe un socio con este DNI');
    });
  });

  describe('getByDni', () => {
    it('should return socio if found', async () => {
      const mockSocio = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        revisionMedicaVigente: 1
      };

      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(mockSocio),
      });

      const result = await sociosService.getByDni('12345678');

      expect(result).toBeDefined();
      expect(result.dni).toBe('12345678');
      expect(result.revisionMedicaVigente).toBe(true);
    });

    it('should throw error if socio not found', async () => {
      (db.prepare as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(undefined),
      });

      await expect(sociosService.getByDni('99999999')).rejects.toThrow('Socio no encontrado');
    });
  });
});
