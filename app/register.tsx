import {
  useState,
} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  useRouter,
} from 'expo-router';
import {
  registerUser,
} from '../src/services/users.service';
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
  spacing,
} from '../src/theme/spacing';
import {
  colors,
} from '../src/theme/colors';
export default function Register() {
  const router =
    useRouter();
  const [name, setName] =
    useState('');
  const [email, setEmail] =
    useState('');
  const [password, setPassword] =
    useState('');
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');
  const [phone, setPhone] =
    useState('');
  const [address, setAddress] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');
  const validateFields =
    () => {
      if (
        !name.trim()
      ) {
        return 'Digite seu nome';
      }
      if (
        !email.includes('@')
      ) {
        return 'Digite um email válido';
      }
      if (
        password.length < 6
      ) {
        return 'Senha deve ter ao menos 6 caracteres';
      }
      if (
        password !==
        confirmPassword
      ) {
        return 'As senhas não coincidem';
      }
      if (
        !phone.trim()
      ) {
        return 'Digite seu telefone';
      }
      if (
        !address.trim()
      ) {
        return 'Digite seu endereço';
      }
      return '';
    };
  const handleRegister =
    async () => {
      try {
        const validationError =
          validateFields();
        if (
          validationError
        ) {
          setError(
            validationError
          );
          return;
        }
        setError('');
        setLoading(true);
        await registerUser({
          name,
          email,
          password,
          phone,
          address,
        });
        router.replace(
          '/login'
        );
      } catch (err: any) {
        console.log(err);
        const message =
          err?.response?.data
            ?.message;
        if (
          Array.isArray(
            message
          )
        ) {
          setError(
            message[0]
          );
        } else if (
          typeof message ===
          'string'
        ) {
          setError(message);
        } else {
          setError(
            'Erro ao criar conta.'
          );
        }
      } finally {
        setLoading(false);
      }
    };
  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{
          padding:
            spacing.lg,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        <AuthHeader
          title="Criar conta"
          subtitle="Comece a ajudar campanhas solidárias"
        />
        <AuthCard>
          <AppInput
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
          />
          <AppInput
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <AppInput
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <AppInput
            label="Confirmar senha"
            placeholder="Digite novamente"
            secureTextEntry
            value={
              confirmPassword
            }
            onChangeText={
              setConfirmPassword
            }
          />
          <AppInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <AppInput
            label="Endereço"
            placeholder="Digite seu endereço"
            value={address}
            onChangeText={setAddress}
          />
          {!!error && (
            <ErrorMessage
              message={error}
            />
          )}
          <PrimaryButton
            title={
              loading
                ? 'Criando conta...'
                : 'Criar conta'
            }
            onPress={
              handleRegister
            }
            disabled={loading}
          />
          {loading && (
            <ActivityIndicator
              color={
                colors.primary
              }
              style={{
                marginTop:
                  spacing.md,
              }}
            />
          )}
        </AuthCard>
        <Text
          onPress={() =>
            router.replace(
              '/login'
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
          Já possui conta? Entrar
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}