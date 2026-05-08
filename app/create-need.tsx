import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { createNeed } from '../src/services/needs.service';
import { router } from 'expo-router';

export default function CreateNeed() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium');

  const [deadline, setDeadline] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !description || !quantity) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);

      await createNeed({
        title,
        description,
        category: 'geral',
        quantityNeeded: Number(quantity),
        priority,
        deadline: deadline.toISOString(),
      });

      alert('Necessidade criada com sucesso!');
      router.back();
    } catch (err) {
      console.log(err);
      alert('Erro ao criar necessidade');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    {
      label: 'Baixa',
      value: 'low',
      color: '#4CAF50',
    },
    {
      label: 'Média',
      value: 'medium',
      color: '#FF9800',
    },
    {
      label: 'Alta',
      value: 'high',
      color: '#F44336',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Criar Campanha
      </Text>

      {/* TÍTULO */}
      <Text style={{ marginBottom: 6 }}>
        Título
      </Text>

      <TextInput
        placeholder="Ex: Arrecadação de roupas"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* DESCRIÇÃO */}
      <Text style={{ marginBottom: 6 }}>
        Descrição
      </Text>

      <TextInput
        placeholder="Descreva a necessidade..."
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 12,
          height: 120,
          textAlignVertical: 'top',
          marginBottom: 16,
        }}
      />

      {/* QUANTIDADE */}
      <Text style={{ marginBottom: 6 }}>
        Quantidade necessária
      </Text>

      <TextInput
        placeholder="0"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 12,
          marginBottom: 20,
        }}
      />

      {/* PRIORIDADE */}
      <Text
        style={{
          marginBottom: 10,
          fontWeight: 'bold',
        }}
      >
        Prioridade
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {priorityOptions.map((item) => {
          const selected = priority === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setPriority(item.value as any)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                backgroundColor: selected
                  ? item.color
                  : '#eee',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: selected ? '#fff' : '#333',
                  fontWeight: 'bold',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* DATA LIMITE */}
      <Text
        style={{
          marginBottom: 10,
          fontWeight: 'bold',
        }}
      >
        Data limite
      </Text>

      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 14,
          marginBottom: 24,
        }}
      >
        <Text>
          {deadline.toLocaleDateString('pt-BR')}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              setDeadline(selectedDate);
            }
          }}
        />
      )}

      {/* BOTÃO */}
      <Button
        title={
          loading
            ? 'Criando campanha...'
            : 'Criar campanha'
        }
        onPress={handleCreate}
      />
    </ScrollView>
  );
}