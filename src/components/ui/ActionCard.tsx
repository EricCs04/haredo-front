import {
  Pressable,
  Text,
  View,
} from 'react-native';

type Props = {
  icon: string;
  title: string;
  description?: string;
  onPress?: () => void;
};

export function ActionCard({
  icon,
  title,
  description,
  onPress,
}: Props) {

  return (

    <Pressable
      onPress={onPress}
      style={{
        width: 160,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginRight: 12,

        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
      }}
    >

      <Text
        style={{
          fontSize: 28,
        }}
      >
        {icon}
      </Text>

      <Text
        style={{
          marginTop: 12,
          fontWeight: 'bold',
          fontSize: 15,
          color: '#111',
        }}
      >
        {title}
      </Text>

      {!!description && (

        <Text
          style={{
            marginTop: 6,
            color: '#666',
            fontSize: 13,
            lineHeight: 20,
          }}
        >
          {description}
        </Text>

      )}

    </Pressable>

  );
}