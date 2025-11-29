'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateSocioDto, Socio } from '@/types/socio';
import { sociosService } from '@/services/socios';

interface SocioFormProps {
  initialData?: Socio;
  isEditing?: boolean;
}

export default function SocioForm({ initialData, isEditing = false }: SocioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && initialData) {
        await sociosService.update(initialData.dni, formData);
      } else {
        await sociosService.create(formData);
      }
      router.push('/socios');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el socio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">DNI *</label>
          <input
            type="text"
            name="dni"
            required
            disabled={isEditing}
            value={formData.dni}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Foto (URL)</label>
          <input
            type="url"
            name="foto"
            value={formData.foto || ''}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Nombre *</label>
          <input
            type="text"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Apellido *</label>
          <input
            type="text"
            name="apellido"
            required
            value={formData.apellido}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Fecha de Ingreso</label>
          <input
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-medium text-white mb-4">Información Médica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Última Revisión</label>
              <input
                type="date"
                name="ultimaRevisionMedica"
                value={formData.ultimaRevisionMedica || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Vencimiento Revisión</label>
              <input
                type="date"
                name="proximaRevisionMedica"
                value={formData.proximaRevisionMedica || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-400">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-400">Observaciones</label>
          <textarea
            name="observaciones"
            rows={3}
            value={formData.observaciones}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar Socio' : 'Crear Socio'}
        </button>
      </div>
    </form>
  );
}
