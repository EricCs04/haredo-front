import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useEffect,
  useState,
  useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  getNeedById,
  completeNeed,
} from '../../../src/services/needs.service';
import {
  uploadImage,
} from '../../../src/utils/uploadImage';
import {
  AuthContext,
} from '../../../src/store/auth.context';
import LoadingScreen from '../../../src/components/LoadingScreen';
import {
  ScreenContainer,
} from '../../../src/components/ui/ScreenContainer';
import {
  Header,
} from '../../../src/components/ui/Header';
import {
  AppInput,
} from '../../../src/components/ui/AppInput';
import {
  PrimaryButton,
} from '../../../src/components/ui/PrimaryButton';
import {
  colors,
} from '../../../src/theme/colors';
import {
  spacing,
} from '../../../src/theme/spacing';
import {
  typography,
} from '../../../src/theme/typography';
export default function NeedDetails() {
  const { id } =
    useLocalSearchParams();
  const router =
    useRouter();
  const { user } =
    useContext(AuthContext);
  const [need, setNeed] =
    useState<any>(null);
  const [message, setMessage] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [screenLoading, setScreenLoading] =
    useState(true);
  const [images, setImages] =
    useState<string[]>([]);
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    try {
      const data =
        await getNeedById(
          id as string
        );
      setNeed(data);
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Erro',
        'Não foi possível carregar a campanha'
      );
      router.back();
    } finally {
      setScreenLoading(false);
    }
  };
  const handlePickImage =
    async () => {
      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permissão negada',
          'Permita acesso às imagens para continuar.'
        );
        return;
      }
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          allowsMultipleSelection: true,
          selectionLimit: 5,
        });
      if (result.canceled) {
        return;
      }
      const selectedImages =
        result.assets.map(
          asset => asset.uri
        );
      setImages(prev => [
        ...prev,
        ...selectedImages,
      ]);
    };
  const handleComplete =
    async () => {
      if (!message.trim()) {
        Alert.alert(
          'Erro',
          'Digite uma mensagem para os doadores.'
        );
        return;
      }
      try {
        setLoading(true);
        let uploadedUrls: string[] = [];
        if (images.length > 0) {
          uploadedUrls =
            await Promise.all(
              images.map(
                img => uploadImage(img)
              )
            );
        }
        await completeNeed(
          id as string,
          {
            message,
            images: uploadedUrls,
          }
        );
        Alert.alert(
          'Sucesso',
          'Campanha finalizada com sucesso!'
        );
        router.back();
      } catch (err: any) {
        console.log(err);
        Alert.alert(
          'Erro',
          err?.response?.data?.message ||
          'Erro ao finalizar campanha'
        );
      } finally {
        setLoading(false);
      }
    };
  if (screenLoading) {
    return (
      <LoadingScreen
        text="Carregando campanha..."
      />
    );
  }
  if (!need) {
    return null;
  }
  const progress =
    Math.min(
      (
        need.quantityReceived /
        need.quantityNeeded
      ) * 100,
      100
    ).toFixed(0);
  const status =
    need.status?.toUpperCase();
  const statusLabel =
    status === 'IN_PROGRESS'
      ? 'Em andamento'
      : status === 'FULFILLED'
      ? 'Meta concluída'
      : status === 'COMPLETED'
      ? 'Finalizada'
      : 'Aguardando';
  return (
    <ScreenContainer>
      <Header
              title={need.title}
              subtitle="Detalhes da campanha"
            />
      <FlatList
        data={images}
        keyExtractor={(_, index) =>
          String(index)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
        ListHeaderComponent={
          <>
          
            {/* CARD */}
            <View style={styles.card}>
              <Text
                style={styles.description}
              >
                {need.description}
              </Text>
              {/* STATUS */}
              <View
                style={styles.statusRow}
              >
                <View
                  style={styles.statusBadge}
                >
                  <Text
                    style={styles.statusText}
                  >
                    {statusLabel}
                  </Text>
                </View>
                <Text
                  style={styles.progressPercent}
                >
                  {progress}%
                </Text>
              </View>
              {/* PROGRESSO */}
              <View
                style={styles.progressContainer}
              >
                <View
                  style={styles.progressBar}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width:
                          `${progress}%` as any,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={styles.progressText}
                >
                  {need.quantityReceived}
                  {' / '}
                  {need.quantityNeeded}
                </Text>
              </View>
              {/* INFO */}
              <View
                style={styles.infoContainer}
              >
                <Text
                  style={styles.infoText}
                >
                  🏢 ONG:{' '}
                  {need.ong?.name ||
                    need.ong?.email}
                </Text>
                <Text
                  style={styles.infoText}
                >
                  📅 Prazo:{' '}
                  {need.deadline
                    ? new Date(
                        need.deadline
                      ).toLocaleDateString(
                        'pt-BR'
                      )
                    : 'Sem prazo'}
                </Text>
              </View>
            </View>
            {/* FINALIZAR */}
            {user?.role ===
              'ong_admin' &&
              status !==
                'COMPLETED' && (
              <View
                style={styles.completeCard}
              >
                <Text
                  style={styles.completeTitle}
                >
                  Finalizar campanha
                </Text>
                <Text
                  style={styles.completeDescription}
                >
                  Envie uma mensagem
                  para os doadores e
                  adicione imagens da
                  campanha concluída.
                </Text>
                <AppInput
                  label="Mensagem final"
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChangeText={
                    setMessage
                  }
                  multiline
                  numberOfLines={5}
                  style={
                    styles.messageInput
                  }
                />
                <Pressable
                  onPress={
                    handlePickImage
                  }
                  style={
                    styles.imageButton
                  }
                >
                  <Text
                    style={
                      styles.imageButtonText
                    }
                  >
                    📷 Selecionar imagens
                  </Text>
                </Pressable>
                {images.length > 0 && (
                  <Text
                    style={
                      styles.selectedText
                    }
                  >
                    {images.length}
                    {' '}
                    imagem(ns)
                    selecionada(s)
                  </Text>
                )}
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <Image
            source={{
              uri: item,
            }}
            style={styles.image}
          />
        )}
        ListFooterComponent={
          <>
            {user?.role ===
              'ong_admin' &&
              status !==
                'COMPLETED' && (
              <PrimaryButton
                title={
                  loading
                    ? 'Finalizando...'
                    : 'Finalizar campanha'
                }
                onPress={
                  handleComplete
                }
                disabled={loading}
              />
            )}
          </>
        }
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    padding:
      spacing.lg,
    paddingBottom: 120,
  },
  card: {
    backgroundColor:
      colors.white,
    borderRadius: 24,
    padding:
      spacing.lg,
    marginTop:
      spacing.lg,
  },
  description: {
    fontSize:
      typography.body.fontSize,
    lineHeight: 24,
    color:
      colors.textSecondary,
  },
  statusRow: {
    marginTop:
      spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },
  statusBadge: {
    backgroundColor:
      colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusText: {
    color:
      colors.primary,
    fontWeight: '700',
    fontSize:
      typography.caption.fontSize,
  },
  progressPercent: {
    color:
      colors.success,
    fontWeight: '700',
    fontSize:
      typography.subtitle.fontSize,
  },
  progressContainer: {
    marginTop:
      spacing.lg,
  },
  progressBar: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor:
      '#e5e7eb',
  },
  progressFill: {
    height: '100%',
    backgroundColor:
      colors.success,
  },
  progressText: {
    marginTop:
      spacing.sm,
    color:
      colors.textSecondary,
    fontSize:
      typography.caption.fontSize,
  },
  infoContainer: {
    marginTop:
      spacing.lg,
    paddingTop:
      spacing.md,
    borderTopWidth: 1,
    borderTopColor:
      '#f1f5f9',
    gap: spacing.sm,
  },
  infoText: {
    color:
      colors.textSecondary,
    fontSize:
      typography.body.fontSize,
  },
  completeCard: {
    marginTop:
      spacing.xl,
    backgroundColor:
      colors.white,
    borderRadius: 24,
    padding:
      spacing.lg,
  },
  completeTitle: {
    fontSize:
      typography.title.fontSize,
    fontWeight:
      typography.title.fontWeight,
    color:
      colors.text,
  },
  completeDescription: {
    marginTop:
      spacing.sm,
    lineHeight: 22,
    color:
      colors.textSecondary,
    marginBottom:
      spacing.lg,
  },
  messageInput: {
    height: 140,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  imageButton: {
    marginTop:
      spacing.md,
    backgroundColor:
      colors.primaryLight,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  imageButtonText: {
    color:
      colors.primary,
    fontWeight: '700',
  },
  selectedText: {
    marginTop:
      spacing.md,
    color:
      colors.textSecondary,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 22,
    marginTop:
      spacing.lg,
  },
});