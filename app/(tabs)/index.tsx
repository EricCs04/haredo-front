import {
  useState,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  useRouter,
  useFocusEffect,
} from 'expo-router';
import {
  getNeeds,
} from '../../src/services/needs.service';
import {
  AuthContext,
} from '../../src/store/auth.context';
import {
  decodeToken,
} from '../../src/utils/decodeToken';
import LoadingScreen from '../../src/components/LoadingScreen';
import {
  Header,
} from '../../src/components/ui/Header';
import {
  ActionCard,
} from '../../src/components/ui/ActionCard';
import {
  ScreenContainer,
} from '../../src/components/ui/ScreenContainer';
import {
  colors,
} from '../../src/theme/colors';
import {
  spacing,
} from '../../src/theme/spacing';
import {
  typography,
} from '../../src/theme/typography';
export default function Home() {
  const router = useRouter();
  const {
    setToken,
    token,
  } = useContext(AuthContext);
  const user =
    token
      ? decodeToken(token)
      : null;
  const isOngAdmin =
    user?.role === 'ong_admin';
  const isValidator =
    user?.role === 'ong_validator';
  const [needs, setNeeds] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState('');
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );
  const load = async () => {
    try {
      setError('');
      const data =
        await getNeeds();
      const filtered =
        data.filter(
          (n: any) =>
            n.status?.toUpperCase() !==
            'COMPLETED'
        );
      setNeeds(filtered);
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
        'Erro ao carregar campanhas'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
  };
  const handlePress = (
    item: any
  ) => {
    if (isOngAdmin) {
      router.push(
        `/need/details/${item.id}`
      );
      return;
    }
    router.push(
      `/need/${item.id}`
    );
  };
  const handleLogout = async () => {
    try {
      await setToken(null);
    } catch {
      setError(
        'Erro ao sair da conta'
      );
    }
  };
  if (loading) {
    return (
      <LoadingScreen
        text="Carregando campanhas..."
      />
    );
  }
  const renderCampaign =
    ({ item }: any) => {
      const progress =
        Math.min(
          (
            item.quantityReceived /
            item.quantityNeeded
          ) * 100,
          100
        ).toFixed(0);
      const priorityMap: any = {
        high: {
          label: 'Urgente',
          color: colors.error,
        },
        medium: {
          label: 'Pontual',
          color: colors.warning,
        },
        low: {
          label: 'Recorrente',
          color: colors.success,
        },
      };
      const priority =
        priorityMap[item.priority] ||
        priorityMap.low;
      const statusMap: any = {
        IN_PROGRESS:
          'Em andamento',
        FULFILLED:
          'Meta concluída',
        COMPLETED:
          'Finalizada',
      };
      const statusLabel =
        statusMap[
          item.status?.toUpperCase()
        ] || 'Aguardando';
      return (
        <Pressable
          onPress={() =>
            handlePress(item)
          }
          style={styles.card}
        >
          <Text style={styles.cardTitle}>
            {item.title}
          </Text>
          <Text
            numberOfLines={3}
            style={styles.cardDescription}
          >
            {item.description}
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {statusLabel}
              </Text>
            </View>
            <Text
              style={[
                styles.priorityText,
                {
                  color:
                    priority.color,
                },
              ]}
            >
              {priority.label}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View
              style={styles.progressHeader}
            >
              <Text
                style={styles.progressLabel}
              >
                Doações recebidas
              </Text>
              <Text
                style={styles.progressValue}
              >
                {progress}%
              </Text>
            </View>
            <View style={styles.progressBar}>
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
              style={styles.progressText}
            >
              {item.quantityReceived}
              {' / '}
              {item.quantityNeeded}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🏢 ONG:{' '}
              {item.ong?.name ||
                item.ong?.email}
            </Text>
            <Text
              style={[
                styles.footerText,
                {
                  marginTop: 6,
                },
              ]}
            >
              📅 Até:{' '}
              {item.deadline
                ? new Date(
                    item.deadline
                  ).toLocaleDateString(
                    'pt-BR'
                  )
                : 'Sem prazo'}
            </Text>
          </View>
        </Pressable>
      );
    };
  return (
    <ScreenContainer>
      <FlatList
        data={needs}
        keyExtractor={(item: any) =>
          item.id
        }
        renderItem={renderCampaign}
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
            <Header
              title="Haredo"
              subtitle="Plataforma de campanhas solidárias"
            />
            {(isOngAdmin ||
              isValidator) && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  styles.actionsContainer
                }
              >
                {isOngAdmin && (
                  <>
                    <ActionCard
                      icon="📦"
                      title="Criar campanha"
                      onPress={() =>
                        router.push(
                          '/create-need'
                        )
                      }
                    />
                    <ActionCard
                      icon="📍"
                      title="Ponto de coleta"
                      onPress={() =>
                        router.push(
                          '/create-collection-point'
                        )
                      }
                    />
                    <ActionCard
                      icon="👤"
                      title="Criar validador"
                      onPress={() =>
                        router.push(
                          '/create-validator'
                        )
                      }
                    />
                  </>
                )}
              </ScrollView>
            )}
            {!!error && (
              <View style={styles.errorBox}>
                <Text
                  style={styles.errorText}
                >
                  {error}
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Text
              style={styles.emptyText}
            >
              Nenhuma campanha disponível
            </Text>
          </View>
        }
      />
      <Pressable
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>
          Sair
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  actionsContainer: {
    paddingHorizontal:
      spacing.lg,
    paddingVertical:
      spacing.lg,
  },
  errorBox: {
    marginHorizontal:
      spacing.lg,
    marginBottom:
      spacing.md,
    backgroundColor:
      '#fee2e2',
    borderWidth: 1,
    borderColor:
      '#fecaca',
    borderRadius: 14,
    padding: spacing.md,
  },
  errorText: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    color:
      colors.textSecondary,
    fontSize:
      typography.fontSizes.md,
  },
  card: {
    backgroundColor:
      colors.white,
    borderRadius: 22,
    padding: spacing.lg,
    marginHorizontal:
      spacing.lg,
    marginBottom:
      spacing.lg,
  },
  cardTitle: {
    fontSize:
      typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    marginTop: spacing.sm,
    color:
      colors.textSecondary,
    lineHeight: 22,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop:
      spacing.md,
  },
  statusBadge: {
    backgroundColor:
      '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize:
      typography.fontSizes.xs,
  },
  priorityText: {
    fontWeight: '700',
    fontSize:
      typography.fontSizes.sm,
  },
  progressContainer: {
    marginTop:
      spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },
  progressLabel: {
    color: colors.text,
  },
  progressValue: {
    color: colors.success,
    fontWeight: '700',
  },
  progressBar: {
    marginTop: spacing.sm,
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
    marginTop: spacing.sm,
    fontSize:
      typography.fontSizes.sm,
    color:
      colors.textSecondary,
  },
  footer: {
    marginTop:
      spacing.lg,
    paddingTop:
      spacing.md,
    borderTopWidth: 1,
    borderTopColor:
      '#f1f5f9',
  },
  footerText: {
    color:
      colors.textSecondary,
    fontSize:
      typography.fontSizes.sm,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor:
      colors.error,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoutText: {
    color: colors.white,
    fontWeight: '700',
  },
});