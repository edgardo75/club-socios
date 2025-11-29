'use client';

import { useState, useEffect } from 'react';
import { Pago, CreatePagoDto } from '@/types/pago';
import { pagosService } from '@/services/pagos';
import { sociosService } from '@/services/socios';
import { configService, AppConfig } from '@/services/config';
import { Socio } from '@/types/socio';

import SearchableSelect from '@/components/SearchableSelect';

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [config, setConfig] = useState<AppConfig>({ cuotaActivo: 0, cuotaAdherente: 0 });
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const [formData, setFormData] = useState<CreatePagoDto>({
    socioDni: '',
    monto: 0,
    mes: new Date().toISOString().slice(0, 7), // YYYY-MM
    metodoPago: 'efectivo',
    concepto: 'Cuota Mensual'
  });

  const [configFormData, setConfigFormData] = useState<AppConfig>({
    cuotaActivo: 0,
    cuotaAdherente: 0
  });

  const fetchData = async () => {
    try {
      const [pagosData, sociosData, configData] = await Promise.all([
        pagosService.getAll(),
        sociosService.getAll(),
        configService.getConfig()
      ]);
      setPagos(pagosData);
      setSocios(sociosData);
      setConfig(configData);
      setConfigFormData(configData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-fill amount when socio is selected
  useEffect(() => {
    if (formData.socioDni) {
      const socio = socios.find(s => s.dni === formData.socioDni);
      if (socio) {
        const monto = socio.tipo === 'adherente' ? config.cuotaAdherente : config.cuotaActivo;
        setFormData(prev => ({ ...prev, monto }));
      }
    }
  }, [formData.socioDni, config, socios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pagosService.create(formData);
      setShowModal(false);
      fetchData();
      // Reset form
      setFormData({
        socioDni: '',
        monto: 0,
        mes: new Date().toISOString().slice(0, 7),
        metodoPago: 'efectivo',
        concepto: 'Cuota Mensual'
      });
    } catch (error) {
      console.error('Error creating pago:', error);
      alert('Error al registrar el pago');
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedConfig = await configService.updateConfig(configFormData);
      setConfig(updatedConfig);
      setShowConfigModal(false);
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Error al actualizar la configuración');
    }
  };

  const getSocioName = (dni: string) => {
    const socio = socios.find(s => s.dni === dni);
    return socio ? `${socio.nombre} ${socio.apellido}` : dni;
  };

  const socioOptions = socios.map(s => ({
    value: s.dni,
    label: `${s.nombre} ${s.apellido}`,
    subLabel: `DNI: ${s.dni} - ${s.tipo ? s.tipo.toUpperCase() : 'ACTIVO'}`
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Gestión de Pagos</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors font-medium border border-slate-700"
          >
            ⚙️ Configuración
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
          >
            + Registrar Pago
          </button>
        </div>
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Configuración de Cuotas</h3>
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Cuota Socio Activo</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 pl-8 text-white"
                    value={configFormData.cuotaActivo}
                    onChange={e => setConfigFormData({...configFormData, cuotaActivo: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Cuota Socio Adherente</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 pl-8 text-white"
                    value={configFormData.cuotaAdherente}
                    onChange={e => setConfigFormData({...configFormData, cuotaAdherente: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Nuevo Pago</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <SearchableSelect
                  label="Socio"
                  options={socioOptions}
                  value={formData.socioDni}
                  onChange={(value) => setFormData({...formData, socioDni: value})}
                  placeholder="Buscar socio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Mes</label>
                <input
                  type="month"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                  value={formData.mes}
                  onChange={e => setFormData({...formData, mes: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 pl-8 text-white"
                    value={formData.monto}
                    onChange={e => setFormData({...formData, monto: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Método de Pago</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                  value={formData.metodoPago}
                  onChange={e => setFormData({...formData, metodoPago: e.target.value as any})}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-medium tracking-wider">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Socio</th>
              <th className="px-6 py-4">Mes</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Método</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pagos.map((pago) => (
              <tr key={pago.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 text-slate-400">
                  {new Date(pago.fecha).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  {getSocioName(pago.socioDni)}
                </td>
                <td className="px-6 py-4 text-slate-300">{pago.mes}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">
                  ${pago.monto}
                </td>
                <td className="px-6 py-4 text-slate-400 capitalize">
                  {pago.metodoPago}
                </td>
              </tr>
            ))}
            {pagos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No hay pagos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
