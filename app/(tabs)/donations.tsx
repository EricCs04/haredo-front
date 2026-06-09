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
  StyleSheet,
} from 'react-native';
import {
  useRouter,
  useFocusEffect,
} from 'expo-router';
import {
  getMyDonations,
} from '../../src/services/donations.service';
import {
  AuthContext,
} from '../../src/store/auth.context';
import LoadingScreen from '../../src/components/LoadingScreen';
import {
  ScreenContainer,
} from '../../src/components/ui/ScreenContainer';
import {
  Header,
} from '../../src/components/ui/Header';
import {
  colors,
} from '../../src/theme/colors';
import {
  spacing,
} from '../../src/theme/spacing';
import {
  typography,
} from '../../src/theme/typography';
export default function Donations() {
  const router = useRouter();
  const {
    user,
  } = useContext(AuthContext);
  const canValidate =
    user?.role === 'ong_admin' ||
    user?.role === 'ong_validator';
  const [donations, setDonations] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState('');
  const loadDonations =
    useCallback(async () => {
      try {
        setError('');
        const data =
          await getMyDonations();
        setDonations(data);
      } catch (err: any) {
        console.log(
          err?.response?.data
        );
        setError(
          err?.response?.data?.message ||
          'Erro ao carregar doações'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);
  useFocusEffect(
    useCallback(() => {
      loadDonations();
    }, [loadDonations])
  );
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDonations();
  };
  const handlePress = (
    item: any
  ) => {
    if (canValidate) {
      if (item.confirmed) {
        setError(
          'Esta doação já foi confirmada'
        );
        return;
      }
      router.push(
        `/donation/${item.id}`
      );
      return;
    }
    router.push(
      `/donation/details/${item.id}`
    );
  };
  const renderDonation = ({
    item,
  }: any) => {
    const date =
      new Date(
        item.createdAt
      ).toLocaleString(
        'pt-BR'
      );
    const statusColor =
      item.confirmed
        ? colors.success
        : colors.warning;
    const statusBackground =
      item.confirmed
        ? '#edf7ed'
        : '#fff4e5';
    return (
      <Pressable
        onPress={() =>
          handlePress(item)
        }
        style={styles.card}
      >
        {/* TÍTULO */}
        <Text
          style={styles.cardTitle}
        >
          {item.need.title}
        </Text>
        {/* DATA */}
        <Text
          style={styles.date}
        >
          {date}
        </Text>
        {/* INFORMAÇÕES */}
        <View
          style={styles.infoContainer}
        >
          {canValidate ? (
            <Text
              style={styles.infoText}
            >
              👤 Doador:{' '}
              <Text
                style={styles.infoHighlight}
              >
                {item.user?.name ||
                  item.user?.email}
              </Text>
            </Text>
          ) : (
            <Text
              style={styles.infoText}
            >
              🏢 ONG:{' '}
              <Text
                style={styles.infoHighlight}
              >
                {item.ong?.name ||
                  item.ong?.email}
              </Text>
            </Text>
          )}
          <Text
            style={[
              styles.infoText,
              {
                marginTop: 8,
              },
            ]}
          >
            📦 Quantidade:{' '}
            <Text
              style={styles.infoHighlight}
            >
              {item.quantity}
            </Text>
          </Text>
        </View>
        {/* STATUS */}
        <View
          style={[
            styles.statusBox,
            {
              backgroundColor:
                statusBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: statusColor,
              },
            ]}
          >
            {item.confirmed
              ? '✅ Doação confirmada'
              : '⏳ Aguardando confirmação'}
          </Text>
        </View>
        {/* CÓDIGO */}
        {user?.role === 'user' &&
          item.confirmationCode && (
          <View
            style={styles.codeBox}
          >
            <Text
              style={styles.codeLabel}
            >
              Código de confirmação
            </Text>
            <Text
              style={styles.code}
            >
              {item.confirmationCode}
            </Text>
          </View>
        )}
        {/* FOOTER */}
        <View
          style={styles.footer}
        >
          <Text
            style={styles.footerAction}
          >
            {canValidate
              ? 'Abrir validação →'
              : 'Ver detalhes →'}
          </Text>
        </View>
      </Pressable>
    );
  };
  if (loading) {
    return (
      <LoadingScreen
        text="Carregando doações..."
      />
    );
  }
  return (
    <ScreenContainer>
      <FlatList
        data={donations}
        keyExtractor={(item: any) =>
          item.id
        }
        renderItem={renderDonation}
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
            {/* HEADER */}
            <Header
              title="Doações"
              subtitle={
                canValidate
                  ? 'Gerencie e valide doações'
                  : 'Acompanhe suas doações'
              }
            />
            {/* ERRO */}
            {!!error && (
              <View
                style={styles.errorBox}
              >
                <Text
                  style={styles.errorText}
                >
                  {error}
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={() => (
          <View
            style={styles.emptyContainer}
          >
            <Text
              style={styles.emptyEmoji}
            >
              📦
            </Text>
            <Text
              style={styles.emptyTitle}
            >
              Nenhuma doação encontrada
            </Text>
            <Text
              style={styles.emptyText}
            >
              {canValidate
                ? 'Ainda não existem doações para validar.'
                : 'Você ainda não realizou nenhuma doação.'}
            </Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
  },
  errorBox: {
    marginHorizontal:
      spacing.lg,
    marginTop:
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
    color: colors.danger,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal:
      spacing.xl,
  },
  emptyEmoji: {
    fontSize: 54,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    fontSize:
      typography.title.fontSize,
    fontWeight:
      typography.title.fontWeight,
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: spacing.sm,
    color:
      colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontSize:
      typography.body.fontSize,
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
      typography.subtitle.fontSize,
    fontWeight:
      typography.subtitle.fontWeight,
    color: colors.text,
  },
  date: {
    marginTop: 6,
    color:
      colors.textSecondary,
    fontSize:
      typography.caption.fontSize,
  },
  infoContainer: {
    marginTop:
      spacing.md,
  },
  infoText: {
    color: colors.text,
    lineHeight: 22,
  },
  infoHighlight: {
    fontWeight: '700',
    color: colors.text,
  },
  statusBox: {
    marginTop:
      spacing.lg,
    padding: spacing.md,
    borderRadius: 14,
  },
  statusText: {
    fontWeight: '700',
  },
  codeBox: {
    marginTop:
      spacing.lg,
    backgroundColor:
      colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      colors.border,
    padding: spacing.md,
  },
  codeLabel: {
    color:
      colors.textSecondary,
    fontSize:
      typography.caption.fontSize,
  },
  code: {
    marginTop: spacing.sm,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: colors.text,
  },
  footer: {
    marginTop:
      spacing.lg,
    paddingTop:
      spacing.md,
    borderTopWidth: 1,
    borderTopColor:
      colors.border,
  },
  footerAction: {
    color: colors.primary,
    fontWeight: '700',
  },
});