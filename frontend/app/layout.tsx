import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unión Vecinal Barrio 25 de Mayo",
  description: "Sistema de Gestión de Socios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex`}
      >
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="font-bold text-white">UV</span>
              </div>
              <h1 className="font-bold text-white leading-tight">Unión Vecinal<br/><span className="text-sm font-normal text-slate-400">Barrio 25 de Mayo</span></h1>
            </Link>
          </div>
          <nav className="p-4 space-y-2">
            <a href="/socios" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              Socios
            </a>
            <a href="/carnets" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              Carnets
            </a>
            <a href="/pagos" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              Pagos
            </a>
            <a href="/informes" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              Informes
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
