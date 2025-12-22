'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocios, useDeleteSocio, useRestoreSocio, useHasDeletedSocios } from '@/hooks/useSocios';

export default function SociosList() {
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  // Hooks
  const { data: socios = [], isLoading, error } = useSocios(search, showDeleted);
  const { data: hasDeletedSocios = false } = useHasDeletedSocios();
  const deleteSocio = useDeleteSocio();
  const restoreSocio = useRestoreSocio();

  // Reset showDeleted if no deleted socios exist
  if (!hasDeletedSocios && showDeleted) {
    setShowDeleted(false);
  }

  const handleDelete = async (dni: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este socio?')) return;
    try {
      await deleteSocio.mutateAsync(dni);
    } catch (err) {
      alert('Error al eliminar el socio');
    }
  };

  const handleRestore = async (dni: string) => {
    if (!confirm('¿Deseas restaurar este socio?')) return;
    try {
      await restoreSocio.mutateAsync(dni);
    } catch (err) {
      alert('Error al restaurar el socio');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Gestión de Socios</h2>
        <div className="flex gap-4">
          {hasDeletedSocios && (
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium border ${
                showDeleted 
                  ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {showDeleted ? 'Ocultar Eliminados' : 'Mostrar Eliminados'}
            </button>
          )}
          <Link 
            href="/socios/nuevo" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
          >
            + Nuevo Socio
          </Link>
        </div>
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

      {isLoading ? (
        <div className="text-center py-10 text-slate-400">Cargando socios...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-400">Error al cargar los socios</div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">

          {/* Mobile View (Cards) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {socios.map((socio) => (
              <div key={socio.id || socio.dni} className={`bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm ${socio.deletedAt ? 'bg-red-900/10' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg">
                      {socio.nombre[0]}{socio.apellido[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">
                        {socio.nombre} {socio.apellido}
                      </div>
                      <div className="text-slate-500 text-sm">{socio.dni}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    socio.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    socio.estado === 'suspendido' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {socio.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-400">
                  <div>
                    <span className="block text-slate-600 text-xs uppercase mb-1">Tipo</span>
                    <span className={`font-medium ${
                      socio.tipo === 'vitalicio' ? 'text-purple-400' :
                      socio.tipo === 'adherente' ? 'text-blue-400' :
                      'text-slate-300'
                    }`}>
                      {(socio.tipo || 'activo').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-600 text-xs uppercase mb-1">Ingreso</span>
                    {new Date(socio.fechaIngreso).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">
                     <span className="block text-slate-600 text-xs uppercase mb-1">Email</span>
                     {socio.email || 'Sin email'}
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-800/50">
                  {socio.deletedAt ? (
                    <button
                      onClick={() => handleRestore(socio.dni)}
                      className="flex-1 py-2 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors font-medium text-sm"
                    >
                      Restaurar
                    </button>
                  ) : (
                    <>
                      <Link 
                        href={`/socios/${socio.dni}/editar`}
                        className="flex-1 py-2 text-center text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors font-medium text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(socio.dni)}
                        className="flex-1 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors font-medium text-sm"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {socios.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                {showDeleted ? 'No hay socios eliminados' : 'No se encontraron socios'}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <table className="w-full text-left hidden md:table">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-medium tracking-wider">
              <tr>
                <th className="px-6 py-4">Socio</th>
                <th className="px-6 py-4">DNI</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {socios.map((socio) => (
                <tr key={socio.id || socio.dni} className={`transition-colors ${socio.deletedAt ? 'bg-red-900/10 hover:bg-red-900/20' : 'hover:bg-slate-800/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                        {socio.nombre[0]}{socio.apellido[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {socio.nombre} {socio.apellido}
                          {socio.deletedAt && <span className="ml-2 text-xs text-red-400">(Eliminado)</span>}
                        </div>
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
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      socio.tipo === 'vitalicio' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      socio.tipo === 'adherente' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-slate-700/50 text-slate-300 border-slate-600/50'
                    }`}>
                      {(socio.tipo || 'activo').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(socio.fechaIngreso).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {socio.deletedAt ? (
                      <button
                        onClick={() => handleRestore(socio.dni)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <>
                        <Link 
                          href={`/socios/${socio.dni}/editar`}
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(socio.dni)}
                          className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium ml-2"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {socios.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    {showDeleted ? 'No hay socios eliminados' : 'No se encontraron socios'}
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
