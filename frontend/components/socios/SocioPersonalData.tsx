import { CreateSocioDto } from '@/types/socio';

interface SocioPersonalDataProps {
  formData: CreateSocioDto;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing: boolean;
}

export default function SocioPersonalData({ formData, handleChange, isEditing }: SocioPersonalDataProps) {
  return (
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
        <label className="text-sm font-medium text-slate-400">Número de Socio</label>
        <input
          type="text"
          name="numeroSocio"
          value={formData.numeroSocio || ''}
          onChange={handleChange}
          placeholder="Auto-generado si se deja vacío"
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
        <label className="text-sm font-medium text-slate-400">Tipo de Socio</label>
        <select
          name="tipo"
          value={formData.tipo || 'activo'}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="activo">Activo</option>
          <option value="adherente">Adherente</option>
          <option value="vitalicio">Vitalicio</option>
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
    </div>
  );
}
