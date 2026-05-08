import { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { getMyDonations } from '../../src/services/donations.service';
import { AuthContext } from '../../src/store/auth.context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const { user } = useContext(AuthContext);
  const router = useRouter();

useFocusEffect(
  useCallback(() => {
    const fetch = async () => {
      try {
        const data = await getMyDonations();
        setDonations(data);
      } catch (err: any) {
        console.log(err.response?.data);
        alert('Erro ao carregar doações');
      }
    };

    fetch();
  }, [])
);



  const handlePress = (item: any) => {
    if (user?.role === 'ong_admin') {
      if (item.confirmed) {
        alert('Já confirmada');
        return;
      }
      router.push(`/donation/${item.id}`);
    } else {
      router.push(`/donation/details/${item.id}`);
    }
  };
  

  return (
    <FlatList
      data={donations}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }: any) => {
  const date = new Date(item.createdAt).toLocaleString('pt-BR');

  return (
    <Pressable onPress={() => handlePress(item)}>
      <View style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd'
      }}>
        
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {item.need.title}
        </Text>

        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
          {date}
        </Text>

        {user?.role === 'ong_admin' && (
          <Text style={{ marginTop: 4 }}>
            Doador: {item.user?.name || item.user?.email}
          </Text>
        )}

        {user?.role === 'user' && (
          <Text style={{ marginTop: 4 }}>
            ONG: {item.ong?.name || item.ong?.email}
          </Text>
        )}

        <Text style={{ marginTop: 4 }}>
          Quantidade: {item.quantity}
        </Text>

        <Text style={{
          marginTop: 6,
          fontWeight: 'bold',
          color: item.confirmed ? 'green' : 'orange'
        }}>
          {item.confirmed ? '✅ Confirmada' : '⏳ Aguardando confirmação'}
        </Text>

        {user?.role === 'user' && item.confirmationCode && (
          <View style={{
            marginTop: 8,
            padding: 10,
            backgroundColor: '#f5f5f5',
            borderRadius: 8
          }}>
            <Text style={{ fontSize: 12 }}>Código de confirmação:</Text>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              letterSpacing: 2
            }}>
              {item.confirmationCode}
            </Text>
          </View>
        )}

      </View>
    </Pressable>
  );
}}
    />
  );
}