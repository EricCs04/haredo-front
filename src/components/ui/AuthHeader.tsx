import { View, Text } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
};

export function AuthHeader({
  title,
  subtitle,
}: Props) {

  return (
    <View
      style={{
        marginBottom: 32,
      }}
    >

      <Text
        style={{
          fontSize: 34,
          fontWeight: 'bold',
          color: '#111827',
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 16,
          color: '#6b7280',
          lineHeight: 22,
        }}
      >
        {subtitle}
      </Text>

    </View>
  );
}