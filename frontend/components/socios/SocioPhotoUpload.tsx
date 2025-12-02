import { CreateSocioDto } from '@/types/socio';

interface SocioPhotoUploadProps {
  formData: CreateSocioDto;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SocioPhotoUpload({ formData, handleChange }: SocioPhotoUploadProps) {
  return (
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
  );
}
