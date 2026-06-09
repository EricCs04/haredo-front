import { api } from '../api/api';

export async function getDashboardKpis() {
  const response = await api.get('/dashboard/kpis');
  return response.data;
}