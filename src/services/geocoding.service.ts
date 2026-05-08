import axios from 'axios';

export const getCoordinatesFromAddress = async (
  address: string
) => {
  const res = await axios.get(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'haredo-app',
      },
    }
  );

  if (!res.data.length) {
    throw new Error('Endereço não encontrado');
  }

  return {
    lat: Number(res.data[0].lat),
    lng: Number(res.data[0].lon),
  };
};