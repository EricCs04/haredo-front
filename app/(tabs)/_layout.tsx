import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="donations" options={{ title: 'Doações' }} />
      <Tabs.Screen name="explore" options={{ title: 'Histórico' }} />
    </Tabs>
  );
}