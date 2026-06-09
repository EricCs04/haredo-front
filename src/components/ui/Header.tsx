import {
  View,
  Text,
} from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export function Header({
  title,
  subtitle,
}: Props) {

  return (

    <View
      style={{
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 24,
        backgroundColor: '#2563eb',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >

      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#fff',
        }}
      >
        {title}
      </Text>

      {!!subtitle && (

        <Text
          style={{
            marginTop: 8,
            color: '#dbeafe',
            fontSize: 15,
          }}
        >
          {subtitle}
        </Text>

      )}

    </View>

  );
}