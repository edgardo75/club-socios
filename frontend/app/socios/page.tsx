'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Socio } from '@/types/socio';
import { sociosService } from '@/services/socios';

export default function SociosPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchSocios = async () => {
    try {
      setLoading(true);
      const data = await sociosService.getAll(search);
      setSocios(data);
    } catch (err) {
      setError('Error al cargar los socios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Gestión de Socios</h2>
        <Link 
          href="/socios/nuevo" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
        >
          + Nuevo Socio
        </Link>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Cargando socios...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-400">{error}</div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-medium tracking-wider">
              <tr>
                <th className="px-6 py-4">Socio</th>
                <th className="px-6 py-4">DNI</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {socios.map((socio) => (
                <tr key={socio.id || socio.dni} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                        {socio.nombre[0]}{socio.apellido[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{socio.nombre} {socio.apellido}</div>
                        <div className="text-sm text-slate-500">{socio.email || 'Sin email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{socio.dni}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      socio.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      socio.estado === 'suspendido' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {socio.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(socio.fechaIngreso).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link 
                      href={`/socios/${socio.dni}/editar`}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {socios.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No se encontraron socios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
