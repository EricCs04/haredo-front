import { View, Text } from 'react-native';

type Props = {
  message: string;
};

export function ErrorMessage({
  message,
}: Props) {

  if (!message) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        padding: 14,
        borderRadius: 14,
        marginBottom: 18,
      }}
    >

      <Text
        style={{
          color: '#dc2626',
          fontWeight: '600',
        }}
      >
        {message}
      </Text>

    </View>
  );
}