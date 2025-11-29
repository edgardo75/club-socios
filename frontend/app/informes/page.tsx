'use client';

import { useEffect, useState } from 'react';
import { informesService, InformeEstado, SocioEstado } from '@/services/informes';
import Link from 'next/link';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InformesPage() {
  const [informe, setInforme] = useState<InformeEstado | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'al_dia' | 'deudores'>('deudores');

  useEffect(() => {
    loadInforme();
  }, []);

  const loadInforme = async () => {
    try {
      setLoading(true);
      const data = await informesService.getEstadoSocios();
      setInforme(data);
    } catch (error) {
      console.error('Error cargando informe:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    if (!informe) return;

    const doc = new jsPDF();
    const isDeudores = activeTab === 'deudores';
    const title = isDeudores ? 'Informe de Deudores' : 'Informe de Socios Al Día';
    const data = isDeudores ? informe.deudores : informe.alDia;
    const fecha = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.text('Unión Vecinal Barrio 25 de Mayo', 14, 20);
    doc.setFontSize(14);
    doc.text(title, 14, 30);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${fecha}`, 14, 38);
    doc.text(`Total registros: ${data.length}`, 14, 44);

    if (isDeudores) {
      doc.text(`Deuda Total Estimada: $${informe.resumen.montoTotalAdeudado.toLocaleString()}`, 14, 50);
    }

    // Table
    const tableColumn = isDeudores 
      ? ["DNI", "Nombre", "Apellido", "Tipo", "Meses Adeudados", "Deuda Estimada"]
      : ["DNI", "Nombre", "Apellido", "Tipo", "Último Pago"];

    const tableRows = data.map(socio => {
      if (isDeudores) {
        return [
          socio.dni,
          socio.nombre,
          socio.apellido,
          socio.tipo,
          socio.mesesAdeudados,
          `$${socio.montoAdeudado.toLocaleString()}`
        ];
      } else {
        return [
          socio.dni,
          socio.nombre,
          socio.apellido,
          socio.tipo,
          socio.ultimoPago ? `${socio.ultimoPago.mes} (${new Date(socio.ultimoPago.fecha).toLocaleDateString()})` : 'Sin datos'
        ];
      }
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: isDeudores ? 55 : 50,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: isDeudores ? [220, 38, 38] : [16, 185, 129] }
    });

    doc.save(`informe_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400">Cargando informe...</div>;
  }

  if (!informe) {
    return <div className="text-center py-10 text-red-400">Error al cargar el informe</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Informe de Estado de Socios</h2>
        <button
          onClick={generarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF
        </button>
      </div>

      {/* Resumen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Total Socios</div>
          <div className="text-2xl font-bold text-white">{informe.resumen.totalSocios}</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Al Día</div>
          <div className="text-2xl font-bold text-emerald-400">{informe.resumen.totalAlDia}</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Deudores</div>
          <div className="text-2xl font-bold text-red-400">{informe.resumen.totalDeudores}</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Deuda Total Estimada</div>
          <div className="text-2xl font-bold text-red-400">
            ${informe.resumen.montoTotalAdeudado.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('deudores')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'deudores'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deudores ({informe.deudores.length})
        </button>
        <button
          onClick={() => setActiveTab('al_dia')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'al_dia'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Al Día ({informe.alDia.length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-medium tracking-wider">
            <tr>
              <th className="px-6 py-4">Socio</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Último Pago</th>
              {activeTab === 'deudores' && (
                <>
                  <th className="px-6 py-4">Meses Adeudados</th>
                  <th className="px-6 py-4">Deuda Estimada</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {(activeTab === 'deudores' ? informe.deudores : informe.alDia).map((socio) => (
              <tr key={socio.dni} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-white">{socio.nombre} {socio.apellido}</div>
                    <div className="text-sm text-slate-500">DNI: {socio.dni}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize text-slate-300">{socio.tipo}</span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {socio.ultimoPago ? (
                    <div>
                      <div>{socio.ultimoPago.mes}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(socio.ultimoPago.fecha).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500">Sin pagos registrados</span>
                  )}
                </td>
                {activeTab === 'deudores' && (
                  <>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 font-medium">
                        {socio.mesesAdeudados} meses
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      ${socio.montoAdeudado.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/pagos"
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                      >
                        Registrar Pago
                      </Link>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {(activeTab === 'deudores' ? informe.deudores : informe.alDia).length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  No hay socios en esta categoría
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
