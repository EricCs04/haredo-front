import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

type JwtPayload = {
  sub: string;
  email: string;
  role: 'user' | 'ong_admin';
};
type User = {
  id: string;
  email: string;
  role: 'user' | 'ong_admin';
};


export const AuthContext = createContext({
  token: null as string | null,
  user: null as User | null,
  loading: true,
  setToken: (token: string | null) => {},
  setUser: (user: User | null) => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const setToken = async (value: string | null) => {
    
    if (value) {
      await AsyncStorage.setItem('token', value);
      const decoded = jwtDecode<JwtPayload>(value);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      });
    } else {
      await AsyncStorage.removeItem('token');
      setUser(null);
    }
    setTokenState(value);
  };

  useEffect(() => {
  const load = async () => {
    const stored = await AsyncStorage.getItem('token');

    if (stored) {
      try {
        const decoded = jwtDecode<JwtPayload>(stored);

        setUser({
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        });

        setTokenState(stored);
      } catch (err) {
        console.log('Erro ao decodificar token', err);
        await AsyncStorage.removeItem('token');
        setTokenState(null);
        setUser(null);
      }
    }

    setLoading(false);
  };

  load();
}, []);

  return (
    <AuthContext.Provider
    value={{
      token,
      user,
      loading,
      setToken,
      setUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};