import type { Lancamento } from '../types';

function at(daysAgo: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function monthsAgo(months: number, day: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - months);
  d.setDate(day);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

/**
 * Dados de exemplo, relativos à data de hoje, só para desenvolver as telas
 * enquanto o SQLite não está pronto. Remover quando o repositório existir.
 */
export const MOCK_LANCAMENTOS: Lancamento[] = [
  { id: 'm1', tipo: 'despesa', valor: 86.4, data: at(0, 12, 40), descricao: 'Mercado Verdemar', categoriaId: 'alimentacao' },
  { id: 'm2', tipo: 'receita', valor: 450, data: at(0, 10, 5), descricao: 'Freela de design', categoriaId: 'renda-extra' },
  { id: 'm3', tipo: 'despesa', valor: 23.9, data: at(0, 8, 12), descricao: 'Uber', categoriaId: 'transporte' },
  { id: 'm4', tipo: 'despesa', valor: 64, data: at(1, 20, 30), descricao: 'Cinema', categoriaId: 'lazer' },
  { id: 'm5', tipo: 'despesa', valor: 42.5, data: at(1, 13, 15), descricao: 'iFood', categoriaId: 'alimentacao' },
  { id: 'm6', tipo: 'despesa', valor: 138.7, data: at(3, 9, 0), descricao: 'Conta de luz', categoriaId: 'contas' },
  { id: 'm7', tipo: 'receita', valor: 4750, data: at(5, 8, 0), descricao: 'Salário', categoriaId: 'salario' },
  { id: 'm8', tipo: 'despesa', valor: 210, data: at(6, 18, 0), descricao: 'Farmácia', categoriaId: 'saude' },
  // meses anteriores (para o gráfico "Gastos mês a mês")
  { id: 'a1', tipo: 'despesa', valor: 1320, data: monthsAgo(1, 10), descricao: 'Aluguel parcial', categoriaId: 'moradia' },
  { id: 'a2', tipo: 'despesa', valor: 480, data: monthsAgo(1, 18), descricao: 'Supermercado', categoriaId: 'alimentacao' },
  { id: 'a3', tipo: 'despesa', valor: 1650, data: monthsAgo(2, 9), descricao: 'Mensalidade', categoriaId: 'educacao' },
  { id: 'a4', tipo: 'despesa', valor: 900, data: monthsAgo(3, 14), descricao: 'Supermercado', categoriaId: 'alimentacao' },
  { id: 'a5', tipo: 'despesa', valor: 1100, data: monthsAgo(4, 7), descricao: 'Contas da casa', categoriaId: 'contas' },
  { id: 'a6', tipo: 'despesa', valor: 760, data: monthsAgo(5, 21), descricao: 'Viagem', categoriaId: 'lazer' },
];
