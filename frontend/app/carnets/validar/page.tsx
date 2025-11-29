'use client';

import { useState, useEffect, useRef } from 'react';
import { validacionService } from '@/services/validacion';
import { ValidacionCarnet } from '@/types/validacion';

import { normalizeImageUrl } from '@/utils/image';

export default function ValidarCarnetPage() {
  const [dni, setDni] = useState('');
  const [resultado, setResultado] = useState<ValidacionCarnet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on load and after validation
  useEffect(() => {
    inputRef.current?.focus();
  }, [resultado]);

  const handleValidar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni) return;

    setLoading(true);
    setError('');
    setResultado(null);

    try {
      const data = await validacionService.validarCarnet(dni);
      setResultado(data);
    } catch (err: any) {
      setError('Error al validar el carnet. Verifique la conexión.');
      console.error(err);
    } finally {
      setLoading(false);
      setDni(''); // Clear input for next scan
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Control de Acceso</h1>
        <h2 className="text-xl text-blue-400">Unión Vecinal Barrio 25 de Mayo</h2>
        <p className="text-slate-400">Ingrese el DNI o escanee el código del carnet</p>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <form onSubmit={handleValidar} className="flex gap-4">
          <input
            ref={inputRef}
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="DNI del socio..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !dni}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'VALIDAR'}
          </button>
        </form>
      </div>

      {/* Result Area */}
      {resultado && (
        <div className={`transform transition-all duration-500 ${resultado.valido ? 'scale-100' : 'scale-100'}`}>
          <div className={`rounded-3xl p-1 overflow-hidden ${
            resultado.valido 
              ? 'bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_0_50px_rgba(16,185,129,0.3)]' 
              : 'bg-gradient-to-br from-red-500 to-rose-700 shadow-[0_0_50px_rgba(244,63,94,0.3)]'
          }`}>
            <div className="bg-slate-950 rounded-[22px] p-8 h-full">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Status Icon or Photo */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-4 ${
                  resultado.valido ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' : 'bg-red-500/20 text-red-500 border-red-500/50'
                }`}>
                  {resultado.socio.foto ? (
                    <img 
                      key={resultado.socio.foto}
                      src={normalizeImageUrl(resultado.socio.foto)} 
                      alt="Socio" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    resultado.valido ? (
                      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h2 className={`text-5xl font-black tracking-tight mb-2 ${
                      resultado.valido ? 'text-emerald-400' : 'text-red-500'
                    }`}>
                      {resultado.valido ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
                    </h2>
                    <p className="text-3xl text-white font-medium">
                      {resultado.socio.nombre} {resultado.socio.apellido}
                    </p>
                    <p className="text-xl text-slate-400">DNI: {resultado.socio.dni}</p>
                  </div>

                  {!resultado.valido && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <h3 className="text-red-400 font-bold mb-2">Motivos:</h3>
                      <ul className="list-disc list-inside text-red-300 space-y-1">
                        {resultado.razones.map((razon, i) => (
                          <li key={i}>{razon}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 text-sm uppercase font-bold">Último Pago</span>
                      <p className="text-white text-lg">
                        {resultado.ultimoPago ? `${resultado.ultimoPago.mes} (${new Date(resultado.ultimoPago.fecha).toLocaleDateString()})` : 'Sin registros'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm uppercase font-bold">Revisión Médica</span>
                      <p className={`text-lg ${resultado.proximaRevisionMedica ? 'text-white' : 'text-red-400'}`}>
                        {resultado.proximaRevisionMedica ? new Date(resultado.proximaRevisionMedica).toLocaleDateString() : 'Vencida / Inexistente'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center text-xl font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
