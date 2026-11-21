import { v4 as uuid } from 'uuid';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import type { Categoria } from '../types';
import { criarTabela, NaoEncontradoError, type Observavel } from './memory';

export type DadosCategoria = Pick<Categoria, 'nome' | 'tipo' | 'cor' | 'icone'>;

export interface CategoriaRepository extends Observavel {
  listar(): Promise<Categoria[]>;
  obterPorId(id: string): Promise<Categoria | null>;
  criar(dados: DadosCategoria): Promise<Categoria>;
  atualizar(id: string, dados: DadosCategoria): Promise<Categoria>;
  excluir(id: string): Promise<void>;
}

function criarCategoriaRepositoryEmMemoria(): CategoriaRepository {
  const tabela = criarTabela<Categoria>(DEFAULT_CATEGORIES);

  const exigir = (id: string) => {
    const atual = tabela.obter(id);
    if (!atual) throw new NaoEncontradoError('Categoria', id);
    return atual;
  };

  return {
    observar: tabela.observar,
    listar: async () => tabela.todos(),
    obterPorId: async (id) => tabela.obter(id) ?? null,
    criar: async (dados) => tabela.inserir({ ...dados, id: uuid(), padrao: false }),
    atualizar: async (id, dados) => tabela.substituir({ ...exigir(id), ...dados }),
    excluir: async (id) => {
      tabela.substituir({ ...exigir(id), excluido: true });
    },
  };
}

export const categoriaRepository: CategoriaRepository = criarCategoriaRepositoryEmMemoria();
