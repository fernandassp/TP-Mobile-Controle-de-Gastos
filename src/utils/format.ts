import type { TipoLancamento } from '../types';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const NBSP = '\u00A0';

/** 1234.5 -> "R$ 1.234,50" (manual, para não depender de Intl no Hermes). */
export function formatBRL(value: number): string {
  const negative = value < 0;
  const [int, dec] = Math.abs(value).toFixed(2).split('.');
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negative ? '− ' : ''}R$${NBSP}${withDots},${dec}`;
}

/** Receita: "+ R$ 450,00". Despesa: "− R$ 86,40". */
export function formatSigned(tipo: TipoLancamento, value: number): string {
  return `${tipo === 'receita' ? '+' : '−'} ${formatBRL(Math.abs(value))}`;
}

export function monthName(date: Date): string {
  return MESES[date.getMonth()];
}

export function monthShort(date: Date): string {
  return MESES_CURTOS[date.getMonth()];
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** "Hoje", "Ontem" ou "12 de novembro". */
export function dayLabel(date: Date, now: Date = new Date()): string {
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (dayKey(date) === dayKey(now)) return 'Hoje';
  if (dayKey(date) === dayKey(yesterday)) return 'Ontem';
  return `${date.getDate()} de ${monthName(date)}`;
}

/** Remove acentos e caixa para a busca. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** Rótulo do período do resumo: "novembro", "outubro" ou "últimos 3 meses". */
export function intervaloLabel(periodo: 'este_mes' | 'mes_passado' | 'ultimos_3_meses', now: Date = new Date()): string {
  if (periodo === 'ultimos_3_meses') return 'últimos 3 meses';
  return monthName(periodo === 'este_mes' ? now : addMonths(now, -1));
}
