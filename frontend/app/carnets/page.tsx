import Link from 'next/link';

export default function CarnetsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Gestión de Carnets</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/carnets/validar"
          className="group relative overflow-hidden bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Validar Ingreso</h3>
            <p className="text-slate-400 text-lg">
              Panel de control para portería. Escanear carnets o ingresar DNI para verificar acceso.
            </p>
          </div>
        </Link>

        <Link 
          href="/carnets/imprimir"
          className="group relative overflow-hidden bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h-4c-1.5 0-2-1.116-2-2m11 0h2" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="h-16 w-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h-4c-1.5 0-2-1.116-2-2m11 0h2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Imprimir Carnets</h3>
            <p className="text-slate-400 text-lg">
              Generar carnets digitales o para impresión con código QR.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
