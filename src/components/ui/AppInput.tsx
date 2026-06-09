import {
  Text,
  TextInput,
  View,
  TextInputProps,
} from 'react-native';

type Props = TextInputProps & {
  label: string;
};

export function AppInput({
  label,
  ...rest
}: Props) {

  return (
    <View
      style={{
        marginBottom: 18,
      }}
    >

      <Text
        style={{
          marginBottom: 8,
          fontWeight: '600',
          color: '#374151',
        }}
      >
        {label}
      </Text>

      <TextInput
        placeholderTextColor="#9ca3af"
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          backgroundColor: '#f9fafb',
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 15,
          fontSize: 15,
          color: '#111827',
        }}
        {...rest}
      />

    </View>
  );
}