import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import {
  createDonation,
} from '../../src/services/donations.service';
import {
  getNearbyCollectionPoints,
} from '../../src/services/collectionPoints.service';
import {
  getNeedById,
} from '../../src/services/needs.service';
import AppButton from '../../src/components/AppButton';
import LoadingScreen from '../../src/components/LoadingScreen';
import ProgressBar from '../../src/components/ProgressBar';
import StatusBadge from '../../src/components/StatusBadge';
import {
  AppInput,
} from '../../src/components/ui/AppInput';
import {
  ScreenContainer,
} from '../../src/components/ui/ScreenContainer';
import { theme } from '../../src/theme/theme';
import { Header } from '../../src/components/ui/Header';
export default function NeedDetail() {
  const { id } =
    useLocalSearchParams();
  const [need, setNeed] =
    useState<any>(null);
  const [quantity, setQuantity] =
    useState('1');
  const [points, setPoints] =
    useState<any[]>([]);
  const [
    selectedPoint,
    setSelectedPoint,
  ] = useState<any>(null);
  const [code, setCode] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [
    screenLoading,
    setScreenLoading,
  ] = useState(true);
  useEffect(() => {
    initialize();
  }, []);
  const initialize = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão negada');
        setScreenLoading(false);
        return;
      }
      const location =
        await Location.getCurrentPositionAsync({});
      await load({
        lat:
          location.coords.latitude,
        lng:
          location.coords.longitude,
      });
    } catch (err) {
      console.log(err);
      alert(
        'Erro ao obter localização'
      );
      setScreenLoading(false);
    }
  };
  const load = async (
    coords: {
      lat: number;
      lng: number;
    }
  ) => {
    try {
      const [
        needData,
        pointsData,
      ] = await Promise.all([
        getNeedById(
          id as string
        ),
        getNearbyCollectionPoints(
          coords.lat,
          coords.lng
        ),
      ]);
      setNeed(needData);
      const ordered =
        [...pointsData].sort(
          (a: any, b: any) =>
            (a.distance || 999999999)
            -
            (b.distance || 999999999)
        );
      setPoints(ordered);
    } catch (err) {
      console.log(err);
      alert(
        'Erro ao carregar dados'
      );
    } finally {
      setScreenLoading(false);
    }
  };
  const formatDistance = (
    distance?: number
  ) => {
    if (!distance) {
      return 'Distância indisponível';
    }
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }
    return `${(
      distance / 1000
    ).toFixed(1)} km`;
  };
  const handleDonate = async () => {
    if (!selectedPoint) {
      alert(
        'Selecione um ponto de coleta'
      );
      return;
    }
    const qty =
      Number(quantity);
    if (!qty || qty <= 0) {
      alert(
        'Quantidade inválida'
      );
      return;
    }
    try {
      setLoading(true);
      const res =
        await createDonation(
          id as string,
          qty
        );
      setCode(
        res.confirmationCode
      );
      alert(
        'Doação criada com sucesso!'
      );
    } catch (err: any) {
      console.log(
        err.response?.data
      );
      alert(
        err.response?.data?.message ||
        'Erro ao doar'
      );
    } finally {
      setLoading(false);
    }
  };
  if (screenLoading) {
    return (
      <LoadingScreen
        text="Carregando campanha..."
      />
    );
  }
  if (!need) {
    return (
      <ScreenContainer>
        <View
          style={{
            flex: 1,
            justifyContent:
              'center',
            alignItems:
              'center',
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color:
                theme.colors.text,
            }}
          >
            Campanha não encontrada
          </Text>
        </View>
      </ScreenContainer>
    );
  }
  const progress =
    Math.min(
      (
        need.quantityReceived /
        need.quantityNeeded
      ) * 100,
      100
    );
  const status =
    need.status?.toUpperCase();
  const campaignClosed =
    status === 'COMPLETED' ||
    status === 'CANCELLED';
  const statusLabel =
    status === 'PENDING'
      ? 'Aguardando'
      : status === 'IN_PROGRESS'
      ? 'Em andamento'
      : status === 'FULFILLED'
      ? 'Meta concluída'
      : status === 'COMPLETED'
      ? 'Campanha encerrada'
      : status === 'CANCELLED'
      ? 'Cancelada'
      : need.status;
  return (
    <ScreenContainer>
      {/* HEADER */}
        <Header
          title="Detalhes da campanha"
          subtitle="Escolha um ponto de coleta para realizar sua doação"/>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 50,
        }}>
        {/* CARD PRINCIPAL */}
        <View
          style={{
            backgroundColor:
              theme.colors.card,
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor:
              theme.colors.border,
          }}
        >
          <View
            style={{
              alignSelf:
                'flex-start',
              marginBottom: 14,
            }}
          >
            <StatusBadge
              label={statusLabel}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color:
                theme.colors.text,
            }}
          >
            {need.description}
          </Text>
          <View
            style={{
              marginTop: 18,
              gap: 10,
            }}
          >
            <Text>
              📂 Categoria:{' '}
              {need.category}
            </Text>
            <Text>
              🏢 ONG:{' '}
              {need.ong?.name ||
                need.ong?.email}
            </Text>
            <Text>
              📦{' '}
              {need.quantityReceived}
              /
              {need.quantityNeeded}
            </Text>
          </View>
          <View
            style={{
              marginTop: 18,
            }}
          >
            <ProgressBar
              progress={progress}
            />
            <Text
              style={{
                marginTop: 8,
                fontWeight: '700',
                color:
                  theme.colors
                    .success,
              }}
            >
              {progress.toFixed(0)}%
              Doações recebidas
            </Text>
          </View>
        </View>
                {/* PONTOS DE COLETA */}
        {!campaignClosed && (
          <>
            <View
              style={{
                marginTop: 28,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color:
                    theme.colors.text,
                }}
              >
                📍 Pontos de coleta
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  color:
                    theme.colors
                      .textSecondary,
                }}
              >
                Escolha o local onde
                realizará a entrega.
              </Text>
              {points.length === 0 ? (
                <View
                  style={{
                    marginTop: 16,
                    padding: 20,
                    borderRadius: 16,
                    backgroundColor:
                      theme.colors.card,
                    borderWidth: 1,
                    borderColor:
                      theme.colors.border,
                  }}
                >
                  <Text
                    style={{
                      textAlign:
                        'center',
                      color:
                        theme.colors
                          .textSecondary,
                    }}
                  >
                    Nenhum ponto de coleta
                    encontrado próximo à
                    sua localização.
                  </Text>
                </View>
              ) : (
                <FlatList
                  scrollEnabled={false}
                  data={points}
                  keyExtractor={(
                    item: any
                  ) => item.id}
                  renderItem={({
                    item,
                  }: any) => {
                    const selected =
                      selectedPoint?.id ===
                      item.id;
                    return (
                      <Pressable
                        onPress={() =>
                          setSelectedPoint(
                            item
                          )
                        }
                      >
                        <View
                          style={{
                            marginTop: 14,
                            padding: 16,
                            borderRadius: 18,
                            borderWidth: 2,
                            borderColor:
                              selected
                                ? theme
                                    .colors
                                    .success
                                : theme
                                    .colors
                                    .border,
                            backgroundColor:
                              selected
                                ? theme
                                    .colors
                                    .successLight
                                : theme
                                    .colors
                                    .card,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight:
                                '700',
                              color:
                                theme
                                  .colors
                                  .text,
                            }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              marginTop: 8,
                              lineHeight: 20,
                              color:
                                theme
                                  .colors
                                  .textSecondary,
                            }}
                          >
                            {item.address}
                          </Text>
                          <Text
                            style={{
                              marginTop: 10,
                              fontWeight:
                                '600',
                              color:
                                theme
                                  .colors
                                  .primary,
                            }}
                          >
                            📍{' '}
                            {formatDistance(
                              item.distance
                            )}
                          </Text>
                          {selected && (
                            <Text
                              style={{
                                marginTop: 10,
                                fontWeight:
                                  '700',
                                color:
                                  theme
                                    .colors
                                    .success,
                              }}
                            >
                              ✓ Ponto selecionado
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  }}
                />
              )}
            </View>
            {/* QUANTIDADE */}
            <View
              style={{
                marginTop: 30,
              }}
            >
              <AppInput
                label="Quantidade para doação"
                value={quantity}
                onChangeText={
                  setQuantity
                }
                keyboardType="numeric"
                placeholder="Ex: 5"
              />
            </View>
            {/* RESUMO */}
            {selectedPoint && (
              <View
                style={{
                  marginTop: 8,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor:
                    theme.colors
                      .backgroundSecondary,
                  borderWidth: 1,
                  borderColor:
                    theme.colors.border,
                }}
              >
                <Text
                  style={{
                    fontWeight:
                      '700',
                    marginBottom: 6,
                  }}
                >
                  Local selecionado
                </Text>
                <Text
                  style={{
                    color:
                      theme.colors
                        .text,
                  }}
                >
                  {selectedPoint.name}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color:
                      theme.colors
                        .textSecondary,
                  }}
                >
                  {formatDistance(
                    selectedPoint.distance
                  )}
                </Text>
              </View>
            )}
            {/* BOTÃO */}
            <View
              style={{
                marginTop: 30,
              }}
            >
              <AppButton
                title={
                  loading
                    ? 'Processando...'
                    : 'Confirmar doação'
                }
                onPress={
                  handleDonate
                }
              />
            </View>
          </>
        )}
        {/* CÓDIGO DE CONFIRMAÇÃO */}
        {code && (
          <View
            style={{
              marginTop: 32,
              backgroundColor:
                theme.colors
                  .successLight,
              borderWidth: 1,
              borderColor:
                theme.colors.success,
              borderRadius: 20,
              padding: 22,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color:
                  theme.colors
                    .success,
              }}
            >
              ✅ Doação criada
            </Text>
            <Text
              style={{
                marginTop: 12,
                lineHeight: 22,
                color:
                  theme.colors.text,
              }}
            >
              Apresente este código
              ao responsável pelo
              recebimento da doação.
            </Text>
            <View
              style={{
                marginTop: 20,
                paddingVertical: 18,
                borderRadius: 16,
                backgroundColor:
                  theme.colors.white,
              }}
            >
              <Text
                style={{
                  textAlign:
                    'center',
                  fontSize: 34,
                  fontWeight:
                    '700',
                  letterSpacing: 6,
                  color:
                    theme.colors.text,
                }}
              >
                {code}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}