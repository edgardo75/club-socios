import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900/50 to-slate-900 p-8 rounded-2xl border border-blue-800/30">
        <h1 className="text-4xl font-bold text-white mb-4">Bienvenido al Club</h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Sistema de gestión integral para socios, carnets y pagos.
          Selecciona una opción del menú para comenzar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/socios"
          className="group bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-900/10"
        >
          <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Socios</h3>
          <p className="text-slate-400">Gestiona el padrón de socios, altas, bajas y modificaciones.</p>
        </Link>

        <Link 
          href="/carnets"
          className="group bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-900/10"
        >
          <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Carnets</h3>
          <p className="text-slate-400">Emisión y control de acceso. Validar ingreso de socios.</p>
        </Link>

        <Link 
          href="/pagos"
          className="group bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-900/10"
        >
          <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pagos</h3>
          <p className="text-slate-400">Control de cuotas y registro de pagos.</p>
        </Link>

        <Link 
          href="/informes"
          className="group bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-900/10"
        >
          <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Informes</h3>
          <p className="text-slate-400">Estado de deuda y socios al día.</p>
        </Link>
      </div>
    </div>
  );
}
