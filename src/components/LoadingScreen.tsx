// src/components/LoadingScreen.tsx

import {
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import { theme } from '../theme/theme';

type Props = {
  text?: string;
};

export default function LoadingScreen({
  text,
}: Props) {

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor:
          theme.colors.background,
      }}
    >

      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
      />

      <Text
        style={{
          marginTop: 12,
          color:
            theme.colors.textSecondary,
        }}
      >
        {text || 'Carregando...'}
      </Text>

    </View>

  );
}