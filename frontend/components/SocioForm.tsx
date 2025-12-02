'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateSocioDto, Socio } from '@/types/socio';
import { useCreateSocio, useUpdateSocio } from '@/hooks/useSocios';
import SocioPersonalData from './socios/SocioPersonalData';
import SocioContactData from './socios/SocioContactData';
import SocioMedicalData from './socios/SocioMedicalData';
import SocioPhotoUpload from './socios/SocioPhotoUpload';

interface SocioFormProps {
  initialData?: Socio;
  isEditing?: boolean;
}

export default function SocioForm({ initialData, isEditing = false }: SocioFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const createSocio = useCreateSocio();
  const updateSocio = useUpdateSocio();
  
  const [formData, setFormData] = useState<CreateSocioDto>({
    dni: initialData?.dni || '',
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    email: initialData?.email || '',
    telefono: initialData?.telefono || '',
    fechaNacimiento: initialData?.fechaNacimiento?.split('T')[0] || '',
    direccion: initialData?.direccion || '',
    estado: initialData?.estado || 'activo',
    foto: initialData?.foto || '',
    observaciones: initialData?.observaciones || '',
    fechaIngreso: initialData?.fechaIngreso?.split('T')[0] || new Date().toISOString().split('T')[0],
    ultimaRevisionMedica: initialData?.ultimaRevisionMedica?.split('T')[0] || '',
    proximaRevisionMedica: initialData?.proximaRevisionMedica?.split('T')[0] || '',
    numeroSocio: initialData?.numeroSocio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // 1. Campos Obligatorios
    if (!formData.dni || !formData.nombre || !formData.apellido || !formData.telefono) {
      setError('Complete los campos obligatorios: DNI, Nombre, Apellido y Teléfono.');
      return false;
    }

    // 2. Validar DNI (Solo números, 7-8 dígitos)
    const dniRegex = /^\d{7,8}$/;
    if (!dniRegex.test(formData.dni)) {
      setError('El DNI debe contener solo números (7 u 8 dígitos).');
      return false;
    }

    // 3. Validar Teléfono (Números, espacios, guiones, +)
    const phoneRegex = /^[\d\s\-\+]+$/;
    if (!phoneRegex.test(formData.telefono)) {
      setError('El teléfono contiene caracteres inválidos.');
      return false;
    }

    // 4. Validar Nombre y Apellido (Letras y espacios)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(formData.nombre) || !nameRegex.test(formData.apellido)) {
      setError('Nombre y Apellido solo pueden contener letras.');
      return false;
    }

    // 5. Validar Email (si existe)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('El formato del email no es válido.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');

    try {
      if (isEditing && initialData) {
        await updateSocio.mutateAsync({ dni: initialData.dni, data: formData });
      } else {
        await createSocio.mutateAsync(formData);
      }
      
      setSuccess('Socio guardado correctamente');
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push('/socios');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Error al guardar el socio');
    }
  };

  const isLoading = createSocio.isPending || updateSocio.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl max-w-4xl mx-auto">
      
      <div className="space-y-6">
        {/* Sección 1: Datos Personales */}
        <SocioPersonalData 
          formData={formData} 
          handleChange={handleChange} 
          isEditing={isEditing} 
        />

        {/* Sección 2: Foto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <SocioPhotoUpload 
             formData={formData} 
             handleChange={handleChange} 
           />
        </div>

        {/* Sección 3: Datos de Contacto */}
        <SocioContactData 
          formData={formData} 
          handleChange={handleChange} 
        />

        {/* Sección 4: Datos Médicos */}
        <SocioMedicalData 
          formData={formData} 
          handleChange={handleChange} 
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-800">
        <div className="flex-1">
          {error && (
            <div className="text-red-400 text-sm font-medium bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/50">
              {error}
            </div>
          )}
          {success && (
            <div className="text-emerald-400 text-sm font-medium bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-900/50">
              {success}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !!success}
            className={`px-6 py-2 rounded-lg transition-colors font-medium shadow-lg ${
              success 
                ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {success ? '¡Guardado!' : isLoading ? 'Guardando...' : isEditing ? 'Actualizar Socio' : 'Crear Socio'}
          </button>
        </div>
      </div>
    </form>
  );
}
