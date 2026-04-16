import { api } from '../api/api';

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}) => {
  const res = await api.post('/users/register', data);
  return res.data;
};