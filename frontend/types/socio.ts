export interface Socio {
  id?: string;
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  tipo: 'activo' | 'adherente'; // Nuevo campo
  numeroSocio?: string;
  foto?: string;
  observaciones?: string;
  // Información de revisión médica
  ultimaRevisionMedica?: string; // Fecha de última revisión
  proximaRevisionMedica?: string; // Fecha de próxima revisión requerida
  revisionMedicaVigente?: boolean; // Si la revisión médica está vigente
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSocioDto {
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  fechaIngreso?: string;
  estado?: 'activo' | 'inactivo' | 'suspendido';
  tipo?: 'activo' | 'adherente';
  foto?: string;
  ultimaRevisionMedica?: string;
  proximaRevisionMedica?: string;
  observaciones?: string;
}

export interface UpdateSocioDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  fechaIngreso?: string;
  estado?: 'activo' | 'inactivo' | 'suspendido';
  tipo?: 'activo' | 'adherente';
  foto?: string;
  ultimaRevisionMedica?: string;
  proximaRevisionMedica?: string;
  observaciones?: string;
}
