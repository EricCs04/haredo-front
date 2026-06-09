// src/components/ProgressBar.tsx

import {
  View,
} from 'react-native';

import { theme } from '../theme/theme';

type Props = {
  progress: number;
};

export default function ProgressBar({
  progress,
}: Props) {

  return (

    <View
      style={{
        height: 10,
        backgroundColor:
          theme.colors.border,

        borderRadius:
          theme.radius.full,

        overflow: 'hidden',
      }}
    >

      <View
        style={{
          width: `${progress}%` as any,
          height: '100%',
          backgroundColor:
            '#22c55e',
        }}
      />

    </View>

  );
}