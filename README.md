# App de Controle de Gastos

Aplicativo mobile de controle de gastos pessoais, desenvolvido como trabalho da disciplina de Desenvolvimento Mobile da PUC Minas.

Permite registrar receitas e despesas, organizar por categorias, definir orçamentos mensais e receber alertas ao se aproximar do limite.

## Tecnologias

- [Expo](https://expo.dev) SDK 58 com [Expo Router](https://docs.expo.dev/router/introduction/) (rotas em `src/app/`)
- React Native e TypeScript
- SQLite (`expo-sqlite`) para armazenamento local e Firebase (Authentication e Cloud Firestore) para sincronização

> Estado atual: os lançamentos usam dados de exemplo e categorias, orçamentos e alertas ficam em memória. A persistência em SQLite e a integração com o Firebase ainda estão em desenvolvimento.

## Pré-requisitos

- [Node.js](https://nodejs.org) 22 (a versão está no arquivo `.nvmrc`)
- [Git](https://git-scm.com)
- Para testar no celular: o app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)), em uma versão compatível com o SDK 58
- Opcional: [Docker](https://www.docker.com) para rodar a versão web sem instalar o Node

Se você usa o [nvm](https://github.com/nvm-sh/nvm) (ou o [nvm-windows](https://github.com/coreybutler/nvm-windows)), selecione a versão certa do Node com:

```bash
nvm use
```

No nvm-windows, use `nvm install 22` e `nvm use 22`.

## Como rodar

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/fernandassp/TP-Mobile-Controle-de-Gastos.git
   cd TP-Mobile-Controle-de-Gastos
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npx expo start
   ```

4. Abra o app:
   - **Celular:** com o Expo Go instalado, leia o QR Code exibido no terminal. O celular e o computador precisam estar na mesma rede Wi-Fi. Se a rede bloquear a conexão (comum em redes da faculdade), use `npx expo start --tunnel`.
   - **Emulador Android:** com o emulador aberto, pressione `a` no terminal.
   - **Simulador iOS (somente macOS):** pressione `i` no terminal.
   - **Navegador:** pressione `w` no terminal ou rode `npx expo start --web`.

Se o app não abrir depois de trocar de branch ou atualizar dependências, limpe o cache:

```bash
npx expo start -c
```

## Versão web com Docker

Para ver a versão web sem instalar o Node (por exemplo, em uma apresentação):

```bash
docker build -t controle-gastos .
docker run -p 3000:3000 controle-gastos
```

Depois acesse <http://localhost:3000>.

O Docker serve apenas a versão web. Para desenvolver, use o passo a passo de [Como rodar](#como-rodar).

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx tsc --noEmit` | Verifica os tipos (TypeScript) |
| `npx expo lint` | Roda o lint. Na primeira vez, cria a configuração do ESLint e instala as dependências necessárias |
| `npx expo install <pacote>` | Instala um pacote na versão compatível com o SDK. Use no lugar de `npm install <pacote>` |
| `npx expo-doctor` | Verifica problemas de configuração e de versões das dependências |

Antes de abrir um pull request, rode o typecheck e o lint.

## Estrutura de pastas

```
src/
├── app/            Rotas (cada arquivo é uma tela; _layout.tsx define a navegação)
│   └── orcamentos/ Aba Orçamentos (lista e alertas)
├── components/     Componentes reutilizáveis (botões, inputs, toast, estados vazios)
├── constants/      Categorias padrão, dados de exemplo e constantes de tema
├── features/       Regras e componentes de cada funcionalidade
├── hooks/          Hooks de acesso aos dados usados pelas telas
├── repositories/   Leitura e escrita dos dados
├── screens/        Telas
├── theme/          Cores, fontes e espaçamentos
├── types/          Tipos das entidades
└── utils/          Funções auxiliares (formatação de valores e datas)
```

A documentação do projeto (requisitos, arquitetura e modelo de dados) fica na pasta `Docs/`, fora deste repositório.

## Problemas comuns

- **O Expo Go diz que o projeto é incompatível:** atualize o Expo Go para uma versão que suporte o SDK 58.
- **O celular não encontra o servidor:** confira se está na mesma rede Wi-Fi ou use `npx expo start --tunnel`.
- **O VS Code mostra erros de tipo que o `npx tsc --noEmit` não mostra:** rode `npm install` e depois o comando "TypeScript: Restart TS Server" (`Ctrl+Shift+P`).

## Equipe

- Ana Giulia Ferreira de Abreu
- Fernanda Soares Santos Paiva
- Gabriela de Souza Konig
- Miguel Oliveira Faria
- Sther Marinho Brito
