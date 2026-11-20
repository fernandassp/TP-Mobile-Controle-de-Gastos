import type { Categoria } from '../types';

/** Categorias padrão (RF04). Quem fizer o SQLite pode usar esta lista no seed inicial. */
export const DEFAULT_CATEGORIES: Categoria[] = [
  { id: 'alimentacao', nome: 'Alimentação', tipo: 'despesa', cor: '#195967', icone: 'cart-outline', padrao: true },
  { id: 'transporte', nome: 'Transporte', tipo: 'despesa', cor: '#32AFA7', icone: 'car-outline', padrao: true },
  { id: 'lazer', nome: 'Lazer', tipo: 'despesa', cor: '#72D0C4', icone: 'musical-notes-outline', padrao: true },
  { id: 'contas', nome: 'Contas', tipo: 'despesa', cor: '#C9EBE4', icone: 'flash-outline', padrao: true },
  { id: 'moradia', nome: 'Moradia', tipo: 'despesa', cor: '#A9BFBC', icone: 'home-outline', padrao: true },
  { id: 'saude', nome: 'Saúde', tipo: 'despesa', cor: '#EC9A93', icone: 'heart-outline', padrao: true },
  { id: 'educacao', nome: 'Educação', tipo: 'despesa', cor: '#E4C078', icone: 'book-outline', padrao: true },
  { id: 'pets', nome: 'Pets', tipo: 'despesa', cor: '#91B99C', icone: 'paw-outline', padrao: true },
  { id: 'salario', nome: 'Salário', tipo: 'receita', cor: '#3D7457', icone: 'briefcase-outline', padrao: true },
  { id: 'renda-extra', nome: 'Renda extra', tipo: 'receita', cor: '#3D7457', icone: 'wallet-outline', padrao: true },
];
