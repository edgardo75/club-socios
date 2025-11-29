export interface ValidacionCarnet {
  valido: boolean;
  socio: {
    dni: string;
    nombre: string;
    apellido: string;
    foto?: string;
    numeroSocio?: string;
  };
  razones: string[]; // Razones por las que es ROJO (vacío si es VERDE)
  ultimoPago?: {
    mes: string;
    fecha: string;
  };
  proximaRevisionMedica?: string;
  estado: 'VERDE' | 'ROJO';
}
