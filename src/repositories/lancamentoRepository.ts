import { v4 as uuid } from 'uuid';
import { MOCK_LANCAMENTOS } from '../constants/mockData';
import type { Lancamento, TipoLancamento } from '../types';
import { criarTabela, NaoEncontradoError, type Observavel } from './memory';

export interface LancamentoRegistro extends Lancamento {
  excluido?: boolean;
}

export type DadosLancamento = {
  tipo: TipoLancamento;
  valor: number;
  data: string;
  descricao: string;
  categoriaId: string;
};

export interface LancamentoRepository extends Observavel {
  listar(): Promise<Lancamento[]>;
  obterPorId(id: string): Promise<Lancamento | null>;
  criar(dados: DadosLancamento): Promise<Lancamento>;
  atualizar(id: string, dados: DadosLancamento): Promise<Lancamento>;
  excluir(id: string): Promise<void>;
}

function validarDadosLancamento(dados: DadosLancamento): void {
  if (dados.tipo !== 'receita' && dados.tipo !== 'despesa') {
    throw new Error('Tipo de lançamento inválido.');
  }
  if (!Number.isFinite(dados.valor) || dados.valor <= 0) {
    throw new Error('Informe um valor maior que zero.');
  }
  if (!dados.categoriaId || !dados.categoriaId.trim()) {
    throw new Error('Selecione uma categoria.');
  }
  if (!dados.data || Number.isNaN(Date.parse(dados.data))) {
    throw new Error('Data do lançamento inválida.');
  }
  if (!dados.descricao || !dados.descricao.trim()) {
    throw new Error('Informe uma descrição.');
  }
}

function criarLancamentoRepositoryEmMemoria(): LancamentoRepository {
  const tabela = criarTabela<LancamentoRegistro>(MOCK_LANCAMENTOS);

  const exigir = (id: string) => {
    const atual = tabela.obter(id);
    if (!atual || atual.excluido) {
      throw new NaoEncontradoError('Lançamento', id);
    }
    return atual;
  };

  return {
    observar: tabela.observar,
    listar: async () =>
      tabela
        .todos()
        .filter((item) => !item.excluido)
        .map(({ excluido: _excluido, ...lancamento }) => lancamento),
    obterPorId: async (id) => {
      const item = tabela.obter(id);
      if (!item || item.excluido) return null;
      const { excluido: _excluido, ...lancamento } = item;
      return lancamento;
    },
    criar: async (dados) => {
      validarDadosLancamento(dados);
      const novo: LancamentoRegistro = {
        id: uuid(),
        tipo: dados.tipo,
        valor: Number(dados.valor.toFixed(2)),
        data: dados.data,
        descricao: dados.descricao.trim(),
        categoriaId: dados.categoriaId,
        excluido: false,
      };
      tabela.inserir(novo);
      const { excluido: _excluido, ...lancamento } = novo;
      return lancamento;
    },
    atualizar: async (id, dados) => {
      validarDadosLancamento(dados);
      const atual = exigir(id);
      const atualizado: LancamentoRegistro = {
        ...atual,
        tipo: dados.tipo,
        valor: Number(dados.valor.toFixed(2)),
        data: dados.data,
        descricao: dados.descricao.trim(),
        categoriaId: dados.categoriaId,
      };
      tabela.substituir(atualizado);
      const { excluido: _excluido, ...lancamento } = atualizado;
      return lancamento;
    },
    excluir: async (id) => {
      const atual = exigir(id);
      tabela.substituir({ ...atual, excluido: true });
    },
  };
}

export const lancamentoRepository: LancamentoRepository = criarLancamentoRepositoryEmMemoria();