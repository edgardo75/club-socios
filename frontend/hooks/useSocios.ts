import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sociosService } from '@/services/socios';
import { CreateSocioDto, UpdateSocioDto } from '@/types/socio';

export const useSocios = (search?: string, includeDeleted: boolean = false) => {
  return useQuery({
    queryKey: ['socios', search, includeDeleted],
    queryFn: () => sociosService.getAll(search, includeDeleted),
  });
};

export const useSocio = (dni: string) => {
  return useQuery({
    queryKey: ['socio', dni],
    queryFn: () => sociosService.getByDni(dni),
    enabled: !!dni,
  });
};

export const useHasDeletedSocios = () => {
  return useQuery({
    queryKey: ['hasDeletedSocios'],
    queryFn: () => sociosService.checkHasDeleted(),
  });
};

export const useCreateSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSocioDto | FormData) => sociosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
    },
  });
};

export const useUpdateSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dni, data }: { dni: string; data: UpdateSocioDto | FormData }) => 
      sociosService.update(dni, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['socio', variables.dni] });
    },
  });
};

export const useDeleteSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dni: string) => sociosService.delete(dni),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['hasDeletedSocios'] });
    },
  });
};

export const useRestoreSocio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dni: string) => sociosService.restore(dni),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socios'] });
      queryClient.invalidateQueries({ queryKey: ['hasDeletedSocios'] });
    },
  });
};
