import { z } from 'zod';

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const phoneRegex = /^[\d\s\-\+]+$/;

export const createSocioSchema = z.object({
  body: z.object({
    dni: z.string().min(7, 'El DNI debe tener al menos 7 dígitos').max(8, 'El DNI no puede tener más de 8 dígitos').regex(/^\d+$/, 'El DNI solo puede contener números'),
    nombre: z.string().min(1, 'El nombre es obligatorio').regex(nameRegex, 'El nombre solo puede contener letras'),
    apellido: z.string().min(1, 'El apellido es obligatorio').regex(nameRegex, 'El apellido solo puede contener letras'),
    telefono: z.string().min(1, 'El teléfono es obligatorio').regex(phoneRegex, 'El teléfono contiene caracteres inválidos'),
    email: z.string().email('El formato del email no es válido').optional().or(z.literal('')),
    direccion: z.string().optional(),
    fechaNacimiento: z.string().optional(),
    fechaIngreso: z.string().optional(),
    estado: z.enum(['activo', 'inactivo', 'suspendido']).optional(),
    tipo: z.enum(['activo', 'adherente', 'vitalicio']).optional(),
    observaciones: z.string().optional(),
    foto: z.string().optional(),
  }),
});

export const updateSocioSchema = z.object({
  body: z.object({
    dni: z.string().optional(),
    nombre: z.string().regex(nameRegex, 'El nombre solo puede contener letras').optional(),
    apellido: z.string().regex(nameRegex, 'El apellido solo puede contener letras').optional(),
    telefono: z.string().regex(phoneRegex, 'El teléfono contiene caracteres inválidos').optional(),
    email: z.string().email('El formato del email no es válido').optional().or(z.literal('')),
    direccion: z.string().optional(),
    fechaNacimiento: z.string().optional(),
    fechaIngreso: z.string().optional(),
    estado: z.enum(['activo', 'inactivo', 'suspendido']).optional(),
    tipo: z.enum(['activo', 'adherente', 'vitalicio']).optional(),
    observaciones: z.string().optional(),
    foto: z.string().optional(),
    numeroSocio: z.string().optional(),
  }),
});
