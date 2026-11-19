# Arquitetura

## Visão geral

```text
MetaMask
   │ assinatura e conta
   ▼
React + Vite + ethers.js
   │ JSON-RPC / ABI
   ▼
Ethereum Sepolia
   │
   ▼
UESPIMerito.sol
   ├── ERC20
   ├── ERC20Capped
   ├── ERC20Burnable
   ├── ERC20Pausable
   └── AccessControl
```

O navegador nunca recebe a chave privada pelo projeto. A MetaMask mantém a custódia e apresenta cada assinatura ao usuário. O frontend lê dados por um provider e envia transações por um signer somente após ação explícita.

## Contrato

- `ERC20` oferece a interface e semântica padrão.
- `ERC20Capped` impede que `totalSupply` ultrapasse 1.250.000 UESPM.
- `ERC20Burnable` permite ao titular reduzir a própria participação.
- `ERC20Pausable` centraliza o bloqueio emergencial em `_update`.
- `AccessControl` separa administração, emissão e pausa.
- `academicRewardsMinted` registra o total emitido diretamente como recompensa para cada endereço.

## Frontend

`App.jsx` concentra o fluxo da demonstração acadêmica: conexão, troca/adição da Sepolia, leitura paralela de saldo/supply/estado/papéis, transferência, mint e pause. Mensagens de erro conhecidas são convertidas em texto amigável. Mudanças de conta e rede são observadas por eventos da MetaMask.

O endereço do contrato entra por `VITE_CONTRACT_ADDRESS`, evitando endereço fictício no código. A ABI é exportada do artefato Hardhat por `scripts/export-abi.js`, reduzindo divergência entre contrato e interface.

## Fluxos principais

1. Usuário conecta a MetaMask.
2. O frontend solicita Sepolia e lê a conta selecionada.
3. Saldo, supply, pausa e papéis são consultados.
4. Uma transferência é validada no cliente e assinada na carteira.
5. O hash é exibido durante a confirmação e vira link do Etherscan.
6. Controles administrativos aparecem somente se o contrato confirmar os papéis da conta.

## Decisões

- Não há backend: a demonstração interage diretamente com RPC público/configurado.
- Não há upgrade: o comportamento é simples e auditável.
- Não há preço, venda ou conversão: UESPM representa reconhecimento, não investimento.
- Sepolia é a única rede pretendida nesta entrega.
