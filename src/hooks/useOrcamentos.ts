import { useCallback, useMemo } from 'react';
import { temErros } from '../features/categorias/rules';
import {
  calcularUso,
  gastoDaCategoriaNoMes,
  validarOrcamento,
  type ErrosOrcamento,
  type UsoOrcamento,
} from '../features/orcamentos/rules';
import { orcamentoRepository, type DadosOrcamento } from '../repositories/orcamentoRepository';
import type { Categoria, MesReferencia, Orcamento } from '../types';
import { useCategorias } from './useCategorias';
import { useLancamentos } from './useLancamentos';
import { useObservado } from './useObservado';

export interface OrcamentoDetalhado {
  orcamento: Orcamento;
  categoria: Categoria | undefined;
  uso: UsoOrcamento;
}

interface UseOrcamentosResult {
  itens: OrcamentoDetalhado[];
  totalLimite: number;
  totalGasto: number;
  loading: boolean;
  salvar: (dados: DadosOrcamento, id?: string) => Promise<ErrosOrcamento>;
  excluir: (id: string) => Promise<void>;
}

export function useOrcamentos(mes: MesReferencia): UseOrcamentosResult {
  const { lancamentos } = useLancamentos();
  const { categoriasPorId } = useCategorias();
  const carregar = useCallback(() => orcamentoRepository.listar(mes), [mes]);
  const { dados: orcamentos, loading } = useObservado(orcamentoRepository, carregar, [] as Orcamento[]);

  const itens = useMemo(
    () =>
      orcamentos
        .map((o) => ({
          orcamento: o,
          categoria: categoriasPorId.get(o.categoriaId),
          uso: calcularUso(o, gastoDaCategoriaNoMes(lancamentos, o.categoriaId, o.mesReferencia)),
        }))
        .sort((a, b) => b.uso.percentual - a.uso.percentual),
    [orcamentos, categoriasPorId, lancamentos],
  );

  const totalLimite = itens.reduce((s, i) => s + i.orcamento.valorLimite, 0);
  const totalGasto = itens.reduce((s, i) => s + i.uso.gasto, 0);

  const salvar = useCallback(
    async (dados: DadosOrcamento, id?: string) => {
      const doMes = dados.mesReferencia === mes ? orcamentos : await orcamentoRepository.listar(dados.mesReferencia);
      const erros = validarOrcamento(dados, categoriasPorId.get(dados.categoriaId), doMes, id);
      if (temErros(erros)) return erros;
      if (id) await orcamentoRepository.atualizar(id, dados);
      else await orcamentoRepository.criar(dados);
      return {};
    },
    [mes, orcamentos, categoriasPorId],
  );

  const excluir = useCallback((id: string) => orcamentoRepository.excluir(id), []);

  return { itens, totalLimite, totalGasto, loading, salvar, excluir };
}
