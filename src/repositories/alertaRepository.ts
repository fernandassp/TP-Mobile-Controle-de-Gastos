import { v4 as uuid } from 'uuid';
import type { Alerta } from '../types';
import { criarTabela, type Observavel } from './memory';

export type DadosAlerta = Omit<Alerta, 'id' | 'lido'>;

export interface AlertaRepository extends Observavel {
  listar(): Promise<Alerta[]>;
  criarSeNaoExistir(dados: DadosAlerta): Promise<Alerta | null>;
  marcarComoLido(id: string): Promise<void>;
  marcarTodosComoLidos(): Promise<void>;
}

function criarAlertaRepositoryEmMemoria(): AlertaRepository {
  const tabela = criarTabela<Alerta>();

  return {
    observar: tabela.observar,
    listar: async () => [...tabela.todos()].sort((a, b) => b.dataHora.localeCompare(a.dataHora)),
    criarSeNaoExistir: async (dados) => {
      const existe = tabela.todos().some((a) => a.orcamentoId === dados.orcamentoId && a.nivel === dados.nivel);
      return existe ? null : tabela.inserir({ ...dados, id: uuid(), lido: false });
    },
    marcarComoLido: async (id) => {
      const atual = tabela.obter(id);
      if (atual && !atual.lido) tabela.substituir({ ...atual, lido: true });
    },
    marcarTodosComoLidos: async () => {
      for (const a of tabela.todos()) if (!a.lido) tabela.substituir({ ...a, lido: true });
    },
  };
}

export const alertaRepository: AlertaRepository = criarAlertaRepositoryEmMemoria();
