# Roteiro de demonstração - duração alvo 4min40s

## 0:00-0:25 - Abertura

“Este é o UESPIMérito, ou UESPM, um token ERC-20 criado para recompensar atividades acadêmicas como pesquisa, extensão, monitoria, eventos e desempenho. Ele não representa investimento financeiro.”

Mostrar capa do relatório e rapidamente a estrutura do projeto.

## 0:25-1:15 - Contrato e tokenomics

Abrir `contracts/UESPIMerito.sol` e destacar:

- nome e símbolo;
- oferta inicial de 1 milhão;
- teto de 1,25 milhão;
- `mapping`, `constructor` e `require`;
- herança OpenZeppelin;
- papéis de mint e pausa;
- burn disponível ao titular.

## 1:15-1:50 - Segurança e testes

Executar ou mostrar o resultado de `npm test` e da cobertura. Explicar que foram testadas transferências, permissões, teto, burn, pause e entradas inválidas. Mostrar “14 passing” e “100%” sem cortar o contexto do terminal.

## 1:50-2:30 - Deploy Sepolia

> Só gravar esta parte depois do deploy autorizado.

Mostrar a MetaMask em Sepolia, ocultando informações sensíveis. Exibir no Etherscan:

- endereço `[EVIDÊNCIA PENDENTE - ENDEREÇO]`;
- hash `[EVIDÊNCIA PENDENTE - HASH]`;
- código verificado;
- supply e eventos.

Nunca mostrar `.env`, chave privada ou frase-semente.

## 2:30-3:45 - Frontend Web3

Abrir o dashboard:

1. conectar MetaMask;
2. confirmar rede Sepolia;
3. mostrar saldo UESPM;
4. transferir uma pequena quantidade para outra carteira de teste;
5. mostrar status pendente, confirmação e link Etherscan;
6. com conta autorizada, demonstrar mint;
7. pausar e explicar o bloqueio; retomar as operações.

Evitar esperas longas: deixar abas prontas e usar cortes apenas entre confirmações, sem ocultar resultados.

## 3:45-4:20 - Arquitetura e custos

Mostrar o diagrama do relatório e explicar MetaMask → React/ethers → Sepolia → contrato. Apresentar gas real do deploy e da transferência após preencher os marcadores.

## 4:20-4:40 - Encerramento

“O UESPIMérito atende ao padrão ERC-20 e adiciona emissão controlada, queima, pausa, teto de supply e uma interface Web3 responsiva. O código, o relatório e as evidências estão organizados no repositório.”

## Checklist de gravação

- Duração máxima de 5:00.
- Resolução legível, zoom do editor adequado e áudio claro.
- MetaMask na Sepolia; nunca revelar segredo.
- Endereço, hash e links coincidem com o relatório.
- Mostrar transação realmente confirmada, não simulação.
