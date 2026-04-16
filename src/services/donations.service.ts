import { api } from '../api/api';

export const createDonation = async (needId: string, quantity: number) => {
  const res = await api.post('/donations', { needId, quantity });
  return res.data;
};

export const getMyDonations = async () => {
  const res = await api.get('/donations/my');
  return res.data;
};