import { View } from 'react-native';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function AuthCard({
  children,
}: Props) {

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 22,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      {children}
    </View>
  );
}