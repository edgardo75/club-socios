'use client';

import { useParams } from 'next/navigation';
import SocioForm from '@/components/SocioForm';
import { useSocio } from '@/hooks/useSocios';

export default function EditarSocioPage() {
  const params = useParams();
  const dni = params.dni as string;
  
  const { data: socio, isLoading, error } = useSocio(dni);

  if (isLoading) return <div className="text-white p-8">Cargando...</div>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          Error al cargar el socio
        </div>
      </div>
    );
  }

  if (!socio) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Editar Socio</h1>
      <SocioForm initialData={socio} isEditing={true} />
    </div>
  );
}
