import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  confirmDonation,
  getDonationById,
} from '../../src/services/donations.service';
import LoadingScreen from '../../src/components/LoadingScreen';
import {
  ScreenContainer,
} from '../../src/components/ui/ScreenContainer';
import {
  Header,
} from '../../src/components/ui/Header';
import {
  AppInput,
} from '../../src/components/ui/AppInput';
import {
  PrimaryButton,
} from '../../src/components/ui/PrimaryButton';
import {
  colors,
} from '../../src/theme/colors';
import {
  spacing,
} from '../../src/theme/spacing';
import {
  typography,
} from '../../src/theme/typography';
import { getNeedStatusLabel } from '@/src/utils/status.utils';
export default function ConfirmDonationScreen() {
  const { id } =
    useLocalSearchParams();
  const [code, setCode] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [donation, setDonation] =
    useState<any>(null);
  const [
    screenLoading,
    setScreenLoading,
  ] = useState(true);
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    try {
      const data =
        await getDonationById(
          id as string
        );
      setDonation(data);
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Erro',
        'Erro ao carregar doação'
      );
    } finally {
      setScreenLoading(false);
    }
  };
  const handleConfirm =
    async () => {
      if (!code.trim()) {
        Alert.alert(
          'Erro',
          'Digite o código de confirmação'
        );
        return;
      }
      try {
        setLoading(true);
        await confirmDonation(
          id as string,
          code
        );
        Alert.alert(
          'Sucesso',
          'Doação confirmada com sucesso!'
        );
        router.back();
      } catch (err: any) {
        console.log(
          err?.response?.data
        );
        Alert.alert(
          'Erro',
          err?.response?.data
            ?.message ||
            'Código inválido ou erro ao confirmar'
        );
      } finally {
        setLoading(false);
      }
    };
  if (screenLoading) {
    return (
      <LoadingScreen
        text="Carregando doação..."
      />
    );
  }
  if (!donation) {
    return (
      <ScreenContainer>
        <View
          style={
            styles.emptyContainer
          }
        >
          <Text
            style={styles.emptyText}
          >
            Doação não encontrada
          </Text>
        </View>
      </ScreenContainer>
    );
  }
  const need =
    donation.need;
  const progress =
    Math.min(
      (
        need.quantityReceived /
        need.quantityNeeded
      ) * 100,
      100
    ).toFixed(0);
  const deadline =
    need.deadline
      ? new Date(
          need.deadline
        ).toLocaleDateString(
          'pt-BR'
        )
      : 'Sem prazo';
  const priorityColor =
    need.priority === 'high'
      ? colors.danger
      : need.priority ===
        'medium'
      ? colors.warning
      : colors.success;
  const priorityLabel =
    need.priority === 'high'
      ? 'Urgente'
      : need.priority ===
        'medium'
      ? 'Pontual'
      : 'Recorrente';
  return (
    <ScreenContainer>
      <Header
              title="Confirmar doação"
              subtitle="Valide a entrega usando o código informado pelo usuário"
            />
      <FlatList
        data={[]}
        renderItem={null}
        keyExtractor={(_, index) =>
          String(index)
        }
        contentContainerStyle={
          styles.container
        }
        ListHeaderComponent={
          <>
            
            {/* CARD */}
            <View style={styles.card}>
              <Text
                style={styles.cardTitle}
              >
                {need.title}
              </Text>
              <Text
                style={
                  styles.description
                }
              >
                {need.description}
              </Text>
              {/* PRIORIDADE */}
              <View
                style={
                  styles.priorityRow
                }
              >
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
              </View>
              {/* PROGRESSO */}
              <View
                style={
                  styles.progressContainer
                }
              >
                <View
                  style={
                    styles.progressHeader
                  }
                >
                  <Text
                    style={
                      styles.progressLabel
                    }
                  >
                    Doações recebidas
                  </Text>
                  <Text
                    style={
                      styles.progressValue
                    }
                  >
                    {progress}%
                  </Text>
                </View>
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
                  {need.quantityReceived}
                  {' / '}
                  {need.quantityNeeded}
                </Text>
              </View>
              {/* INFO */}
              <View
                style={styles.infoBox}
              >
                <Text
                  style={
                    styles.infoText
                  }
                >
                  📅 Prazo:{' '}
                  {deadline}
                </Text>
                <Text
                  style={[
                    styles.infoText,
                    {
                      marginTop: 8,
                    },
                  ]}
                >
                  📌 Status:{' '}
                  {getNeedStatusLabel(need.status)}
                </Text> 
              </View>
            </View>
            {/* INPUT */}
            <View
              style={
                styles.confirmationCard
              }
            >
              <Text
                style={
                  styles.confirmationTitle
                }
              >
                Código de confirmação
              </Text>
              <Text
                style={
                  styles.confirmationText
                }
              >
                Solicite o código ao
                usuário para validar a
                entrega da doação.
              </Text>
              <AppInput
                label="Código"
                placeholder="Digite o código"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
              />
            </View>
          </>
        }
        ListFooterComponent={
          <PrimaryButton
            title={
              loading
                ? 'Confirmando...'
                : 'Confirmar doação'
            }
            onPress={
              handleConfirm
            }
            disabled={loading}
          />
        }
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    padding:
      spacing.lg,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color:
      colors.textSecondary,
    fontSize:
      typography.body.fontSize,
  },
  card: {
    marginTop:
      spacing.lg,
    backgroundColor:
      colors.white,
    borderRadius: 24,
    padding:
      spacing.lg,
  },
  cardTitle: {
    fontSize:
      typography.title.fontSize,
    fontWeight:
      typography.title.fontWeight,
    color:
      colors.text,
  },
  description: {
    marginTop:
      spacing.md,
    color:
      colors.textSecondary,
    lineHeight: 24,
    fontSize:
      typography.body.fontSize,
  },
  priorityRow: {
    marginTop:
      spacing.lg,
  },
  priorityText: {
    fontWeight: '700',
    fontSize:
      typography.subtitle.fontSize,
  },
  progressContainer: {
    marginTop:
      spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color:
      colors.text,
    fontWeight: '600',
  },
  progressValue: {
    color:
      colors.success,
    fontWeight: '700',
  },
  progressBar: {
    marginTop:
      spacing.sm,
    height: 12,
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
    color:
      colors.textSecondary,
    fontSize:
      typography.caption.fontSize,
  },
  infoBox: {
    marginTop:
      spacing.xl,
    paddingTop:
      spacing.lg,
    borderTopWidth: 1,
    borderTopColor:
      '#f1f5f9',
  },
  infoText: {
    color:
      colors.textSecondary,
    fontSize:
      typography.body.fontSize,
  },
  confirmationCard: {
    marginTop:
      spacing.xl,
    backgroundColor:
      colors.white,
    borderRadius: 24,
    padding:
      spacing.lg,
  },
  confirmationTitle: {
    fontSize:
      typography.subtitle.fontSize,
    fontWeight:
      typography.subtitle.fontWeight,
    color:
      colors.text,
  },
  confirmationText: {
    marginTop:
      spacing.sm,
    marginBottom:
      spacing.lg,
    lineHeight: 22,
    color:
      colors.textSecondary,
  },
});