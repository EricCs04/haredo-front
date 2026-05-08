import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';

import { router } from 'expo-router';

import { createCollectionPoint } from '../src/services/collectionPoints.service';
import { getCoordinatesFromAddress } from '../src/services/geocoding.service';

export default function CreateCollectionPoint() {
  const [name, setName] = useState('');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (
      !name ||
      !street ||
      !district ||
      !city ||
      !state
    ) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);

      // monta endereço completo
      const formattedAddress = [
        street,
        number,
        district,
        `${city} - ${state}`,
        'Brasil',
      ]
      .filter(Boolean)
      .join(', ');

      console.log('ENDEREÇO:', formattedAddress);

      const coords = await getCoordinatesFromAddress(
        formattedAddress
      );

      await createCollectionPoint({
        name,
        address: formattedAddress,
        lat: coords.lat,
        lng: coords.lng,
      });

      alert('Ponto criado com sucesso!');
      router.back();

    } catch (err: any) {
      console.log(
        'ERRO:',
        err?.response?.data || err
      );

      alert(
        'Não foi possível localizar o endereço.\n' +
        'Verifique os dados informados.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 24,
        }}
      >
        Novo ponto de coleta
      </Text>

      {/* NOME */}
      <Text
        style={{
          fontWeight: '600',
        }}
      >
        Nome do local
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Unidade Centro"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          marginBottom: 18,
          backgroundColor: '#fff',
        }}
      />

      {/* RUA */}
      <Text
        style={{
          fontWeight: '600',
        }}
      >
        Rua
      </Text>

      <TextInput
        value={street}
        onChangeText={setStreet}
        placeholder="Ex: Rua Itália"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          marginBottom: 18,
          backgroundColor: '#fff',
        }}
      />

      {/* NÚMERO */}
      <Text
        style={{
          fontWeight: '600',
        }}
      >
        Número (opcional)
      </Text>

      <TextInput
        value={number}
        onChangeText={setNumber}
        placeholder="Ex: 133"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          marginBottom: 18,
          backgroundColor: '#fff',
        }}
      />

      {/* BAIRRO */}
      <Text
        style={{
          fontWeight: '600',
        }}
      >
        Bairro
      </Text>

      <TextInput
        value={district}
        onChangeText={setDistrict}
        placeholder="Ex: Jardim São Luiz"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          marginBottom: 18,
          backgroundColor: '#fff',
        }}
      />

      {/* CIDADE */}
      <Text
        style={{
          fontWeight: '600',
        }}
      >
        Cidade
      </Text>

      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="Ex: São Paulo"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          marginBottom: 18,
          backgroundColor: '#fff',
        }}
      />

      {/* ESTADO */}
      <Text
        style={{
          fontWeight: '600',
        }}
      >
        Estado
      </Text>

      <TextInput
        value={state}
        onChangeText={setState}
        placeholder="Ex: SP"
        autoCapitalize="characters"
        maxLength={2}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          marginBottom: 30,
          backgroundColor: '#fff',
        }}
      />

      {/* BOTÃO */}
      <Button
        title={
          loading
            ? 'Criando ponto...'
            : 'Criar ponto de coleta'
        }
        onPress={handleCreate}
      />
    </ScrollView>
  );
}