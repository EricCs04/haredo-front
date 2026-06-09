import {
  Pressable,
  Text,
} from 'react-native';

type Props = {
  title: string;
  color?: string;
  onPress: () => void;
};

export function FloatingButton({
  title,
  color = '#ef4444',
  onPress,
}: Props) {

  return (

    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,

        backgroundColor: color,

        paddingHorizontal: 20,
        paddingVertical: 14,

        borderRadius: 999,

        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,

        elevation: 4,
      }}
    >

      <Text
        style={{
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>

    </Pressable>

  );
}