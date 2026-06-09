// src/components/StatusBadge.tsx
import {
  View,
  Text,
} from 'react-native';
import { theme } from '../theme/theme';
type Props = {
  label: string;
};
export default function StatusBadge({
  label,
}: Props) {
  return (
    <View
      style={{
        backgroundColor:
          theme.colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius:
          theme.radius.full,
      }}
    >
      <Text
        style={{
          color:
            theme.colors.primary,
          fontWeight: 'bold',
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  );
}