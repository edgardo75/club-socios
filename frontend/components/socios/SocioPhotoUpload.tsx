import { CreateSocioDto } from '@/types/socio';
import { useRef, useState } from 'react';

interface SocioPhotoUploadProps {
  formData: CreateSocioDto;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (file: File | null) => void;
}

export default function SocioPhotoUpload({ formData, handleChange, onFileSelect }: SocioPhotoUploadProps) {
  const [tab, setTab] = useState<'url' | 'file'>('file');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      onFileSelect(null);
      setPreview(null);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setTab('file')}
          className={`text-sm font-medium pb-1 transition-colors ${
            tab === 'file' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Subir desde PC
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`text-sm font-medium pb-1 transition-colors ${
            tab === 'url' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Usar URL
        </button>
      </div>

      {tab === 'file' ? (
        <div className="space-y-2">
          {!preview ? (
            <div 
              className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 hover:bg-slate-800/30 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm text-slate-400">Click para seleccionar foto</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative w-32 h-32 mx-auto">
              <img 
                src={preview} 
                alt="Vista previa" 
                className="w-full h-full object-cover rounded-lg border border-slate-700" 
              />
              <button
                type="button"
                onClick={clearFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Pegar URL de la imagen</label>
          <input
            type="url"
            name="foto"
            value={formData.foto || ''}
            onChange={handleChange}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}
