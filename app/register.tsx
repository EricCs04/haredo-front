import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  SafeAreaView,
  Text,
} from 'react-native';
import { registerUser } from '../src/services/users.service';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser({
        name,
        email,
        password,
        phone,
        address,
      });

      alert('Conta criada!');
      router.replace('/login');
    } catch (err: any) {
      alert('Erro ao cadastrar');
      console.log(err.response?.data);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text>Cadastro</Text>

        <TextInput placeholder="Nome" onChangeText={setName} />
        <TextInput placeholder="Email" onChangeText={setEmail} />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          onChangeText={setPassword}
        />
        <TextInput placeholder="Telefone" onChangeText={setPhone} />
        <TextInput placeholder="Endereço" onChangeText={setAddress} />

        <Button title="Cadastrar" onPress={handleRegister} />
        
      </View>
    </SafeAreaView>
  );
}