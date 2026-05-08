import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useContext } from 'react';

import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  getNeedById,
  completeNeed,
} from '../../../src/services/needs.service';

import { AuthContext } from '../../../src/store/auth.context';

export default function NeedDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [need, setNeed] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // imagens em base64
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getNeedById(id as string);
    setNeed(data);
  };

  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permissão negada');
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.4,
        base64: true,
        allowsMultipleSelection: true,
        selectionLimit: 5,  
      });

    if (result.canceled) {
      return;
    }

    const formattedImages = result.assets
      .filter((asset) => asset.base64)
      .map(
        (asset) =>
          `data:image/jpeg;base64,${asset.base64}`
      );

    setImages((prev) => [
      ...prev,
      ...formattedImages,
    ]);
  };

  const handleComplete = async () => {
    if (!message) {
      alert('Digite uma mensagem');
      return;
    }

    try {
      setLoading(true);

      await completeNeed(id as string, {
        message,
        images,
      });

      alert('Campanha finalizada!');
      router.back();

    } catch (err) {
      console.log(err);
      alert('Erro ao finalizar');
    } finally {
      setLoading(false);
    }
  };

  if (!need) {
    return <Text>Carregando...</Text>;
  }

  const progress = Math.min(
    (need.quantityReceived / need.quantityNeeded) * 100,
    100
  ).toFixed(0);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
    >

      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
        }}
      >
        {need.title}
      </Text>

      <Text style={{ marginTop: 10 }}>
        {need.description}
      </Text>

      <Text style={{ marginTop: 12 }}>
        {need.quantityReceived} / {need.quantityNeeded}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontWeight: 'bold',
          color: 'green',
        }}
      >
        {progress}% concluído
      </Text>

      <Text style={{ marginTop: 6 }}>
        Status: {need.status}
      </Text>

      {/* FINALIZAR */}
      {user?.role === 'ong_admin' &&
        need.status?.toUpperCase() !== 'COMPLETED' && (

        <View style={{ marginTop: 30 }}>

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            Finalizar campanha
          </Text>

          {/* mensagem */}
          <TextInput
            placeholder="Mensagem para os doadores"
            value={message}
            onChangeText={setMessage}
            multiline
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              marginTop: 12,
              padding: 12,
              borderRadius: 10,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
          />

          {/* botão imagem */}
          <View style={{ marginTop: 20 }}>
            <Button
              title="Selecionar imagem"
              onPress={handlePickImage}
            />
          </View>

          {/* preview */}
          {images.length > 0 && (
            <View style={{ marginTop: 20 }}>

              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}
              >
                Imagens selecionadas
              </Text>

              {images.map((img, index) => (
                <View
                  key={index}
                  style={{ marginBottom: 16 }}
                >

                  <Image
                    source={{ uri: img }}
                    style={{
                      width: '100%',
                      height: 220,
                      borderRadius: 14,
                    }}
                    resizeMode="cover"
                  />

                </View>
              ))}
            </View>
          )}

          {/* finalizar */}
          <View style={{ marginTop: 24 }}>
            <Button
              title={
                loading
                  ? 'Finalizando...'
                  : 'Finalizar campanha'
              }
              onPress={handleComplete}
            />
          </View>

        </View>
      )}

      {/* IMAGENS DA CAMPANHA FINALIZADA */}
      {need.images?.length > 0 && (
        <View style={{ marginTop: 30 }}>

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 14,
            }}
          >
            Fotos da campanha
          </Text>

          {need.images.map((img: string, index: number) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: 14,
                marginBottom: 14,
              }}
              resizeMode="cover"
            />
          ))}

        </View>
      )}

    </ScrollView>
  );
}