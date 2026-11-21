import { useEffect, useState } from 'react';
import type { Observavel } from '../repositories/memory';

export function useObservado<T>(fonte: Observavel, carregar: () => Promise<T>, inicial: T) {
  const [dados, setDados] = useState<T>(inicial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    const recarregar = () => {
      carregar().then((d) => {
        if (!ativo) return;
        setDados(d);
        setLoading(false);
      });
    };
    recarregar();
    const parar = fonte.observar(recarregar);
    return () => {
      ativo = false;
      parar();
    };
  }, [fonte, carregar]);

  return { dados, loading };
}
