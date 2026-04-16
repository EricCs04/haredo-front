import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { createNeed } from '../src/services/needs.service';
import { router } from 'expo-router';

export default function CreateNeed() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleCreate = async () => {
    await createNeed({
      title,
      description,
      category: 'geral',
      quantityNeeded: Number(quantity),
    });

    alert('Necessidade criada!');
    router.back();
  };

  return (
    <View>
      <Text>Criar Necessidade</Text>

      <TextInput placeholder="Título" onChangeText={setTitle} />
      <TextInput placeholder="Descrição" onChangeText={setDescription} />
      <TextInput
        placeholder="Quantidade"
        keyboardType="numeric"
        onChangeText={setQuantity}
      />

      <Button title="Criar" onPress={handleCreate} />
    </View>
  );
}