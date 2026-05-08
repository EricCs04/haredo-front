import { useEffect, useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  View,
  Text,
  ScrollView,
} from 'react-native';

import { Fonts } from '@/constants/theme';
import { getNeeds } from '@/src/services/needs.service';
import { getNearbyCollectionPoints } from '@/src/services/collectionPoints.service';

export default function ExploreScreen() {
  const [completedNeeds, setCompletedNeeds] = useState<any[]>([]);
  const [collectionPoints, setCollectionPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const needs = await getNeeds();

      // campanhas finalizadas
      const completed = needs.filter(
        (n: any) =>
          n.status?.toUpperCase() === 'COMPLETED' ||
          n.status?.toUpperCase() === 'FULFILLED'
      );

      setCompletedNeeds(completed);

      // pontos públicos (mock de localização atual)
      const points = await getNearbyCollectionPoints(
        -23.5505,
        -46.6333
      );

      setCollectionPoints(points);

    } catch (err) {
      console.log(err);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
    
      {/* HEADER */}
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontFamily: Fonts.rounded,
            fontSize: 28,
            fontWeight: 'bold',
          }}
        >
          Histórico e pontos de coleta
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Histórico de campanhas finalizadas e
        pontos de coleta disponíveis.
      </Text>

      {/* CAMPANHAS */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>
          ✅ Campanhas concluídas
        </Text>

        {completedNeeds.length === 0 && (
          <Text style={{ marginTop: 10 }}>
            Nenhuma campanha finalizada ainda.
          </Text>
        )}

        {completedNeeds.map((item) => {
          const progress = Math.min(
            (item.quantityReceived /
              item.quantityNeeded) *
              100,
            100
          ).toFixed(0);

          const deadline = item.deadline
            ? new Date(
                item.deadline
              ).toLocaleDateString('pt-BR')
            : 'Sem prazo';

          return (
            <Pressable
              key={item.id}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <Text style={styles.info}>
                📂 Categoria: {item.category}
              </Text>

              <Text style={styles.info}>
                📅 Prazo: {deadline}
              </Text>

              <Text style={styles.info}>
                🏢 ONG:{' '}
                {item.ong?.name ||
                  item.ong?.email}
              </Text>

              <Text style={styles.info}>
                📦 {item.quantityReceived} /{' '}
                {item.quantityNeeded}
              </Text>

              {/* PROGRESSO */}
              <View style={styles.progressBar}>
                <View
                  style={{
                    width:
                      `${progress}%` as `${number}%`,
                    height: '100%',
                    backgroundColor: '#22c55e',
                    borderRadius: 10,
                  }}
                />
              </View>

              <Text style={styles.progressText}>
                {progress}% arrecadado
              </Text>

              {/* PRIORIDADE */}
              <Text
                style={{
                  marginTop: 8,
                  fontWeight: 'bold',
                  color:
                    item.priority === 'high'
                      ? '#d32f2f'
                      : item.priority === 'medium'
                      ? '#f57c00'
                      : '#388e3c',
                }}
              >
                🚨 Prioridade:{' '}
                {item.priority === 'high'
                  ? 'Alta'
                  : item.priority === 'medium'
                  ? 'Média'
                  : 'Baixa'}
              </Text>

              {/* MENSAGEM FINAL */}
              {item.completionMessage && (
                <View style={styles.messageBox}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    📢 Mensagem da ONG
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {item.completionMessage}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* PONTOS */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>
          📍 Pontos de coleta
        </Text>

        {collectionPoints.length === 0 && (
          <Text style={{ marginTop: 10 }}>
            Nenhum ponto encontrado.
          </Text>
        )}

        {collectionPoints.map((point: any) => (
          <View
            key={point.id}
            style={styles.pointCard}
          >
            <Text style={styles.cardTitle}>
              {point.name}
            </Text>

            <Text
              style={{
                marginTop: 6,
              }}
            >
              {point.address}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 10,
  },
  section: {
    marginTop: 30,
    gap: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 16,
  },
  pointCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
    opacity: 0.8,
    color: '#333',
  },
  info: {
    marginTop: 8,
    color: '#222',
  },
  subtitle: {
    opacity: 0.7,
    lineHeight: 22,
    color: '#444',
  },
  progressBar: {
    marginTop: 12,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#22c55e',
  },

  messageBox: {
    marginTop: 16,
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
});