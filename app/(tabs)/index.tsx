import { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, Button } from 'react-native';
import { getNeeds } from '../../src/services/needs.service';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/store/auth.context';
import { decodeToken } from '../../src/utils/decodeToken';


export default function Home() {
  const [needs, setNeeds] = useState([]);
  const router = useRouter();
  const { setToken, token } = useContext(AuthContext);
  const user = token ? decodeToken(token) : null;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getNeeds();
    setNeeds(data);
  };

  return (
  <View style={{ flex: 1 }}>

    {/* BOTÕES GLOBAIS */}
    <View style={{ padding: 16 }}>
      {user?.role === 'ong_admin' && (
        <Button
          title="Criar Need"
          onPress={() => router.push('/create-need')}
        />
      )}

      <Button title="Sair" onPress={() => setToken(null)} />
    </View>

    {/* LISTA */}
    <FlatList
      data={needs}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }: any) => (
        <Pressable onPress={() => router.push(`/need/${item.id}`)}>
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        </Pressable>
      )}
    />

  </View>
);
}