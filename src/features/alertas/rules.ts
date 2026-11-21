import type { DadosAlerta } from '../../repositories/alertaRepository';
import type { Categoria, Lancamento, NivelAlerta, Orcamento } from '../../types';
import { monthName } from '../../utils/format';
import { calcularUso, gastoDaCategoriaNoMes, inicioDoMes } from '../orcamentos/rules';

export function tituloDoAlerta(nivel: NivelAlerta, nomeCategoria: string): string {
  return nivel === 'limite' ? `Limite de ${nomeCategoria} atingido` : `${nomeCategoria} perto do limite`;
}

function mensagemDoAlerta(nivel: NivelAlerta, nomeCategoria: string, percentual: number, mesRef: string): string {
  const mes = monthName(inicioDoMes(mesRef));
  const pct = Math.round(percentual);
  return nivel === 'limite'
    ? `Você chegou a ${pct}% do orçamento de ${nomeCategoria} em ${mes}.`
    : `Você já usou ${pct}% do orçamento de ${nomeCategoria} em ${mes}.`;
}

export function nivelAtingido(percentual: number, percentualAlerta: number): NivelAlerta | null {
  if (percentual >= 100) return 'limite';
  if (percentual >= percentualAlerta) return 'alerta';
  return null;
}

export function avaliarAlertas(
  orcamentos: Orcamento[],
  lancamentos: Lancamento[],
  categoriasPorId: Map<string, Categoria>,
  agora: Date = new Date(),
): DadosAlerta[] {
  const resultado: DadosAlerta[] = [];
  for (const o of orcamentos) {
    if (o.excluido) continue;
    const uso = calcularUso(o, gastoDaCategoriaNoMes(lancamentos, o.categoriaId, o.mesReferencia));
    const nivel = nivelAtingido(uso.percentual, o.percentualAlerta);
    if (!nivel) continue;
    const nome = categoriasPorId.get(o.categoriaId)?.nome ?? 'categoria';
    resultado.push({
      orcamentoId: o.id,
      nivel,
      dataHora: agora.toISOString(),
      percentualAtingido: Math.round(uso.percentual),
      mensagem: mensagemDoAlerta(nivel, nome, uso.percentual, o.mesReferencia),
    });
  }
  return resultado;
}
