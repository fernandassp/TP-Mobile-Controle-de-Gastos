import { useCallback, useEffect, useMemo } from 'react';
import { avaliarAlertas, tituloDoAlerta } from '../features/alertas/rules';
import { alertaRepository } from '../repositories/alertaRepository';
import { orcamentoRepository } from '../repositories/orcamentoRepository';
import type { Alerta, Categoria, Orcamento } from '../types';
import { useCategorias } from './useCategorias';
import { useLancamentos } from './useLancamentos';
import { useObservado } from './useObservado';

export interface AlertaDetalhado {
  alerta: Alerta;
  titulo: string;
  orcamento: Orcamento;
  categoria: Categoria | undefined;
}

interface UseAlertasResult {
  itens: AlertaDetalhado[];
  naoLidos: number;
  ultimoNaoLido: AlertaDetalhado | undefined;
  loading: boolean;
  marcarComoLido: (id: string) => Promise<void>;
  marcarTodosComoLidos: () => Promise<void>;
}

export function useAlertas(): UseAlertasResult {
  const { lancamentos } = useLancamentos();
  const { categoriasPorId } = useCategorias();

  const carregarOrcamentos = useCallback(() => orcamentoRepository.listar(), []);
  const { dados: orcamentos } = useObservado(orcamentoRepository, carregarOrcamentos, [] as Orcamento[]);
  const carregarAlertas = useCallback(() => alertaRepository.listar(), []);
  const { dados: alertas, loading } = useObservado(alertaRepository, carregarAlertas, [] as Alerta[]);

  useEffect(() => {
    if (categoriasPorId.size === 0) return;
    for (const dados of avaliarAlertas(orcamentos, lancamentos, categoriasPorId)) {
      void alertaRepository.criarSeNaoExistir(dados);
    }
  }, [orcamentos, lancamentos, categoriasPorId]);

  const itens = useMemo(() => {
    const orcamentosPorId = new Map(orcamentos.map((o) => [o.id, o]));
    const lista: AlertaDetalhado[] = [];
    for (const alerta of alertas) {
      const orcamento = orcamentosPorId.get(alerta.orcamentoId);
      if (!orcamento) continue;
      const categoria = categoriasPorId.get(orcamento.categoriaId);
      lista.push({ alerta, orcamento, categoria, titulo: tituloDoAlerta(alerta.nivel, categoria?.nome ?? 'Categoria') });
    }
    return lista;
  }, [alertas, orcamentos, categoriasPorId]);

  const naoLidos = itens.filter((i) => !i.alerta.lido).length;
  const ultimoNaoLido = itens.find((i) => !i.alerta.lido);

  const marcarComoLido = useCallback((id: string) => alertaRepository.marcarComoLido(id), []);
  const marcarTodosComoLidos = useCallback(() => alertaRepository.marcarTodosComoLidos(), []);

  return { itens, naoLidos, ultimoNaoLido, loading, marcarComoLido, marcarTodosComoLidos };
}
