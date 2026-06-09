import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  router,
} from 'expo-router';
import {
  createCollectionPoint,
} from '../src/services/collectionPoints.service';
import {
  getCoordinatesFromAddress,
} from '../src/services/geocoding.service';
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
export default function CreateCollectionPoint() {
  const [name, setName] =
    useState('');
  const [street, setStreet] =
    useState('');
  const [number, setNumber] =
    useState('');
  const [district, setDistrict] =
    useState('');
  const [city, setCity] =
    useState('');
  const [state, setState] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');
  const handleCreate = async () => {
    if (
      !name ||
      !street ||
      !district ||
      !city ||
      !state
    ) {
      setError(
        'Preencha os campos obrigatórios'
      );
      return;
    }
    try {
      setLoading(true);
      setError('');
      const formattedAddress = [
        street,
        number,
        district,
        `${city} - ${state}`,
        'Brasil',
      ]
        .filter(Boolean)
        .join(', ');
      const coords =
        await getCoordinatesFromAddress(
          formattedAddress
        );
      await createCollectionPoint({
        name,
        address:
          formattedAddress,
        lat: coords.lat,
        lng: coords.lng,
      });
      Alert.alert(
        'Sucesso',
        'Ponto criado com sucesso!'
      );
      router.back();
    } catch (err: any) {
      console.log(
        err?.response?.data || err
      );
      setError(
        'Não foi possível localizar o endereço.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScreenContainer>
      {/* HEADER */}
          <Header
            title="Novo ponto"
            subtitle="Cadastre um novo ponto de coleta"
          />
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          showsVerticalScrollIndicator={
            false
          }
        >
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
          {/* FORM */}
          <View
            style={styles.form}
          >
            <AppInput
              label="Nome do local"
              placeholder="Ex: Unidade Centro"
              value={name}
              onChangeText={setName}
            />
            <AppInput
              label="Rua"
              placeholder="Ex: Rua Itália"
              value={street}
              onChangeText={setStreet}
            />
            <AppInput
              label="Número"
              placeholder="Ex: 133"
              value={number}
              onChangeText={setNumber}
              keyboardType="numeric"
            />
            <AppInput
              label="Bairro"
              placeholder="Ex: Jardim São Luiz"
              value={district}
              onChangeText={setDistrict}
            />
            <AppInput
              label="Cidade"
              placeholder="Ex: São Paulo"
              value={city}
              onChangeText={setCity}
            />
            <AppInput
              label="Estado"
              placeholder="SP"
              value={state}
              onChangeText={(text) =>
                setState(
                  text.toUpperCase()
                )
              }
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
          {/* ENDEREÇO */}
          {(street ||
            district ||
            city ||
            state) && (
            <View
              style={
                styles.previewCard
              }
            >
              <Text
                style={
                  styles.previewTitle
                }
              >
                Pré-visualização
              </Text>
              <Text
                style={
                  styles.previewText
                }
              >
                {[
                  street,
                  number,
                  district,
                  `${city} - ${state}`,
                  'Brasil',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </View>
          )}
          {/* BOTÃO */}
          <PrimaryButton
            title={
              loading
                ? 'Criando ponto...'
                : 'Criar ponto de coleta'
            }
            onPress={
              handleCreate
            }
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
const styles =
  StyleSheet.create({
    container: {
      padding:
        spacing.lg,
      paddingBottom: 60,
    },
    form: {
      marginTop:
        spacing.lg,
      gap:
        spacing.md,
    },
    errorBox: {
      marginTop:
        spacing.md,
      backgroundColor:
        colors.dangerLight,
      borderWidth: 1,
      borderColor:
        '#fecaca',
      borderRadius: 16,
      padding:
        spacing.md,
    },
    errorText: {
      color:
        colors.error,
      fontWeight: '600',
    },
    previewCard: {
      marginTop:
        spacing.xl,
      backgroundColor:
        colors.white,
      borderRadius: 20,
      padding:
        spacing.lg,
      borderWidth: 1,
      borderColor:
        colors.border,
    },
    previewTitle: {
      ...typography.subtitle,
      color:
        colors.text,
      marginBottom:
        spacing.sm,
    },
    previewText: {
      ...typography.body,
      color:
        colors.textSecondary,
      lineHeight: 22,
    },
  });