import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import {
  createNeed,
} from '../src/services/needs.service';
import {
  ScreenContainer,
} from '../src/components/ui/ScreenContainer';
import {
  Header,
} from '../src/components/ui/Header';
import {
  AppInput,
} from '../src/components/ui/AppInput';
import {
  PrimaryButton,
} from '../src/components/ui/PrimaryButton';
import {
  colors,
} from '../src/theme/colors';
import {
  spacing,
} from '../src/theme/spacing';
import {
  typography,
} from '../src/theme/typography';
export default function CreateNeed() {
  const [title, setTitle] =
    useState('');
  const [description, setDescription] =
    useState('');
  const [quantity, setQuantity] =
    useState('');
  const [priority, setPriority] =
    useState<
      'low' | 'medium' | 'high'
    >('medium');
  const [deadline, setDeadline] =
    useState(new Date());
  const [showDatePicker, setShowDatePicker] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');
  const validateFields = () => {
    if (!title.trim()) {
      setError(
        'Digite um título para a campanha'
      );
      return false;
    }
    if (!description.trim()) {
      setError(
        'Digite uma descrição'
      );
      return false;
    }
    if (!quantity.trim()) {
      setError(
        'Digite um valor Válido'
      );
      return false;
    }
    if (
      Number(quantity) <= 0
    ) {
      setError(
        'Digite uma quantidade válida'
      );
      return false;
    }
    return true;
  };
  const handleCreate = async () => {
    try {
      setError('');
      if (!validateFields()) {
        return;
      }
      setLoading(true);
      await createNeed({
        title,
        description,
        category: 'geral',
        quantityNeeded:
          Number(quantity),
        priority,
        deadline:
          deadline.toISOString(),
      });
      alert(
        '✅ Campanha criada com sucesso!'
      );
      router.back();
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
        'Erro ao criar campanha'
      );
    } finally {
      setLoading(false);
    }
  };
  const priorityOptions = [
    {
      label: 'Recorrente',
      value: 'low',
      color: colors.success,
    },
    {
      label: 'Pontual',
      value: 'medium',
      color: colors.warning,
    },
    {
      label: 'Urgente',
      value: 'high',
      color: colors.danger,
    },
  ];
  return (
    <ScreenContainer>
      {/* HEADER */}
        <Header
          title="Criar campanha"
          subtitle="Cadastre uma nova necessidade para arrecadação."
        />
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* CARD */}
        <View style={styles.card}>
          {!!error && (
            <View
              style={
                styles.errorContainer
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
          {/* TÍTULO */}
          <View
            style={
              styles.inputContainer
            }
          >
            <AppInput
              label="Título"
              placeholder="Ex: Arrecadação de roupas"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          {/* DESCRIÇÃO */}
          <View
            style={
              styles.inputContainer
            }
          >
            <AppInput
              label="Descrição da campanha"
              placeholder="Descreva sua campanha..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              style={styles.textArea}
            />

            <View
              style={{
                backgroundColor: '#eff6ff',
                borderRadius: 12,
                padding: 14,
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#bfdbfe',
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  color: '#1d4ed8',
                  marginBottom: 6,
                }}
              >
                💡 Dicas para uma boa descrição
              </Text>

              <Text
                style={{
                  color: '#475569',
                  lineHeight: 20,
                  fontSize: 13,
                }}
              >
                • Explique a necessidade da campanha{"\n"}
                • Informe quais itens são necessários{"\n"}
                • Descreva quem será beneficiado{"\n"}
                • Quanto mais detalhes, maiores as chances de receber doações
              </Text>
            </View>
          </View>
          {/* QUANTIDADE */}
          <View
            style={
              styles.inputContainer
            }
          >
            <AppInput
              label="Meta de Doações"
              placeholder="0"
              value={quantity}
              onChangeText={
                setQuantity
              }
              keyboardType="numeric"
            />
          </View>
          {/* PRIORIDADE */}
          <View
            style={
              styles.inputContainer
            }
          >
            <Text
              style={styles.label}
            >
              Prioridade
            </Text>
            <View
              style={
                styles.priorityRow
              }
            >
              {priorityOptions.map(
                (item) => {
                  const selected =
                    priority ===
                    item.value;
                  return (
                    <Pressable
                      key={item.value}
                      onPress={() =>
                        setPriority(
                          item.value as any
                        )
                      }
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor:
                            selected
                              ? item.color
                              : colors.backgroundSecondary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          {
                            color:
                              selected
                                ? colors.white
                                : colors.text,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
          {/* DATA */}
          <View
            style={
              styles.inputContainer
            }
          >
            <Text
              style={styles.label}
            >
              Data limite
            </Text>
            <Pressable
              onPress={() =>
                setShowDatePicker(
                  true
                )
              }
              style={
                styles.dateButton
              }
            >
              <Text
                style={
                  styles.dateText
                }
              >
                {deadline.toLocaleDateString(
                  'pt-BR'
                )}
              </Text>
            </Pressable>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={
                Platform.OS ===
                'ios'
                  ? 'spinner'
                  : 'default'
              }
              minimumDate={
                new Date()
              }
              onChange={(
                _event,
                selectedDate
              ) => {
                setShowDatePicker(
                  false
                );
                if (
                  selectedDate
                ) {
                  setDeadline(
                    selectedDate
                  );
                }
              }}
            />
          )}
          {/* BOTÃO */}
          <PrimaryButton
            title={
              loading
                ? 'Criando campanha...'
                : 'Criar campanha'
            }
            onPress={
              handleCreate
            }
            disabled={loading}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    padding:
      spacing.lg,
    paddingBottom: 120,
  },
  card: {
    backgroundColor:
      colors.white,
    borderRadius: 24,
    padding:
      spacing.lg,
  },
  errorContainer: {
    marginBottom:
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
  inputContainer: {
    marginBottom:
      spacing.lg,
  },
  label: {
    marginBottom:
      spacing.sm,
    fontSize:
      typography.body.fontSize,
    fontWeight: '600',
    color:
      colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical:
      'top',
    paddingTop: 14,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  priorityText: {
    fontWeight: '700',
    fontSize:
      typography.body.fontSize,
  },
  dateButton: {
    backgroundColor:
      colors.backgroundSecondary,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dateText: {
    color:
      colors.text,
    fontSize:
      typography.body.fontSize,
  },
});