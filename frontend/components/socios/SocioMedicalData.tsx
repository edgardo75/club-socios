import { CreateSocioDto } from '@/types/socio';

interface SocioMedicalDataProps {
  formData: CreateSocioDto;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SocioMedicalData({ formData, handleChange }: SocioMedicalDataProps) {
  return (
    <div className="pt-4 border-t border-slate-800">
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
  );
}
