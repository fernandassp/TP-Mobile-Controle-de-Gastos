import 'react-native-get-random-values';

export type Listener = () => void;

export interface Observavel {
  observar(listener: Listener): () => void;
}

export interface TabelaEmMemoria<T extends { id: string }> extends Observavel {
  todos(): T[];
  obter(id: string): T | undefined;
  inserir(item: T): T;
  substituir(item: T): T;
  remover(id: string): void;
}

export function criarTabela<T extends { id: string }>(inicial: T[] = []): TabelaEmMemoria<T> {
  let itens = [...inicial];
  const listeners = new Set<Listener>();
  const avisar = () => listeners.forEach((l) => l());

  return {
    todos: () => itens,
    obter: (id) => itens.find((i) => i.id === id),
    inserir(item) {
      itens = [...itens, item];
      avisar();
      return item;
    },
    substituir(item) {
      itens = itens.map((i) => (i.id === item.id ? item : i));
      avisar();
      return item;
    },
    remover(id) {
      itens = itens.filter((i) => i.id !== id);
      avisar();
    },
    observar(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export class NaoEncontradoError extends Error {
  constructor(entidade: string, id: string) {
    super(`${entidade} ${id} não encontrado(a).`);
    this.name = 'NaoEncontradoError';
  }
}
