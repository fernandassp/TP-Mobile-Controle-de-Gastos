import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Mesmos valores do campo `tipo` do DER (LANCAMENTO e CATEGORIA). */
export type TipoLancamento = 'receita' | 'despesa';

/** Entidade CATEGORIA do DER. */
export interface Categoria {
  id: string;
  nome: string;
  tipo: TipoLancamento;
  cor: string;
  icone: IconName;
  padrao: boolean;
  excluido?: boolean;
}

export type MesReferencia = string;

export interface Orcamento {
  id: string;
  categoriaId: string;
  mesReferencia: MesReferencia;
  valorLimite: number;
  percentualAlerta: number;
  excluido?: boolean;
}

export type StatusOrcamento = 'ok' | 'atencao' | 'estourado';

export type NivelAlerta = 'alerta' | 'limite';

export interface Alerta {
  id: string;
  orcamentoId: string;
  nivel: NivelAlerta;
  dataHora: string;
  percentualAtingido: number;
  mensagem: string;
  lido: boolean;
}

/** Entidade LANCAMENTO do DER (valor em reais; data em ISO 8601). */
export interface Lancamento {
  id: string;
  tipo: TipoLancamento;
  valor: number;
  data: string;
  descricao: string;
  categoriaId: string;
}
