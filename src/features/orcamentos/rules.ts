import type { Categoria, Lancamento, MesReferencia, Orcamento, StatusOrcamento } from '../../types';
import { capitalize, monthName } from '../../utils/format';

export const PERCENTUAIS_ALERTA = [50, 70, 80, 90];
export const PERCENTUAL_ALERTA_PADRAO = 80;

export function mesDe(date: Date): MesReferencia {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function inicioDoMes(mes: MesReferencia): Date {
  const [ano, m] = mes.split('-').map(Number);
  return new Date(ano, m - 1, 1);
}

export function somarMeses(mes: MesReferencia, quantidade: number): MesReferencia {
  const d = inicioDoMes(mes);
  return mesDe(new Date(d.getFullYear(), d.getMonth() + quantidade, 1));
}

export function rotuloDoMes(mes: MesReferencia): string {
  const d = inicioDoMes(mes);
  return `${capitalize(monthName(d))} de ${d.getFullYear()}`;
}

export function gastoDaCategoriaNoMes(lancamentos: Lancamento[], categoriaId: string, mes: MesReferencia): number {
  return lancamentos
    .filter((l) => l.tipo === 'despesa' && l.categoriaId === categoriaId && mesDe(new Date(l.data)) === mes)
    .reduce((soma, l) => soma + l.valor, 0);
}

export interface UsoOrcamento {
  gasto: number;
  percentual: number;
  restante: number;
  status: StatusOrcamento;
}

export function statusDe(percentual: number, percentualAlerta: number): StatusOrcamento {
  if (percentual >= 100) return 'estourado';
  if (percentual >= percentualAlerta) return 'atencao';
  return 'ok';
}

export function calcularUso(orcamento: Orcamento, gasto: number): UsoOrcamento {
  const percentual = orcamento.valorLimite > 0 ? (gasto / orcamento.valorLimite) * 100 : 0;
  return {
    gasto,
    percentual,
    restante: orcamento.valorLimite - gasto,
    status: statusDe(percentual, orcamento.percentualAlerta),
  };
}

export interface ErrosOrcamento {
  categoria?: string;
  valorLimite?: string;
  percentualAlerta?: string;
}

export function validarOrcamento(
  dados: { categoriaId: string; mesReferencia: MesReferencia; valorLimite: number; percentualAlerta: number },
  categoria: Categoria | undefined,
  orcamentosDoMes: Orcamento[],
  idEditando?: string,
): ErrosOrcamento {
  const erros: ErrosOrcamento = {};

  if (!categoria || categoria.excluido) erros.categoria = 'Escolha uma categoria.';
  else if (categoria.tipo !== 'despesa') erros.categoria = 'Orçamentos são só para categorias de despesa.';
  else if (
    orcamentosDoMes.some(
      (o) => o.id !== idEditando && o.categoriaId === dados.categoriaId && o.mesReferencia === dados.mesReferencia,
    )
  ) {
    erros.categoria = 'Essa categoria já tem orçamento neste mês.';
  }

  if (!(dados.valorLimite > 0)) erros.valorLimite = 'Informe um limite maior que zero.';

  if (!Number.isInteger(dados.percentualAlerta) || dados.percentualAlerta < 1 || dados.percentualAlerta > 100) {
    erros.percentualAlerta = 'O alerta deve ficar entre 1% e 100%.';
  }
  return erros;
}
