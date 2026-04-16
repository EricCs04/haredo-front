import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getMyDonations } from '../../src/services/donations.service';
import { useContext } from 'react';
import { AuthContext } from '../../src/store/auth.context';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getMyDonations();
    setDonations(data);
  };

  return (
    <FlatList
      data={donations}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }: any) => (
        <View>
          <Text>{item.need.title}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
}