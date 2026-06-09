import {
  View,
  Text,
} from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export function EmptyState({
  title,
  subtitle,
}: Props) {

  return (

    <View
      style={{
        marginTop: 80,
        alignItems: 'center',
        paddingHorizontal: 30,
      }}
    >

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      {!!subtitle && (

        <Text
          style={{
            marginTop: 10,
            color: '#777',
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {subtitle}
        </Text>

      )}

    </View>

  );
}