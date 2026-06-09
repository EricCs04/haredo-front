import { Tabs } from 'expo-router';
import {
  Ionicons,
} from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="donations"
        options={{
          title: 'Doações',
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="gift"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Histórico',
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="time"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="bar-chart"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}