import {
  useContext,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import {
  useRouter,
} from 'expo-router';
import {
  AuthContext,
} from '../src/store/auth.context';
import {
  login,
} from '../src/services/auth.service';
import {
  ScreenContainer,
} from '../src/components/ui/ScreenContainer';
import {
  AuthHeader,
} from '../src/components/ui/AuthHeader';
import {
  AuthCard,
} from '../src/components/ui/AuthCard';
import {
  AppInput,
} from '../src/components/ui/AppInput';
import {
  PrimaryButton,
} from '../src/components/ui/PrimaryButton';
import {
  ErrorMessage,
} from '../src/components/ui/ErrorMessage';
import {
  colors,
} from '../src/theme/colors';
import {
  spacing,
} from '../src/theme/spacing';
export default function Login() {
  const router =
    useRouter();
  const {
    setToken,
  } = useContext(AuthContext);
  const [email, setEmail] =
    useState('');
  const [password, setPassword] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');
  const handleLogin =
    async () => {
      try {
        setError('');
        if (
          !email.trim() ||
          !password.trim()
        ) {
          setError(
            'Preencha email e senha.'
          );
          return;
        }
        setLoading(true);
        const data =
          await login(
            email,
            password
          );
        await setToken(
          data.accessToken
        );
      } catch (err: any) {
        console.log(err);
        if (
          err?.response?.status === 401
        ) {
          setError(
            'Email ou senha inválidos.'
          );
        } else if (
          err?.message?.includes(
            'Network'
          )
        ) {
          setError(
            'Erro de conexão com o servidor.'
          );
        } else {
          setError(
            'Erro ao realizar login.'
          );
        }
      } finally {
        setLoading(false);
      }
    };
  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding:
            spacing.lg,
        }}
      >
        <AuthHeader
          title="Haredo"
          subtitle="Entre para continuar"
        />
        <AuthCard>
          <AppInput
            label="Email"
            placeholder="Digite seu email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AppInput
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {!!error && (
            <ErrorMessage
              message={error}
            />
          )}
          <PrimaryButton
            title={
              loading
                ? 'Entrando...'
                : 'Entrar'
            }
            onPress={handleLogin}
            disabled={loading}
          />
          {loading && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{
                marginTop:
                  spacing.md,
              }}
            />
          )}
        </AuthCard>
        <Text
          onPress={() =>
            router.push(
              '/register'
            )
          }
          style={{
            marginTop:
              spacing.lg,
            textAlign: 'center',
            color:
              colors.primary,
            fontWeight: '600',
          }}
        >
          Criar conta
        </Text>
      </View>
    </ScreenContainer>
  );
}