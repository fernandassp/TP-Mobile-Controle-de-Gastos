import { DEFAULT_CATEGORIES } from '../constants/categories';
import { MOCK_LANCAMENTOS } from '../constants/mockData';
import type { Categoria, Lancamento } from '../types';

interface UseLancamentosResult {
  lancamentos: Lancamento[];
  categorias: Categoria[];
  loading: boolean;
}

/**
 * Ponto único de acesso aos dados das telas Início e Lançamentos.
 *
 * Hoje devolve dados de exemplo. Quando a camada de repositório (SQLite)
 * estiver pronta, só este hook precisa mudar: ler do repositório e
 * devolver o mesmo formato. As telas não mudam.
 */
export function useLancamentos(): UseLancamentosResult {
  return { lancamentos: MOCK_LANCAMENTOS, categorias: DEFAULT_CATEGORIES, loading: false };
}
