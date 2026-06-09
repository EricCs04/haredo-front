import {
  useState,
  useContext,
} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  router,
} from 'expo-router';
import {
  api,
} from '@/src/api/api';
import {
  AuthContext,
} from '@/src/store/auth.context';
import {
  ScreenContainer,
} from '@/src/components/ui/ScreenContainer';
import {
  Header,
} from '@/src/components/ui/Header';
import {
  AppInput,
} from '@/src/components/ui/AppInput';
import {
  PrimaryButton,
} from '@/src/components/ui/PrimaryButton';
import {
  colors,
} from '@/src/theme/colors';
import {
  spacing,
} from '@/src/theme/spacing';
import {
  typography,
} from '@/src/theme/typography';
export default function CreateValidator() {
  const {
    token,
  } = useContext(AuthContext);
  const [name, setName] =
    useState('');
  const [email, setEmail] =
    useState('');
  const [phone, setPhone] =
    useState('');
  const [password, setPassword] =
    useState('');
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');
  const handleCreate = async () => {
    try {
      setError('');
      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        setError(
          'Preencha todos os campos'
        );
        return;
      }
      if (
        password !==
        confirmPassword
      ) {
        setError(
          'As senhas não coincidem'
        );
        return;
      }
      if (password.length < 6) {
        setError(
          'A senha deve ter pelo menos 6 caracteres'
        );
        return;
      }
      setLoading(true);
      await api.post(
        '/ongs/create-validator',
        {
          name,
          email,
          phone,
          password,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
      Alert.alert(
        'Sucesso',
        'Validador criado com sucesso'
      );
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      router.back();
    } catch (err: any) {
      console.log(
        err?.response?.data
      );
      setError(
        err?.response?.data
          ?.message ||
        'Erro ao criar validador'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScreenContainer>
      <Header
            title="Novo Validador"
            subtitle="Crie contas responsáveis pela validação de doações"
          />
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          
          {!!error && (
            <View
              style={styles.errorBox}
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
          <View
            style={styles.form}
          >
            <AppInput
              label="Nome"
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
            />
            <AppInput
              label="Email"
              placeholder="email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <AppInput
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <AppInput
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={
                setPassword
              }
              secureTextEntry
            />
            <AppInput
              label="Confirmar senha"
              placeholder="••••••••"
              value={
                confirmPassword
              }
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry
            />
            <PrimaryButton
              title={
                loading
                  ? 'Criando validador...'
                  : 'Criar validador'
              }
              onPress={
                handleCreate
              }
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      padding:
        spacing.lg,
      paddingBottom: 48,
    },
    form: {
      marginTop:
        spacing.xl,
      gap: spacing.lg,
    },
    errorBox: {
      marginTop:
        spacing.lg,
      backgroundColor:
        colors.dangerLight,
      borderWidth: 1,
      borderColor:
        colors.danger,
      borderRadius: 16,
      padding:
        spacing.md,
    },
    errorText: {
      color:
        colors.danger,
      fontSize:
        typography.body
          .fontSize,
      fontWeight: '600',
    },
  });