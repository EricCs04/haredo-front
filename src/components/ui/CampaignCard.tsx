import {
  Pressable,
  Text,
  View,
} from 'react-native';

type Props = {
  item: any;
  onPress: () => void;
};

export function CampaignCard({
  item,
  onPress,
}: Props) {

  const progress =
    Math.min(
      (
        item.quantityReceived /
        item.quantityNeeded
      ) * 100,
      100
    ).toFixed(0);

  const priorityColor =
    item.priority === 'high'
      ? '#dc2626'
      : item.priority === 'medium'
      ? '#ea580c'
      : '#16a34a';

  const priorityLabel =
    item.priority === 'high'
      ? 'Urgente'
      : item.priority === 'medium'
      ? 'Pontual'
      : 'Recorrente';

  const status =
    item.status?.toUpperCase();

  const statusLabel =
    status === 'IN_PROGRESS'
      ? 'Em andamento'
      : status === 'FULFILLED'
      ? 'Meta concluída'
      : status === 'COMPLETED'
      ? 'Finalizada'
      : 'Aguardando';

  return (

    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
      }}
    >

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#111',
        }}
      >
        {item.title}
      </Text>

      <Text
        numberOfLines={3}
        style={{
          marginTop: 8,
          color: '#666',
          lineHeight: 21,
        }}
      >
        {item.description}
      </Text>

      {/* STATUS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
        }}
      >

        <View
          style={{
            backgroundColor: '#eff6ff',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >

          <Text
            style={{
              color: '#2563eb',
              fontWeight: 'bold',
              fontSize: 12,
            }}
          >
            {statusLabel}
          </Text>

        </View>

        <Text
          style={{
            color: priorityColor,
            fontWeight: 'bold',
            fontSize: 13,
          }}
        >
          {priorityLabel}
        </Text>

      </View>

      {/* PROGRESSO */}
      <View
        style={{
          marginTop: 18,
        }}
      >

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >

          <Text
            style={{
              color: '#444',
            }}
          >
            Doações recebidas
          </Text>

          <Text
            style={{
              color: '#16a34a',
              fontWeight: 'bold',
            }}
          >
            {progress}%
          </Text>

        </View>

        <View
          style={{
            height: 10,
            backgroundColor: '#e5e7eb',
            borderRadius: 999,
            overflow: 'hidden',
            marginTop: 8,
          }}
        >

          <View
            style={{
              width: `${progress}%` as any,
              height: '100%',
              backgroundColor: '#22c55e',
            }}
          />

        </View>

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: '#666',
          }}
        >
          {item.quantityReceived}
          {' / '}
          {item.quantityNeeded}
        </Text>

      </View>

      {/* FOOTER */}
      <View
        style={{
          marginTop: 16,
          borderTopWidth: 1,
          borderColor: '#f1f5f9',
          paddingTop: 12,
        }}
      >

        <Text
          style={{
            fontSize: 13,
            color: '#555',
          }}
        >
          🏢 ONG:
          {' '}
          {item.ong?.name ||
            item.ong?.email}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: '#555',
          }}
        >
          📅 Até:
          {' '}
          {item.deadline
            ? new Date(
                item.deadline
              ).toLocaleDateString(
                'pt-BR'
              )
            : 'Sem prazo'}
        </Text>

      </View>

    </Pressable>

  );
}