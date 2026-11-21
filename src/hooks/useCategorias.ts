import { useCallback, useMemo } from 'react';
import { podeEditar, temErros, validarCategoria, type ErrosCategoria } from '../features/categorias/rules';
import { categoriaRepository, type DadosCategoria } from '../repositories/categoriaRepository';
import type { Categoria } from '../types';
import { useObservado } from './useObservado';

interface UseCategoriasResult {
  categorias: Categoria[];
  categoriasPorId: Map<string, Categoria>;
  loading: boolean;
  salvar: (dados: DadosCategoria, id?: string) => Promise<ErrosCategoria>;
  excluir: (id: string) => Promise<void>;
}

export function useCategorias(): UseCategoriasResult {
  const carregar = useCallback(() => categoriaRepository.listar(), []);
  const { dados: categorias, loading } = useObservado(categoriaRepository, carregar, [] as Categoria[]);
  const categoriasPorId = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);

  const salvar = useCallback(
    async (dados: DadosCategoria, id?: string) => {
      const erros = validarCategoria(dados, categorias, id);
      if (temErros(erros)) return erros;
      if (id) {
        const atual = categoriasPorId.get(id);
        if (!atual || !podeEditar(atual)) throw new Error('Esta categoria não pode ser editada.');
        await categoriaRepository.atualizar(id, { ...dados, tipo: atual.tipo });
      } else {
        await categoriaRepository.criar({ ...dados, nome: dados.nome.trim() });
      }
      return {};
    },
    [categorias, categoriasPorId],
  );

  const excluir = useCallback(
    async (id: string) => {
      const atual = categoriasPorId.get(id);
      if (!atual || !podeEditar(atual)) throw new Error('Esta categoria não pode ser excluída.');
      await categoriaRepository.excluir(id);
    },
    [categoriasPorId],
  );

  return { categorias, categoriasPorId, loading, salvar, excluir };
}
