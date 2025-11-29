'use client';

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SocioForm from '@/components/SocioForm';
import { sociosService } from '@/services/socios';
import { Socio } from '@/types/socio';
import { UpdateSocioDto } from '@/types/socio'; // Assuming this DTO exists

export default function EditarSocioPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState<UpdateSocioDto>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    foto: '',
    estado: 'activo',
    tipo: 'activo',
    observaciones: '',
    ultimaRevisionMedica: '',
    proximaRevisionMedica: ''
  });

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        const socio = await sociosService.getByDni(params.dni as string);
        setFormData({
          nombre: socio.nombre,
          apellido: socio.apellido,
          email: socio.email,
          telefono: socio.telefono,
          direccion: socio.direccion,
          fechaNacimiento: socio.fechaNacimiento,
          fechaIngreso: socio.fechaIngreso,
          foto: socio.foto,
          estado: socio.estado,
          tipo: socio.tipo || 'activo',
          observaciones: socio.observaciones,
          ultimaRevisionMedica: socio.ultimaRevisionMedica,
          proximaRevisionMedica: socio.proximaRevisionMedica
        });
        if (socio.foto) {
          setPreviewUrl(socio.foto);
        }
      } catch (err) {
        setError('Error al cargar el socio');
      } finally {
        setLoading(false);
      }
    };
    if (params.dni) {
      fetchSocio();
    }
  }, [params.dni]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(formData.foto || ''); // Revert to existing photo or empty
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (uploadMode === 'file' && selectedFile) {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== 'foto') {
            data.append(key, value as string);
          }
        });
        data.append('foto', selectedFile);
        
        await sociosService.update(params.dni as string, data);
      } else {
        await sociosService.update(params.dni as string, formData);
      }
      
      router.push('/socios');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Editar Socio</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Estado</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.estado}
                onChange={e => setFormData({...formData, estado: e.target.value as any})}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Socio</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value as any})}
              >
                <option value="activo">Activo</option>
                <option value="adherente">Adherente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nombre</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Apellido</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.apellido}
                onChange={e => setFormData({...formData, apellido: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Foto</label>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => {
                  setUploadMode('url');
                  setSelectedFile(null); // Clear selected file when switching to URL mode
                  setPreviewUrl(formData.foto || ''); // Show existing URL photo
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  uploadMode === 'url' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                URL de Imagen
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('file');
                  setFormData({...formData, foto: ''}); // Clear URL when switching to file mode
                  setPreviewUrl(''); // Clear preview when switching to file mode
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  uploadMode === 'file' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Subir Archivo
              </button>
            </div>

            {uploadMode === 'url' ? (
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.foto}
                onChange={e => setFormData({...formData, foto: e.target.value})}
              />
            ) : (
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={handleFileChange}
                />
                {(previewUrl) && (
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-slate-700">
                    <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Teléfono</label>
              <input
                type="tel"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Dirección</label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.direccion}
              onChange={e => setFormData({...formData, direccion: e.target.value})}
            />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Fechas Importantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Fecha de Nacimiento</label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.fechaNacimiento}
                onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Fecha de Ingreso</label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.fechaIngreso}
                onChange={e => setFormData({...formData, fechaIngreso: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Última Revisión Médica</label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.ultimaRevisionMedica}
                onChange={e => setFormData({...formData, ultimaRevisionMedica: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Próxima Revisión Médica</label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.proximaRevisionMedica}
                onChange={e => setFormData({...formData, proximaRevisionMedica: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Observaciones</h2>
          <div>
            <textarea
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.observaciones}
              onChange={e => setFormData({...formData, observaciones: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/socios')}
            className="px-6 py-3 rounded-lg text-white bg-slate-700 hover:bg-slate-600 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
