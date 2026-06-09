import {
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  getNeeds,
} from '@/src/services/needs.service';
import {
  getNearbyCollectionPoints,
} from '@/src/services/collectionPoints.service';
import LoadingScreen from '@/src/components/LoadingScreen';
import {
  ScreenContainer,
} from '@/src/components/ui/ScreenContainer';
import {
  Header,
} from '@/src/components/ui/Header';
import {
  colors,
} from '@/src/theme/colors';
import {
  spacing,
} from '@/src/theme/spacing';
import {
  typography,
} from '@/src/theme/typography';
export default function ExploreScreen() {
  const [
    completedNeeds,
    setCompletedNeeds,
  ] = useState<any[]>([]);
  const [
    collectionPoints,
    setCollectionPoints,
  ] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState('');
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    try {
      setError('');
      const needs =
        await getNeeds();
      const completed =
        needs.filter(
          (n: any) =>
            n.status?.toUpperCase() ===
              'COMPLETED' ||
            n.status?.toUpperCase() ===
              'FULFILLED'
        );
      setCompletedNeeds(completed);
      const points =
        await getNearbyCollectionPoints(
          -23.5505,
          -46.6333
        );
      setCollectionPoints(points);
    } catch (err: any) {
      console.log(err);
      setError(
        'Erro ao carregar dados'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh =
    async () => {
      setRefreshing(true);
      await load();
    };
  if (loading) {
    return (
      <LoadingScreen
        text="Carregando informações..."
      />
    );
  }
  return (
    <ScreenContainer>
      {/* HEADER */}
      <Header
        title="Histórico de campanhas"
        subtitle="Histórico de campanhas e pontos de coleta"
      />
      <FlatList
        data={completedNeeds}
        keyExtractor={(item: any) =>
          item.id
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            {/* ERRO */}
            {!!error && (
              <View
                style={
                  styles.errorBox
                }
              >
                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>
              </View>
            )}
            {/* PONTOS */}
            <View
              style={
                styles.section
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                📍 Pontos de coleta
              </Text>
              {collectionPoints.length ===
              0 ? (
                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Nenhum ponto encontrado.
                </Text>
              ) : (
                collectionPoints.map(
                  (point: any) => (
                    <View
                      key={point.id}
                      style={
                        styles.pointCard
                      }
                    >
                      <Text
                        style={
                          styles.cardTitle
                        }
                      >
                        {point.name}
                      </Text>
                      <Text
                        style={
                          styles.pointAddress
                        }
                      >
                        {point.address}
                      </Text>
                    </View>
                  )
                )
              )}
            </View>
            {/* TÍTULO */}
            <View
              style={
                styles.section
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                ✅ Campanhas concluídas
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text
              style={
                styles.emptyTitle
              }
            >
              Nenhuma campanha finalizada
            </Text>
            <Text
              style={
                styles.emptyText
              }
            >
              Ainda não existem campanhas concluídas.
            </Text>
          </View>
        }
        renderItem={({ item }: any) => {
          const progress =
            Math.min(
              (
                item.quantityReceived /
                item.quantityNeeded
              ) * 100,
              100
            ).toFixed(0);
          const deadline =
            item.deadline
              ? new Date(
                  item.deadline
                ).toLocaleDateString(
                  'pt-BR'
                )
              : 'Sem prazo';
          const priorityColor =
            item.priority === 'high'
              ? colors.danger
              : item.priority ===
                'medium'
              ? colors.warning
              : colors.success;
          const priorityLabel =
            item.priority === 'high'
              ? 'Urgente'
              : item.priority ===
                'medium'
              ? 'Pontual'
              : 'Recorrente';
          return (
            <Pressable
              style={styles.card}
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                {item.title}
              </Text>
              <Text
                style={
                  styles.description
                }
              >
                {item.description}
              </Text>
              <Text
                style={styles.info}
              >
                📂 Categoria:{' '}
                {item.category}
              </Text>
              <Text
                style={styles.info}
              >
                📅 Prazo:{' '}
                {deadline}
              </Text>
              <Text
                style={styles.info}
              >
                🏢 ONG:{' '}
                {item.ong?.name ||
                  item.ong?.email}
              </Text>
              <Text
                style={styles.info}
              >
                📦{' '}
                {
                  item.quantityReceived
                }{' '}
                /{' '}
                {
                  item.quantityNeeded
                }
              </Text>
              {/* PROGRESSO */}
              <View
                style={
                  styles.progressContainer
                }
              >
                <View
                  style={
                    styles.progressBar
                  }
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width:
                          `${progress}%` as any,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={
                    styles.progressText
                  }
                >
                  {progress}%
                  doaçoes recebidas
                </Text>
              </View>
              {/* PRIORIDADE */}
              <Text
                style={[
                  styles.priorityText,
                  {
                    color:
                      priorityColor,
                  },
                ]}
              >
                🚨 Prioridade:{' '}
                {priorityLabel}
              </Text>
              {/* MENSAGEM */}
              {item.completionMessage && (
                <View
                  style={
                    styles.messageBox
                  }
                >
                  <Text
                    style={
                      styles.messageTitle
                    }
                  >
                    📢 Mensagem da ONG
                  </Text>
                  <Text
                    style={
                      styles.messageText
                    }
                  >
                    {
                      item.completionMessage
                    }
                  </Text>
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  listContent: {
    padding:
      spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginTop:
      spacing.lg,
    marginBottom:
      spacing.md,
  },
  sectionTitle: {
    fontSize:
      typography.title.fontSize,
    fontWeight:
      typography.title.fontWeight,
    color:
      colors.text,
  },
  errorBox: {
    marginTop:
      spacing.md,
    backgroundColor:
      '#fee2e2',
    borderWidth: 1,
    borderColor:
      '#fecaca',
    borderRadius: 14,
    padding:
      spacing.md,
  },
  errorText: {
    color:
      colors.danger,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color:
      colors.text,
  },
  emptyText: {
    marginTop: 8,
    color:
      colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor:
      colors.white,
    borderRadius: 22,
    padding:
      spacing.lg,
    marginBottom:
      spacing.lg,
  },
  pointCard: {
    backgroundColor:
      colors.white,
    borderRadius: 18,
    padding:
      spacing.lg,
    marginBottom:
      spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color:
      colors.text,
  },
  description: {
    marginTop:
      spacing.sm,
    color:
      colors.textSecondary,
    lineHeight: 22,
  },
  info: {
    marginTop:
      spacing.sm,
    color:
      colors.text,
  },
  pointAddress: {
    marginTop: 6,
    color:
      colors.textSecondary,
    lineHeight: 22,
  },
  progressContainer: {
    marginTop:
      spacing.md,
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor:
      '#e5e7eb',
  },
  progressFill: {
    height: '100%',
    backgroundColor:
      colors.success,
  },
  progressText: {
    marginTop:
      spacing.sm,
    fontWeight: '700',
    color:
      colors.success,
  },
  priorityText: {
    marginTop:
      spacing.md,
    fontWeight: '700',
  },
  messageBox: {
    marginTop:
      spacing.lg,
    backgroundColor:
      '#ecfdf5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      '#bbf7d0',
    padding:
      spacing.md,
  },
  messageTitle: {
    fontWeight: '700',
    color:
      colors.text,
  },
  messageText: {
    marginTop: 6,
    color:
      colors.textSecondary,
    lineHeight: 22,
  },
});