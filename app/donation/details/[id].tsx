import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';

import {
  getDonationById,
} from '../../../src/services/donations.service';

import {
  getCollectionPointsByNeed,
} from '../../../src/services/collectionPoints.service';

export default function DonationDetails() {
  const { id } = useLocalSearchParams();

  const [donation, setDonation] = useState<any>(null);
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  const load = async () => {
    try {
      const donationData =
        await getDonationById(id as string);

      const pointsData =
        await getCollectionPointsByNeed(
          donationData.need.id
        );

      setDonation(donationData);
      setPoints(pointsData);

    } catch (err) {
      console.log(err);
      alert('Erro ao carregar dados');
    }
  };

  if (!donation) {
    return (
      <Text style={{ padding: 16 }}>
        Carregando...
      </Text>
    );
  }

  const campaignFinished =
    donation.need.status?.toUpperCase() ===
      'COMPLETED' ||
    donation.need.status?.toUpperCase() ===
      'FULFILLED';

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
    >

      {/* TÍTULO */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        {donation.need.title}
      </Text>

      {/* DESCRIÇÃO */}
      <Text
        style={{
          marginTop: 10,
          color: '#555',
          lineHeight: 22,
        }}
      >
        {donation.need.description}
      </Text>

      {/* STATUS DOAÇÃO */}
      <View
        style={{
          marginTop: 20,
          padding: 14,
          borderRadius: 12,
          backgroundColor:
            donation.confirmed
              ? '#e8f5e9'
              : '#fff3e0',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color:
              donation.confirmed
                ? '#2e7d32'
                : '#ef6c00',
          }}
        >
          {donation.confirmed
            ? '✅ Doação confirmada'
            : '⏳ Aguardando validação pela ONG'}
        </Text>
      </View>

      {/* STATUS CAMPANHA */}
      <View
        style={{
          marginTop: 14,
          padding: 14,
          borderRadius: 12,
          backgroundColor:
            campaignFinished
              ? '#e8f5e9'
              : '#f5f5f5',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color:
              campaignFinished
                ? '#2e7d32'
                : '#555',
          }}
        >
          {campaignFinished
            ? '🎉 Campanha finalizada'
            : '📦 Campanha em andamento'}
        </Text>
      </View>

      {/* CÓDIGO */}
      {!donation.confirmed &&
        donation.confirmationCode && (
        <View
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: '#f5f5f5',
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
            }}
          >
            Código para entrega:
          </Text>

          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              letterSpacing: 4,
              marginTop: 8,
            }}
          >
            {donation.confirmationCode}
          </Text>
        </View>
      )}

      {/* MENSAGEM FINAL */}
      {donation.need.completionMessage && (
        <View
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#e8f5e9',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#c8e6c9',
          }}
        >

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            📢 Mensagem da ONG
          </Text>

          <Text
            style={{
              marginTop: 10,
              lineHeight: 22,
              color: '#444',
            }}
          >
            {donation.need.completionMessage}
          </Text>

        </View>
      )}

      {/* IMAGENS */}
      {donation.need.images?.length > 0 && (
        <View style={{ marginTop: 24 }}>

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 14,
            }}
          >
            📸 Fotos da campanha
          </Text>

          {donation.need.images.map(
            (img: string, index: number) => (
              <Image
                key={index}
                source={{ uri: img }}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: 240,
                  borderRadius: 16,
                  marginBottom: 14,
                }}
              />
            )
          )}

        </View>
      )}

      {/* PONTOS */}
      <Text
        style={{
          marginTop: 30,
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        📍 Pontos de coleta
      </Text>

      <FlatList
        data={points}
        keyExtractor={(item: any) => item.id}
        scrollEnabled={false}
        renderItem={({ item }: any) => (
          <View
            style={{
              padding: 14,
              borderRadius: 12,
              backgroundColor: '#fafafa',
              marginTop: 12,
              borderWidth: 1,
              borderColor: '#eee',
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
                marginTop: 6,
                color: '#555',
              }}
            >
              {item.address}
            </Text>
          </View>
        )}
      />

    </ScrollView>
  );
}