// app/hooks/useRegistros.js
import { useState, useCallback } from 'react';
import {
  buscarRegistrosDoDia,
  salvarRegistro,
  deletarRegistro,
// eslint-disable-next-line import/no-unresolved
} from '../services/api';

export function useRegistros() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarRegistrosDoDia = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const lista = await buscarRegistrosDoDia(data);
      setRegistros(lista);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const salvar = useCallback(async (registro, payload) => {
    setError(null);
    try {
      const novo = await salvarRegistro(registro, payload);
      setRegistros((prev) => [...prev.filter((r) => r.id !== novo.id), novo]);
      return novo;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);

  const deletar = useCallback(async (id) => {
    setError(null);
    try {
      await deletarRegistro(id);
      setRegistros((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);

  return { registros, loading, error, carregarRegistrosDoDia, salvar, deletar };
}
