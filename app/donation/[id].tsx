import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { confirmDonation, getDonationById } from '../../src/services/donations.service';


export default function ConfirmDonationScreen() {
  const { id } = useLocalSearchParams();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [donation, setDonation] = useState<any>(null);
  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getDonationById(id as string);
      setDonation(data);
    } catch (err) {
      console.log(err);
      alert('Erro ao carregar doação');
    } finally {
      setScreenLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code) {
      alert('Digite o código');
      return;
    }

    try {
      setLoading(true);

      await confirmDonation(id as string, code);

      alert('Doação confirmada com sucesso!');
      router.back();

    } catch (err: any) {
      console.log(err.response?.data);
      alert('Código inválido ou erro');
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Doação não encontrada</Text>
      </View>
    );
  }

  const need = donation.need;

  const progress = Math.min(
    (need.quantityReceived / need.quantityNeeded) * 100,
    100
  ).toFixed(0);

  const deadline = need.deadline
    ? new Date(need.deadline).toLocaleDateString('pt-BR')
    : 'Sem prazo';

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >

      {/* HEADER */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Confirmar Doação
      </Text>

      {/* CARD DA CAMPANHA */}
      <View
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: '#f5f5f5',
          borderRadius: 12,
        }}
      >

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {need.title}
        </Text>

        <Text
          style={{
            marginTop: 10,
            color: '#555',
          }}
        >
          {need.description}
        </Text>

        {/* PRIORIDADE */}
        <Text
          style={{
            marginTop: 14,
            fontWeight: 'bold',
            color:
              need.priority === 'high'
                ? '#d32f2f'
                : need.priority === 'medium'
                ? '#f57c00'
                : '#388e3c',
          }}
        >
          Prioridade:{' '}
          {need.priority === 'high'
            ? 'Alta'
            : need.priority === 'medium'
            ? 'Média'
            : 'Baixa'}
        </Text>

        {/* PRAZO */}
        <Text style={{ marginTop: 8 }}>
          📅 Prazo: {deadline}
        </Text>

        {/* QUANTIDADE */}
        <Text style={{ marginTop: 8 }}>
          📦 {need.quantityReceived} / {need.quantityNeeded}
        </Text>

        {/* PROGRESSO */}
        <Text
          style={{
            marginTop: 6,
            fontWeight: 'bold',
            color: 'green',
          }}
        >
          {progress}% arrecadado
        </Text>

        {/* STATUS */}
        <Text
          style={{
            marginTop: 8,
            fontWeight: 'bold',
          }}
        >
          Status: {need.status}
        </Text>

      </View>

      {/* INSTRUÇÃO */}
      <Text
        style={{
          marginTop: 24,
          marginBottom: 8,
          fontWeight: 'bold',
        }}
      >
        Código informado pelo usuário
      </Text>

      {/* INPUT */}
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Digite o código"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          backgroundColor: '#fff',
        }}
      />

      {/* BOTÃO */}
      <View style={{ marginTop: 24 }}>
        <Button
          title={
            loading
              ? 'Confirmando...'
              : 'Confirmar doação'
          }
          onPress={handleConfirm}
        />
      </View>

    </ScrollView>
  );
}