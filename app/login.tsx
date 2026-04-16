import { useState, useContext } from 'react';
import { View, TextInput, Button } from 'react-native';
import { login } from '../src/services/auth.service';
import { AuthContext } from '../src/store/auth.context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Login() {
  const { setToken } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const data = await login(email, password);
    await setToken(data.accessToken);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <TextInput placeholder="Email" onChangeText={setEmail} />
        <TextInput placeholder="Senha" secureTextEntry onChangeText={setPassword} />
        <Button title="Login" onPress={handleLogin} />
      </View>
      <Button
        title="Criar conta"
        onPress={() => router.push('/register')}
      />
    </SafeAreaView>
  );
}