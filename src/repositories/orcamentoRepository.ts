import { v4 as uuid } from 'uuid';
import type { MesReferencia, Orcamento } from '../types';
import { criarTabela, NaoEncontradoError, type Observavel } from './memory';

export type DadosOrcamento = Pick<Orcamento, 'categoriaId' | 'mesReferencia' | 'valorLimite' | 'percentualAlerta'>;

export interface OrcamentoRepository extends Observavel {
  listar(mes?: MesReferencia): Promise<Orcamento[]>;
  obterPorId(id: string): Promise<Orcamento | null>;
  criar(dados: DadosOrcamento): Promise<Orcamento>;
  atualizar(id: string, dados: DadosOrcamento): Promise<Orcamento>;
  excluir(id: string): Promise<void>;
}

function criarOrcamentoRepositoryEmMemoria(): OrcamentoRepository {
  const tabela = criarTabela<Orcamento>();

  const exigir = (id: string) => {
    const atual = tabela.obter(id);
    if (!atual || atual.excluido) throw new NaoEncontradoError('Orçamento', id);
    return atual;
  };

  return {
    observar: tabela.observar,
    listar: async (mes) => tabela.todos().filter((o) => !o.excluido && (!mes || o.mesReferencia === mes)),
    obterPorId: async (id) => {
      const o = tabela.obter(id);
      return o && !o.excluido ? o : null;
    },
    criar: async (dados) => tabela.inserir({ ...dados, id: uuid() }),
    atualizar: async (id, dados) => tabela.substituir({ ...exigir(id), ...dados }),
    excluir: async (id) => {
      tabela.substituir({ ...exigir(id), excluido: true });
    },
  };
}

export const orcamentoRepository: OrcamentoRepository = criarOrcamentoRepositoryEmMemoria();
