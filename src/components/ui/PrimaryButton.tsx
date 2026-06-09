import {
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';

import {
  colors,
} from '../../theme/colors';

import {
  spacing,
} from '../../theme/spacing';

import {
  typography,
} from '../../theme/typography';

type Props = {

  title: string;

  onPress: () => void | Promise<void>;

  loading?: boolean;

  disabled?: boolean;

  variant?: 'primary' | 'danger';

};

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: Props) {

  const backgroundColor =
    variant === 'danger'
      ? colors.error
      : colors.primary;

  return (

    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={{

        backgroundColor:
          loading || disabled
            ? '#9ca3af'
            : backgroundColor,

        paddingVertical:
          spacing.md,

        borderRadius: 14,

        alignItems: 'center',

        opacity:
          loading || disabled
            ? 0.7
            : 1,
      }}
    >

      {loading ? (

        <ActivityIndicator
          color="#fff"
        />

      ) : (

        <Text
          style={{
            color: '#fff',
            ...typography.button,
          }}
        >
          {title}
        </Text>

      )}

    </Pressable>

  );
}