// src/utils/status.utils.ts

export const getNeedStatusLabel = (
  status?: string,
) => {
  const map: Record<string, string> = {
    open: 'Aberta',
    in_progress: 'Em andamento',
    fulfilled: 'Meta atingida',
    completed: 'Encerrada',
    cancelled: 'Cancelada',
  };

  return map[status || ''] || status;
};