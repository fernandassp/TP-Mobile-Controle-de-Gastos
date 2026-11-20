import type { Lancamento, TipoLancamento } from '../../types';
import { addMonths, dayKey, dayLabel, normalize, startOfMonth } from '../../utils/format';

export type Periodo = 'este_mes' | 'mes_passado' | 'ultimos_3_meses';
export type Ordem = 'recentes' | 'antigos';

export interface Filtros {
  busca: string;
  tipo: 'todos' | TipoLancamento;
  periodo: Periodo;
  categoriaIds: string[];
  ordem: Ordem;
}

export const FILTROS_PADRAO: Filtros = {
  busca: '',
  tipo: 'todos',
  periodo: 'este_mes',
  categoriaIds: [],
  ordem: 'recentes',
};

/** Intervalo [início, fim) do período. */
export function intervaloDoPeriodo(periodo: Periodo, now: Date = new Date()): { inicio: Date; fim: Date } {
  const mesAtual = startOfMonth(now);
  switch (periodo) {
    case 'mes_passado':
      return { inicio: addMonths(mesAtual, -1), fim: mesAtual };
    case 'ultimos_3_meses':
      return { inicio: addMonths(mesAtual, -2), fim: addMonths(mesAtual, 1) };
    case 'este_mes':
    default:
      return { inicio: mesAtual, fim: addMonths(mesAtual, 1) };
  }
}

/** Aplica busca, tipo, período e categorias, e ordena por data (RF05). */
export function aplicarFiltros(lista: Lancamento[], filtros: Filtros, now: Date = new Date()): Lancamento[] {
  const { inicio, fim } = intervaloDoPeriodo(filtros.periodo, now);
  const termo = normalize(filtros.busca);

  const filtrada = lista.filter((l) => {
    const data = new Date(l.data);
    if (data < inicio || data >= fim) return false;
    if (filtros.tipo !== 'todos' && l.tipo !== filtros.tipo) return false;
    if (filtros.categoriaIds.length > 0 && !filtros.categoriaIds.includes(l.categoriaId)) return false;
    if (termo && !normalize(l.descricao).includes(termo)) return false;
    return true;
  });

  const direcao = filtros.ordem === 'recentes' ? -1 : 1;
  return filtrada.sort((a, b) => direcao * (new Date(a.data).getTime() - new Date(b.data).getTime()));
}

/** Quantos filtros do painel (período, categorias, ordem) estão fora do padrão. */
export function contarFiltrosAtivos(f: Filtros): number {
  return (
    (f.periodo !== FILTROS_PADRAO.periodo ? 1 : 0) +
    (f.categoriaIds.length > 0 ? 1 : 0) +
    (f.ordem !== FILTROS_PADRAO.ordem ? 1 : 0)
  );
}

export function temFiltroAtivo(f: Filtros): boolean {
  return contarFiltrosAtivos(f) > 0 || f.tipo !== 'todos' || f.busca.trim() !== '';
}

export interface GrupoDeDia {
  chave: string;
  titulo: string;
  itens: Lancamento[];
}

/** Agrupa uma lista já ordenada por dia ("Hoje", "Ontem", "12 de novembro"). */
export function agruparPorDia(lista: Lancamento[], now: Date = new Date()): GrupoDeDia[] {
  const grupos: GrupoDeDia[] = [];
  for (const l of lista) {
    const data = new Date(l.data);
    const chave = dayKey(data);
    let grupo = grupos[grupos.length - 1];
    if (!grupo || grupo.chave !== chave) {
      grupo = { chave, titulo: dayLabel(data, now), itens: [] };
      grupos.push(grupo);
    }
    grupo.itens.push(l);
  }
  return grupos;
}

export interface Totais {
  receitas: number;
  despesas: number;
  saldo: number;
}

/** Total de receitas, despesas e saldo (RF06). O saldo é calculado, nunca guardado. */
export function totalizar(lista: Lancamento[]): Totais {
  let receitas = 0;
  let despesas = 0;
  for (const l of lista) {
    if (l.tipo === 'receita') receitas += l.valor;
    else despesas += l.valor;
  }
  return { receitas, despesas, saldo: receitas - despesas };
}
