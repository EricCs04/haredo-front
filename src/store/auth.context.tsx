import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  token: null as string | null,
  loading: true,
  setToken: (token: string | null) => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setToken = async (value: string | null) => {
    if (value) {
      await AsyncStorage.setItem('token', value);
    } else {
      await AsyncStorage.removeItem('token');
    }
    setTokenState(value);
  };

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('token');
      setTokenState(stored);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};