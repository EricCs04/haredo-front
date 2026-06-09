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
import LoadingScreen from '../../../src/components/LoadingScreen';
import AppCard from '../../../src/components/AppCard';
import StatusBadge from '../../../src/components/StatusBadge';
import { Header } from '../../../src/components/ui/Header';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { theme } from '../../../src/theme/theme';
export default function DonationDetails() {
  const { id } =
    useLocalSearchParams();
  const [donation, setDonation] =
    useState<any>(null);
  const [points, setPoints] =
    useState<any[]>([]);
  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);
  const load = async () => {
    try {
      const donationData =
        await getDonationById(
          id as string
        );
      const pointsData =
        await getCollectionPointsByNeed(
          donationData.need.id
        );
      setDonation(
        donationData
      );
      setPoints(
        pointsData
      );
    } catch (err) {
      console.log(err);
      alert(
        'Erro ao carregar dados'
      );
    }
  };
  if (!donation) {
    return (
      <LoadingScreen
        text="Carregando doação..."
      />
    );
  }
  const needStatus =
    donation.need.status?.toUpperCase();
  const campaignCompleted =
    needStatus ===
    'COMPLETED';
  const goalReached =
    needStatus ===
    'FULFILLED';
  return (
    <ScreenContainer>
      <Header
        title="Detalhes da doação"
      />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
      >
        <AppCard>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color:
                theme.colors.text,
            }}
          >
            {donation.need.title}
          </Text>
          <Text
            style={{
              marginTop: 10,
              lineHeight: 22,
              color:
                theme.colors.textSecondary,
            }}
          >
            {donation.need.description}
          </Text>
        </AppCard>
        <View
          style={{
            marginTop: 16,
          }}
        >
          <AppCard>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 12,
              }}
            >
              Status da entrega
            </Text>
            <StatusBadge
              label={
                donation.confirmed
                  ? 'Entrega confirmada'
                  : 'Aguardando validação'
              }
            />
          </AppCard>
        </View>
                {donation.confirmed &&
          donation.validatorName && (
          <View
            style={{
              marginTop: 16,
            }}
          >
            <AppCard>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  marginBottom: 14,
                }}
              >
                Responsável pela validação
              </Text>
              <Text>
                Nome:
                {' '}
                {donation.validatorName}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                }}
              >
                Email:
                {' '}
                {donation.validatorEmail}
              </Text>
              {donation.validatorPhone && (
                <Text
                  style={{
                    marginTop: 6,
                  }}
                >
                  Telefone:
                  {' '}
                  {donation.validatorPhone}
                </Text>
              )}
              {donation.validatedAt && (
                <Text
                  style={{
                    marginTop: 10,
                    color:
                      theme.colors.textSecondary,
                  }}
                >
                  Confirmado em:
                  {' '}
                  {new Date(
                    donation.validatedAt
                  ).toLocaleString(
                    'pt-BR'
                  )}
                </Text>
              )}
            </AppCard>
          </View>
        )}
        <View
          style={{
            marginTop: 16,
          }}
        >
          <AppCard>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 12,
              }}
            >
              Status da campanha
            </Text>
            <StatusBadge
              label={
                campaignCompleted
                  ? 'Campanha encerrada'
                  : goalReached
                  ? 'Meta concluída'
                  : 'Campanha em andamento'
              }
            />
          </AppCard>
        </View>
        {!donation.confirmed &&
          donation.confirmationCode && (
          <View
            style={{
              marginTop: 16,
            }}
          >
            <AppCard>
              <Text
                style={{
                  color:
                    theme.colors.textSecondary,
                }}
              >
                Código para entrega
              </Text>
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 36,
                  fontWeight: '700',
                  textAlign: 'center',
                  letterSpacing: 6,
                  color:
                    theme.colors.primary,
                }}
              >
                {donation.confirmationCode}
              </Text>
            </AppCard>
          </View>
        )}
        {donation.need.completionMessage && (
          <View
            style={{
              marginTop: 16,
            }}
          >
            <AppCard>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Mensagem da ONG
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  lineHeight: 22,
                  color:
                    theme.colors.textSecondary,
                }}
              >
                {donation.need.completionMessage}
              </Text>
            </AppCard>
          </View>
        )}
                {donation.need.images?.length > 0 && (
          <View
            style={{
              marginTop: 16,
            }}
          >
            <AppCard>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  marginBottom: 16,
                }}
              >
                Fotos da campanha
              </Text>
              {donation.need.images.map(
                (
                  img: string,
                  index: number
                ) => (
                  <Image
                    key={index}
                    source={{
                      uri: img,
                    }}
                    resizeMode="cover"
                    style={{
                      width: '100%',
                      height: 240,
                      borderRadius: 16,
                      marginBottom: 12,
                    }}
                  />
                )
              )}
            </AppCard>
          </View>
        )}
        <View
          style={{
            marginTop: 16,
          }}
        >
          <AppCard>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 14,
              }}
            >
              Pontos de coleta
            </Text>
            <FlatList
              data={points}
              scrollEnabled={false}
              keyExtractor={(
                item: any
              ) => item.id}
              renderItem={({
                item,
              }: any) => (
                <View
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor:
                      theme.colors.border,
                    backgroundColor:
                      theme.colors.white,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 15,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      marginTop: 6,
                      color:
                        theme.colors.textSecondary,
                    }}
                  >
                    {item.address}
                  </Text>
                </View>
              )}
            />
          </AppCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}