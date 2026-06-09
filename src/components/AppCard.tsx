// src/components/AppCard.tsx

import {
  View,
  ViewProps,
} from 'react-native';

import { theme } from '../theme/theme';

export default function AppCard({
  children,
  style,
}: ViewProps) {

  return (

    <View
      style={[
        {
          backgroundColor:
            theme.colors.card,

          borderRadius:
            theme.radius.md,

          padding:
            theme.spacing.md,

          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 6,

          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>

  );
}