import { api } from '../api/api';

export const createDonation = async (needId: string, quantity: number) => {
  const res = await api.post('/donations', { needId, quantity });
  return res.data;
};

export const getMyDonations = async () => {
  const res = await api.get('/donations/my');
  return res.data;
};

export const confirmDonation = async (id: string, code: string) => {
  const res = await api.patch(`/donations/${id}/confirm`, {
    code,
  });

  return res.data;
};
export const getDonationById = async (id: string) => {
  const res = await api.get(`/donations/${id}`);
  return res.data;
};