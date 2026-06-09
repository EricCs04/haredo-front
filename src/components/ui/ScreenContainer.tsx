import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  colors,
} from '../../theme/colors';

type Props = {
  children: React.ReactNode;
};

export function ScreenContainer({
  children,
}: Props) {

  return (

    <SafeAreaView
      style={styles.safe}
    >

      <View style={styles.container}>
        {children}
      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  container: {
    flex: 1,
  },

});