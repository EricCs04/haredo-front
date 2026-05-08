import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {createDonation,} from '../../src/services/donations.service';
import {getNearbyCollectionPoints,} from '../../src/services/collectionPoints.service';
import {getNeedById,} from '../../src/services/needs.service';
import * as Location from 'expo-location';

export default function NeedDetail() {
  const { id } = useLocalSearchParams();
  const [need, setNeed] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [points, setPoints] = useState<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);


  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      // pede permissão
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Permissão de localização negada');
        setScreenLoading(false);
        return;
      }

    // pega localização atual
    const location =
      await Location.getCurrentPositionAsync({});

      const coords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setUserLocation(coords);

      await load(coords);

    } catch (err) {
      console.log(err);
      alert('Erro ao obter localização');
      setScreenLoading(false);
    }
  };

  const load = async (coords: {
    lat: number;
    lng: number;
  }) => {
    try {
      const [needData, pointsData] = await Promise.all([
        getNeedById(id as string),
        getNearbyCollectionPoints(
          coords.lat,
          coords.lng
        ),
      ]);

      setNeed(needData);
      setPoints(pointsData);

    } catch (err) {
      console.log(err);
      alert('Erro ao carregar dados');
    } finally {
      setScreenLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!selectedPoint) {
      alert('Selecione um ponto de coleta');
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      alert('Quantidade inválida');
      return;
    }

    try {
      setLoading(true);

      const res = await createDonation(
        id as string,
        qty,
      );

      setCode(res.confirmationCode);

      alert('Doação criada com sucesso!');

    } catch (err: any) {
      console.log('ERRO COMPLETO:', err.response?.data);
      alert('Erro ao doar');
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!need) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Campanha não encontrada</Text>
      </View>
    );
  }

  const progress = Math.min(
    (need.quantityReceived / need.quantityNeeded) * 100,
    100
  ).toFixed(0);

  const deadline = need.deadline
    ? new Date(need.deadline).toLocaleDateString('pt-BR')
    : 'Sem prazo';

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
    >

      {/* HEADER */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Detalhes da campanha
      </Text>

      {/* CARD NEED */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: '#f5f5f5',
          borderRadius: 14,
          padding: 16,
        }}
      >

        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
          }}
        >
          {need.title}
        </Text>

        <Text
          style={{
            marginTop: 10,
            color: '#555',
            lineHeight: 22,
          }}
        >
          {need.description}
        </Text>

        {/* CATEGORIA */}
        <Text style={{ marginTop: 14 }}>
          📂 Categoria: {need.category}
        </Text>

        {/* PRIORIDADE */}
        <Text
          style={{
            marginTop: 8,
            fontWeight: 'bold',
            color:
              need.priority === 'high'
                ? '#d32f2f'
                : need.priority === 'medium'
                ? '#f57c00'
                : '#388e3c',
          }}
        >
          🚨 Prioridade:{' '}
          {need.priority === 'high'
            ? 'Alta'
            : need.priority === 'medium'
            ? 'Média'
            : 'Baixa'}
        </Text>

        {/* PRAZO */}
        <Text style={{ marginTop: 8 }}>
          📅 Prazo: {deadline}
        </Text>

        {/* STATUS */}
        <Text style={{ marginTop: 8 }}>
          📌 Status: {need.status}
        </Text>

        {/* ONG */}
        <Text style={{ marginTop: 8 }}>
          🏢 ONG: {need.ong?.name || need.ong?.email}
        </Text>

        {/* PROGRESSO */}
        <View
          style={{
            marginTop: 16,
          }}
        >
          <Text>
            📦 {need.quantityReceived} / {need.quantityNeeded}
          </Text>

          <View
            style={{
              height: 10,
              backgroundColor: '#ddd',
              borderRadius: 10,
              marginTop: 8,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
              width: `${progress}%` as `${number}%`,
              height: '100%',
              backgroundColor: '#22c55e',
              }}
            />
          </View>

          <Text
            style={{
              marginTop: 6,
              fontWeight: 'bold',
              color: '#388e3c',
            }}
          >
            {progress}% arrecadado
          </Text>
        </View>

      </View>

      {/* QUANTIDADE */}
      <View style={{ marginTop: 26 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Quantidade para doação
        </Text>

        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Digite a quantidade"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            padding: 12,
            marginTop: 10,
            borderRadius: 10,
          }}
        />
      </View>

      {/* PONTOS */}
      <View style={{ marginTop: 28 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          📍 Pontos de coleta próximos
        </Text>

        <FlatList
          scrollEnabled={false}
          data={points}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedPoint(item)}
              style={{
                padding: 14,
                marginTop: 12,
                borderWidth: 2,
                borderColor:
                  selectedPoint?.id === item.id
                    ? '#4caf50'
                    : '#ddd',
                backgroundColor:
                  selectedPoint?.id === item.id
                    ? '#edf7ed'
                    : '#fff',
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  color: '#555',
                }}
              >
                {item.address}
              </Text>

              {selectedPoint?.id === item.id && (
                <Text
                  style={{
                    marginTop: 8,
                    color: '#2e7d32',
                    fontWeight: 'bold',
                  }}
                >
                  ✅ Selecionado
                </Text>
              )}
            </Pressable>
          )}
        />
      </View>

      {/* BOTÃO */}
      <View style={{ marginTop: 30 }}>
        <Button
          title={
            loading
              ? 'Processando...'
              : 'Confirmar Doação'
          }
          onPress={handleDonate}
        />
      </View>

      {/* CÓDIGO */}
      {code && (
        <View
          style={{
            marginTop: 30,
            padding: 18,
            backgroundColor: '#edf7ed',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#4caf50',
          }}
        >

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            ✅ Doação criada
          </Text>

          <Text
            style={{
              marginTop: 10,
              color: '#555',
            }}
          >
            Informe este código para a ONG no momento
            da entrega:
          </Text>

          <Text
            style={{
              marginTop: 14,
              fontSize: 30,
              fontWeight: 'bold',
              letterSpacing: 4,
              textAlign: 'center',
              color: '#2e7d32',
            }}
          >
            {code}
          </Text>

        </View>
      )}

    </ScrollView>
  );
}