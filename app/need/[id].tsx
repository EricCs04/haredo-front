import { useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { createDonation } from '../../src/services/donations.service';

export default function NeedDetail() {
  const { id } = useLocalSearchParams();

  const handleDonate = async () => {
    await createDonation(id as string, 1);
    alert('Doação feita!');
  };

  return (//Acrescentar detalhes do need aqui!
    <View>
      <Text>Detalhe do Need</Text>
      <Button title="Doar 1" onPress={handleDonate} />
    </View>
  );
}