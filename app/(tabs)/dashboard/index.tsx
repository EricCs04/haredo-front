import {
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import {
  useFocusEffect,
} from '@react-navigation/native';
import {
  getDashboardKpis,
} from '../../../src/services/dashboard.service';
import LoadingScreen from '../../../src/components/LoadingScreen';
import AppCard from '../../../src/components/AppCard';
import {
  Header,
} from '../../../src/components/ui/Header';
import {
  ScreenContainer,
} from '../../../src/components/ui/ScreenContainer';
import {
  theme,
} from '../../../src/theme/theme';
export default function Dashboard() {
  const [data, setData] =
    useState<any>(null);
  const [refreshing, setRefreshing] =
    useState(false);
  const load = async () => {
    if (refreshing) {
      return;
    }
    try {
      setRefreshing(true);
      const res =
        await getDashboardKpis();
      setData(res);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  // Atualiza sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );
  // Atualização automática a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      load();
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  if (!data) {
    return (
      <LoadingScreen
        text="Carregando dashboard..."
      />
    );
  }
  const cards = [
    {
      title: 'Campanhas',
      value: data.totalCampaigns,
      icon: '📌',
    },
    {
      title: 'Ativas',
      value: data.activeCampaigns,
      icon: '🟡',
    },
    {
      title: 'Meta atingida',
      value: data.fulfilledCampaigns,
      icon: '🎯',
    },
    {
      title: 'Finalizadas',
      value: data.completedCampaigns,
      icon: '🏁',
    },
    {
      title: 'Doações',
      value: data.totalDonations,
      icon: '💝',
    },
    {
      title: 'Taxa de sucesso',
      value: `${data.completionRate}%`,
      icon: '📈',
    },
  ];
  return (
    <ScreenContainer>
      <Header
        title="Dashboard"
      />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color:
              theme.colors.textSecondary,
            marginBottom: 20,
          }}
        >
          Acompanhe os indicadores
          gerais da plataforma.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent:
              'space-between',
          }}
        >
          {cards.map((card) => (
            <View
              key={card.title}
              style={{
                width: '48%',
                marginBottom: 14,
              }}
            >
              <AppCard>
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {card.icon}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    marginTop: 10,
                    color:
                      theme.colors.primary,
                  }}
                >
                  {card.value}
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    color:
                      theme.colors.textSecondary,
                  }}
                >
                  {card.title}
                </Text>
              </AppCard>
            </View>
          ))}
        </View>
        <View
          style={{
            marginTop: 12,
            padding: 16,
            borderRadius: 16,
            backgroundColor:
              theme.colors.primaryLight,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color:
                theme.colors.primary,
              marginBottom: 6,
            }}
          >
            Resumo da plataforma
          </Text>
          <Text
            style={{
              color:
                theme.colors.text,
              lineHeight: 22,
            }}
          >
            Atualmente existem{' '}
            {data.totalCampaigns}{' '}
            campanhas cadastradas,
            sendo{' '}
            {data.activeCampaigns}{' '}
            ativas. Foram registradas{' '}
            {data.totalDonations}{' '}
            doações e a taxa geral
            de conclusão está em{' '}
            {data.completionRate}%.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}