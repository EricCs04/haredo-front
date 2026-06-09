// src/components/AppButton.tsx

import {
  Pressable,
  Text,
} from 'react-native';

import { theme } from '../theme/theme';

type Props = {
  title: string;
  onPress: () => void;
  color?: string;
};

export default function AppButton({
  title,
  onPress,
  color,
}: Props) {

  return (

    <Pressable
      onPress={onPress}
      style={{
        backgroundColor:
          color ||
          theme.colors.primary,

        paddingVertical: 14,

        borderRadius:
          theme.radius.full,

        alignItems: 'center',
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