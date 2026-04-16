import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/store/auth.context';
import { useContext, useEffect } from 'react';

function RootLayoutNav() {
  const { token, loading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['login', 'register'];
    const inAuthRoute = publicRoutes.includes(segments[0]);

    if (!token && !inAuthRoute) {
      router.replace('/login');
    }

    if (token && inAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [token, segments, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}