import type { Categoria, IconName, TipoLancamento } from '../../types';
import { normalize } from '../../utils/format';

export const NOME_MAX = 30;

export const CORES_CATEGORIA = [
  '#195967', '#32AFA7', '#72D0C4', '#A9BFBC', '#EC9A93',
  '#E4C078', '#91B99C', '#3D7457', '#B04A46', '#86651C',
];

export const ICONES_CATEGORIA: IconName[] = [
  'cart-outline', 'restaurant-outline', 'cafe-outline', 'car-outline', 'bus-outline',
  'airplane-outline', 'home-outline', 'flash-outline', 'phone-portrait-outline', 'heart-outline',
  'medkit-outline', 'barbell-outline', 'book-outline', 'school-outline', 'musical-notes-outline',
  'game-controller-outline', 'shirt-outline', 'gift-outline', 'paw-outline', 'pricetag-outline',
  'briefcase-outline', 'wallet-outline', 'cash-outline', 'trending-up-outline',
];

export interface ErrosCategoria {
  nome?: string;
}

export function temErros(erros: object): boolean {
  return Object.keys(erros).length > 0;
}

export function categoriasAtivas(lista: Categoria[], tipo?: TipoLancamento): Categoria[] {
  return lista.filter((c) => !c.excluido && (!tipo || c.tipo === tipo));
}

export function podeEditar(c: Categoria): boolean {
  return !c.padrao && !c.excluido;
}

export function validarCategoria(
  dados: { nome: string; tipo: TipoLancamento },
  existentes: Categoria[],
  idEditando?: string,
): ErrosCategoria {
  const nome = dados.nome.trim();
  if (!nome) return { nome: 'Informe um nome.' };
  if (nome.length > NOME_MAX) return { nome: `Use até ${NOME_MAX} caracteres.` };

  const repetido = categoriasAtivas(existentes, dados.tipo).some(
    (c) => c.id !== idEditando && normalize(c.nome) === normalize(nome),
  );
  if (repetido) return { nome: `Já existe uma categoria de ${dados.tipo} com esse nome.` };
  return {};
}
