import { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, Button } from 'react-native';
import { getNeeds } from '../../src/services/needs.service';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/store/auth.context';
import { decodeToken } from '../../src/utils/decodeToken';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Home() {
  const [needs, setNeeds] = useState([]);
  const router = useRouter();
  const { setToken, token } = useContext(AuthContext);
  const user = token ? decodeToken(token) : null;

  useFocusEffect(
   useCallback(() => {
    load();
  }, [])
  );

  const load = async () => {
    const data = await getNeeds();

    // FILTRA campanhas não finalizadas
    const activeNeeds = data.filter(
      (n: any) => n.status.toUpperCase() !== 'FULFILLED' && n.status.toUpperCase() !== 'COMPLETED'
    );

    setNeeds(activeNeeds);
  };

  const handlePress = (item: any) => {
    if (user?.role === 'ong_admin') {
      router.push(`/need/details/${item.id}`); 
    } else {
      router.push(`/need/${item.id}`); 
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* BOTÕES */}
      <View style={{ padding: 16 }}>
        {user?.role === 'ong_admin' && (
        <>
          <Button
          title="Criar Need"
          onPress={() => router.push('/create-need')}
        />

        <View style={{ height: 10 }} />

          <Button
            title="Criar ponto de coleta"
            onPress={() => router.push('/create-collection-point')}
          />
       </>
      )}

        <Button title="Sair" onPress={() => setToken(null)} />
      </View>

      {/* LISTA */}
      <FlatList
        data={needs}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => {
          const progress = Math.min(
            (item.quantityReceived / item.quantityNeeded) * 100,
            100
          ).toFixed(0);

          return (
            <Pressable onPress={() => handlePress(item)}>
              <View style={{
                padding: 14,
                borderBottomWidth: 1,
                borderColor: '#ddd'
              }}>

                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {item.title}
                </Text>

                <Text style={{ color: '#666', marginTop: 4 }}>
                  {item.description}
                </Text>

                <Text style={{ marginTop: 6 }}>
                  {item.quantityReceived} / {item.quantityNeeded}
                </Text>

                <Text style={{ color: 'green', fontWeight: 'bold' }}>
                  {progress}% concluído
                </Text>

                <Text style={{ fontSize: 12, marginTop: 4 }}>
                  ONG: {item.ong?.name || item.ong?.email}
                </Text>
                <Text style={{ fontSize: 12, marginTop: 2 }}>
                  Prioridade: {item.priority}
                </Text>
                <Text style={{ fontSize: 12, marginTop: 2 }}>
                  Até: {new Date(item.deadline).toLocaleDateString('pt-BR')}
                </Text>

              </View>
            </Pressable>
          );
        }}
      />

    </View>
  );
}