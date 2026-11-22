import { useCallback, useMemo } from 'react';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { MOCK_LANCAMENTOS } from '../constants/mockData';
import { categoriaRepository } from '../repositories/categoriaRepository';
import { lancamentoRepository } from '../repositories/lancamentoRepository';
import type { Observavel } from '../repositories/memory';
import type { Categoria, Lancamento } from '../types';
import { useObservado } from './useObservado';

interface UseLancamentosResult {
  lancamentos: Lancamento[];
  categorias: Categoria[];
  loading: boolean;
}

export function useLancamentos(): UseLancamentosResult {
  const fonteCombinada = useMemo<Observavel>(
    () => ({
      observar(listener) {
        const unsubLanc = lancamentoRepository.observar(listener);
        const unsubCat = categoriaRepository.observar(listener);
        return () => {
          unsubLanc();
          unsubCat();
        };
      },
    }),
    [],
  );

  const carregarDados = useCallback(async () => {
    const [listaLancamentos, listaCategorias] = await Promise.all([
      lancamentoRepository.listar(),
      categoriaRepository.listar(),
    ]);
    return {
      lancamentos: listaLancamentos,
      categorias: listaCategorias.filter((c) => !c.excluido),
    };
  }, []);

  const { dados, loading } = useObservado(fonteCombinada, carregarDados, {
    lancamentos: MOCK_LANCAMENTOS,
    categorias: DEFAULT_CATEGORIES,
  });

  return {
    lancamentos: dados.lancamentos,
    categorias: dados.categorias,
    loading,
  };
}