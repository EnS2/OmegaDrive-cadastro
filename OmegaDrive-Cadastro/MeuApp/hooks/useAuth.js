/* eslint-disable import/no-unresolved */
// app/hooks/useAuth.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    })();
  }, []);

  async function signIn(email, password) {
    setError(null);
    try {
      const data = await apiLogin({ email, password });
      await AsyncStorage.setItem('token', data.token);   // salva o token
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (e) {
      setError(e.message);
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  return { user, loading, error, signIn, signOut };
}
