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
  priority: string;
  deadline: string;
}) => {
  const res = await api.post('/needs', data);
  return res.data;
};


export const getNeedById = async (id: string) => {
  const res = await api.get(`/needs/${id}`);
  return res.data;
};


export const completeNeed = async (
  id: string,
  data: {
    message: string;
    images: string[];
  }
) => {
  const res = await api.patch(`/needs/${id}/complete`, data);
  return res.data;
};