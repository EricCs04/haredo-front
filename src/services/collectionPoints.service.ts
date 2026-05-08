import {api} from '../api/api';

export const createCollectionPoint = async (data: {
  name: string;
  address: string;
  lat: number;
  lng: number;
}) => {
  const res = await api.post('/collection-points', data);
  return res.data;
};

export const getNearbyCollectionPoints = async (lat: number, lng: number) => {
  const res = await api.get('/collection-points/nearby', {
    params: { lat, lng },
  });
  return res.data;
};

export const getCollectionPointsByNeed = async (needId: string) => {
  const res = await api.get(`/collection-points/need/${needId}`);
  return res.data;
};