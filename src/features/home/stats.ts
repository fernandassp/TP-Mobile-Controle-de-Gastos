import type { Categoria, Lancamento } from '../../types';
import { addMonths, monthShort, startOfMonth } from '../../utils/format';

export interface GastoMensal {
  rotulos: string[];
  valores: number[];
}

/** Soma de despesas dos últimos `meses` meses, terminando no mês de `now` (RF07). */
export function gastosPorMes(lista: Lancamento[], now: Date = new Date(), meses = 6): GastoMensal {
  const base = startOfMonth(now);
  const rotulos: string[] = [];
  const valores: number[] = [];
  for (let i = meses - 1; i >= 0; i--) {
    const inicio = addMonths(base, -i);
    const fim = addMonths(base, -i + 1);
    rotulos.push(monthShort(inicio));
    valores.push(
      lista
        .filter((l) => l.tipo === 'despesa' && new Date(l.data) >= inicio && new Date(l.data) < fim)
        .reduce((soma, l) => soma + l.valor, 0),
    );
  }
  return { rotulos, valores };
}

export interface FatiaCategoria {
  id: string;
  nome: string;
  valor: number;
  percentual: number;
}

/** Despesas do mês agrupadas por categoria: as `max` maiores e o resto em "Outras" (RF07). */
export function gastosPorCategoria(
  lista: Lancamento[],
  categorias: Categoria[],
  now: Date = new Date(),
  max = 4,
): FatiaCategoria[] {
  const inicio = startOfMonth(now);
  const fim = addMonths(inicio, 1);
  const soma = new Map<string, number>();
  let total = 0;

  for (const l of lista) {
    const data = new Date(l.data);
    if (l.tipo !== 'despesa' || data < inicio || data >= fim) continue;
    soma.set(l.categoriaId, (soma.get(l.categoriaId) ?? 0) + l.valor);
    total += l.valor;
  }
  if (total === 0) return [];

  const nomes = new Map(categorias.map((c) => [c.id, c.nome]));
  const ordenadas = [...soma.entries()]
    .map(([id, valor]) => ({ id, nome: nomes.get(id) ?? 'Sem categoria', valor, percentual: (valor / total) * 100 }))
    .sort((a, b) => b.valor - a.valor);

  if (ordenadas.length <= max + 1) return ordenadas;

  const principais = ordenadas.slice(0, max);
  const resto = ordenadas.slice(max);
  const valorResto = resto.reduce((s, f) => s + f.valor, 0);
  return [...principais, { id: 'outras', nome: 'Outras', valor: valorResto, percentual: (valorResto / total) * 100 }];
}
