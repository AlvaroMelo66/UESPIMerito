# UESPIMérito (UESPM)

Token ERC-20 de recompensas acadêmicas para reconhecer participação em pesquisa, extensão, monitoria, eventos e desempenho na UESPI. O projeto combina um contrato Solidity com controles por papéis, uma interface React para MetaMask e documentação de implantação na Ethereum Sepolia.

> Estado: contrato publicado e verificado na Ethereum Sepolia, com implementação, testes, cobertura, build do frontend e transferência de demonstração concluídos. Capturas finais, GitHub e vídeo permanecem pendentes.

## Recursos

- Nome `UESPIMérito`, símbolo `UESPM` e 18 casas decimais.
- Oferta inicial de `1.000.000 UESPM` e teto imutável de `1.250.000 UESPM`.
- Compatibilidade ERC-20 baseada em OpenZeppelin.
- `mint` restrito a `MINTER_ROLE`, com registro por beneficiário.
- `burn` e `burnFrom` por `ERC20Burnable`.
- `pause` e `unpause` restritos a `PAUSER_ROLE`.
- Administração de papéis via `DEFAULT_ADMIN_ROLE`.
- Dashboard React responsivo com MetaMask, Sepolia, saldo, transferência, status e painel administrativo.
- Testes de funcionalidade e segurança com cobertura integral do contrato original.

## Estrutura

```text
UESPIMerito/
├── contracts/                 # contrato Solidity
├── test/                      # testes Hardhat
├── scripts/                   # deploy, verificação, exportação da ABI e relatório
├── frontend/                  # aplicação React + Vite + ethers.js
├── docs/                      # documentação acadêmica e operacional
├── output/pdf/                # relatório técnico final
├── deployments/               # registros locais de deploy (ignorados, salvo .gitkeep)
├── hardhat.config.js
├── .env.example
└── package.json
```

## Requisitos locais

- Node.js 22 LTS ou superior compatível.
- npm 10 ou superior.
- MetaMask somente para a etapa manual posterior.
- ETH Sepolia de faucet somente para o deploy autorizado.

Este workspace inclui uma cópia portátil do Node em `.tools/`, ignorada pelo Git, usada apenas porque Node não estava disponível globalmente no ambiente de execução.

## Instalação

```bash
npm install
npm --prefix frontend install
```

Copie os modelos de ambiente:

```bash
copy .env.example .env
copy frontend\.env.example frontend\.env
```

Nunca publique `.env`, chave privada ou frase-semente. Use uma carteira de teste dedicada, sem ativos de mainnet. O projeto nunca precisa da frase-semente.

## Compilação, testes e cobertura

```bash
npm run compile
npm test
npm run test:coverage
```

Resultados obtidos nesta entrega:

- Compilação: 14 arquivos Solidity compilados com sucesso, alvo EVM Paris.
- Testes: 14 aprovados, 0 falhas.
- Cobertura de `contracts/UESPIMerito.sol`: 100% statements, branches, functions e lines.
- Auditoria npm do frontend: 0 vulnerabilidades.
- Auditoria npm da toolchain: 25 avisos transitivos em dependências de desenvolvimento (15 baixos, 8 moderados e 2 altos). A correção completa exige mudanças incompatíveis; não foi usado `--force`.

Os testes cobrem metadados, oferta inicial, papéis, transferências, saldo insuficiente, mint autorizado e não autorizado, entradas inválidas, teto, burn, pause, unpause, bloqueio durante pausa e concessão/revogação de papel.

## Frontend local

Exporte novamente a ABI após alterações no contrato e inicie o Vite:

```bash
npm run abi:export
npm run frontend:dev
```

Build de produção:

```bash
npm run frontend:build
```

Antes do deploy, o frontend exibe corretamente o aviso de contrato não configurado. Depois do deploy, informe o endereço em `frontend/.env`:

```dotenv
VITE_CONTRACT_ADDRESS=0x...
```

Recompile o frontend após alterar essa variável.

## Deploy na Sepolia

- Contrato: `0xe0b6a9d39C90C5DE7772Bf3c74753Faa487A10e8`
- Hash: `0x9716c168aad414576bd09570efdb58e006a079ddb0be6e3e0e7b81d2018359d7`
- Bloco: `12.169.999`
- Gas usado: `7.450.016`
- Custo: `0,007450016 SepoliaETH`
- [Código verificado no Etherscan](https://sepolia.etherscan.io/address/0xe0b6a9d39C90C5DE7772Bf3c74753Faa487A10e8#code)

### Transferência de demonstração

- Quantidade: `1 UESPM`
- Hash: `0x9b35a41dd65190ab0113f9db1fc479555d7f579b0d96d4bee37b8f4b79f9d432`
- Bloco: `12.170.133`
- Gas usado: `143.183`
- Preço efetivo do gas: `1,500000015 gwei`
- Custo: `0,000214774502147745 SepoliaETH`
- Resultado: saldo do aluno `1 UESPM`; saldo do administrador `999.999 UESPM`
- [Transação no Etherscan](https://sepolia.etherscan.io/tx/0x9b35a41dd65190ab0113f9db1fc479555d7f579b0d96d4bee37b8f4b79f9d432)

### Validação administrativa on-chain

- Mint de `10 UESPM`: `0x68e1d5f8c6ec0ffdf1f56aa424b32a0dc2bcf525d570a7f28a45cf856617f06b` (bloco `12.170.854`).
- Pause: `0xcf6b9c9df7b509a8544aeae88afee791d4990ef3906d86e95fc637ec1d89230b` (bloco `12.170.873`).
- Durante a pausa, uma transferência foi corretamente recusada antes do envio.
- Unpause: `0x934bbdb66562fc6ac2cc4fda2bf5632b54628a50b17a48d27adbf11586c6e5f7` (bloco `12.170.882`).
- Estado final validado: aluno com `11 UESPM`, oferta total de `1.000.010 UESPM` e operações ativas.

Para reproduzir outro deploy autorizado:

1. Crie uma carteira exclusiva de teste na MetaMask e obtenha ETH Sepolia de um faucet confiável.
2. Preencha `.env` a partir do modelo, sem compartilhar a chave.
3. Verifique saldo, rede e endereço do deployer.
4. Execute somente após aprovação:

   ```bash
   npm run deploy:sepolia
   ```

5. Confira `deployments/sepolia.json`, copie o endereço para `frontend/.env` e valide-o no Etherscan.
6. Verifique o código-fonte:

   ```bash
   npm run verify:sepolia
   ```

7. Refaça `npm run frontend:build` e registre as evidências definidas em [docs/EVIDENCIAS.md](docs/EVIDENCIAS.md).

O script de deploy usa o endereço do signatário como administrador inicial e grava rede, chain ID, endereço, hash, bloco e argumentos do construtor. O script de verificação lê exatamente esse registro.

## Modelo de segurança

- O teto é imposto por `ERC20Capped` inclusive sobre futuras emissões.
- A pausa afeta transferências, mint e burn por meio do único ponto de atualização `_update`.
- Privilégios são separados em papéis de emissão, pausa e administração.
- Transferências preservam o comportamento ERC-20 padrão.
- O mapeamento `academicRewardsMinted` cria trilha de recompensas emitidas, sem alterar saldos.
- Não há upgrade, taxa oculta, blacklist, custódia de ETH nem função para retirar fundos.

Para produção, recomenda-se transferir o papel de administrador a uma multisig, separar os papéis operacionais, monitorar eventos e testar todo novo release. Veja [docs/SEGURANCA.md](docs/SEGURANCA.md).

## Documentação acadêmica

- [Matriz de rastreabilidade](docs/MATRIZ_RASTREABILIDADE.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Segurança](docs/SEGURANCA.md)
- [Evidências e pendências](docs/EVIDENCIAS.md)
- [Roteiro de vídeo](docs/ROTEIRO_VIDEO.md)
- [Comandos executados](docs/COMANDOS_EXECUTADOS.md)
- [Fonte editável do relatório](docs/relatorio-tecnico.html)
- [Relatório técnico em PDF](output/pdf/Relatorio-Tecnico-UESPIMerito.pdf)

## Licença

Contrato sob licença MIT. Projeto acadêmico, sem promessa de valor financeiro e sem recomendação de investimento.
