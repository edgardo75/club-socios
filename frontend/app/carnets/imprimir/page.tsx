'use client';

import { useState, useEffect, useRef } from 'react';
import { sociosService } from '@/services/socios';
import { Socio } from '@/types/socio';
import QRCode from 'react-qr-code';

import { normalizeImageUrl } from '@/utils/image';

import { toBlob } from 'html-to-image';

export default function ImprimirCarnetPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [sharing, setSharing] = useState(false);
  const carnetRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [selectedSocio]);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const data = await sociosService.getAll(search);
        setSocios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSocios();
  }, [search]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!carnetRef.current || !selectedSocio) return;
    setSharing(true);

    try {
      let blob;
      let fileName = `carnet-${selectedSocio.dni}.png`;
      let shareTitle = 'Carnet de Socio';

      try {
        // Try generating full carnet image
        blob = await toBlob(carnetRef.current, { 
          quality: 0.95, 
          backgroundColor: '#ffffff',
          cacheBust: true
        });
      } catch (e) {
        console.warn('Error generando carnet completo, intentando solo QR:', e);
        // Fallback: Try generating only QR code
        if (qrRef.current) {
          blob = await toBlob(qrRef.current, { 
            quality: 0.95, 
            backgroundColor: '#ffffff' 
          });
          fileName = `qr-acceso-${selectedSocio.dni}.png`;
          shareTitle = 'Código de Acceso';
          // Silently fall back to QR code
        }
      }

      if (!blob) throw new Error('Error generando imagen');

      const file = new File([blob], fileName, { type: 'image/png' });

      // Try Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: `${shareTitle} de ${selectedSocio.nombre} ${selectedSocio.apellido}`,
        });
      } else {
        // Fallback: Download image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        alert('Imagen descargada. Puedes compartirla manualmente por WhatsApp.');
      }
    } catch (error) {
      console.error('Error compartiendo:', error);
      alert('Hubo un error al generar la imagen.');
    } finally {
      setSharing(false);
    }
  };



  return (
    <div className="space-y-8 print:space-y-0">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 85.6mm 53.98mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* Controls - Hidden on print */}
      <div className="space-y-6 print:hidden">
        <h2 className="text-3xl font-bold text-white">Impresión de Carnets</h2>
        
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <label className="block text-sm font-medium text-slate-400 mb-2">Buscar Socio</label>
          <input
            type="text"
            placeholder="Nombre o DNI..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
            {socios.map(socio => (
              <button
                key={socio.dni}
                onClick={() => setSelectedSocio(socio)}
                className={`p-3 rounded-lg text-left transition-colors border ${
                  selectedSocio?.dni === socio.dni
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">{socio.nombre} {socio.apellido}</div>
                <div className="text-sm opacity-70">{socio.dni}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedSocio && (
          <div className="flex justify-end gap-4">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {sharing ? (
                <span>Generando...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  COMPARTIR
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              IMPRIMIR CARNET
            </button>
          </div>
        )}
      </div>

      {/* Preview / Print Area */}
      {selectedSocio && (
        <div className="flex justify-center items-center py-10 print:p-0 print:block">
          {/* Carnet Card - CR80 Size (85.6mm x 53.98mm) */}
          <div 
            ref={carnetRef}
            className="w-[85.6mm] h-[53.98mm] relative shadow-2xl print:shadow-none rounded-xl print:rounded-none bg-white text-slate-900 print:border print:border-slate-300"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Header - Fixed Height */}
            <div className="absolute top-0 left-0 w-full h-[16mm] bg-[#0f172a] flex items-center justify-between px-4 z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-bold text-[10px] text-white">UV</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[11px] text-white uppercase leading-tight">Unión Vecinal</span>
                  <span className="text-[8px] text-blue-200 uppercase tracking-tighter leading-tight mt-0.5">Barrio 25 de Mayo</span>
                </div>
              </div>
              <div className="text-[9px] font-mono text-blue-200">
                #{selectedSocio.numeroSocio && selectedSocio.numeroSocio !== 'NaN' ? selectedSocio.numeroSocio : `SOC-${selectedSocio.dni.slice(-6)}`}
              </div>
            </div>

            {/* Content Area - Shifted down by Header Height */}
            <div className="absolute top-[16mm] bottom-[8mm] left-0 w-full p-2 flex gap-3 items-center z-10">
              {/* Photo Area */}
              <div className="w-[26mm] h-[28mm] bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-200 relative">
                {selectedSocio.foto && !imgError ? (
                  <img 
                    key={selectedSocio.foto}
                    src={`${normalizeImageUrl(selectedSocio.foto)}?t=${Date.now()}`} 
                    alt="Foto" 
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[7px] uppercase">{selectedSocio.foto ? 'Error' : 'Sin Foto'}</span>
                  </div>
                )}
              </div>

              {/* Info - Centered vertically in the body area */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-hidden">
                <div>
                  <h2 className="text-[15px] font-bold leading-none text-slate-900 uppercase tracking-tight">
                    {selectedSocio.apellido}
                  </h2>
                  <h3 className="text-[13px] font-semibold leading-tight text-slate-600 mt-0.5">
                    {selectedSocio.nombre}
                  </h3>
                </div>
                
                <div className="space-y-1 mt-1">
                  <div className="flex flex-col leading-none">
                    <span className="text-[7px] text-slate-400 uppercase font-bold tracking-widest">DNI</span>
                    <span className="font-mono text-[14px] font-bold text-slate-900">{selectedSocio.dni}</span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[7px] text-slate-400 uppercase font-bold tracking-widest">Vencimiento</span>
                    <span className="font-mono text-[14px] font-bold text-emerald-600">
                      {selectedSocio.proximaRevisionMedica 
                        ? new Date(selectedSocio.proximaRevisionMedica).toLocaleDateString()
                        : '---'}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Area */}
              <div ref={qrRef} className="bg-white p-1 rounded border border-slate-100 shrink-0">
                <QRCode 
                  value={selectedSocio.dni}
                  size={52}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[8mm] bg-slate-50 border-t border-slate-200 flex items-center justify-center z-20">
              <p className="text-[7px] text-slate-500 uppercase tracking-widest font-bold leading-normal">
                Unión Vecinal Barrio 25 de Mayo
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
