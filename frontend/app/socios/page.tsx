import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { sociosService } from '@/services/socios';
import SociosList from '@/components/SociosList';

export default async function SociosPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['socios', '', false],
    queryFn: () => sociosService.getAll('', false),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SociosList />
    </HydrationBoundary>
  );
}
