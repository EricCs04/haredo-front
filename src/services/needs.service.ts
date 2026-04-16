import { api } from '../api/api';

export const getNeeds = async () => {
  const res = await api.get('/needs');
  return res.data;
};

export const createNeed = async (data: {
  title: string;
  description: string;
  category: string;
  quantityNeeded: number;
}) => {
  const res = await api.post('/needs', data);
  return res.data;
};