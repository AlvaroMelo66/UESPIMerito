# Matriz de rastreabilidade - avaliação prática ERC-20

Fonte: leitura integral das cinco páginas de `3a_prova.pdf`. A coluna de estado separa implementação local de evidência on-chain, evitando declarar como concluído o que depende de deploy real.

| ID | Requisito da avaliação | Implementação ou evidência | Verificação | Estado |
|---|---|---|---|---|
| R01 | Criar token digital original | UESPIMérito: recompensa acadêmica por pesquisa, extensão, monitoria, eventos e desempenho | Contrato, README e relatório | Concluído localmente |
| R02 | Smart contract | `contracts/UESPIMerito.sol` | `npm run compile` | Concluído |
| R03 | Tokenomics | Oferta inicial, teto, utilidade e distribuição documentados | README e relatório, seção Tokenomics | Concluído |
| R04 | Deploy em blockchain | Contrato publicado na Sepolia pelo script Hardhat | `scripts/deploy.js` e recibo | Concluído |
| R05 | Integração Web3 | React, MetaMask, Sepolia e ethers.js | Build Vite e inspeção visual | Concluído localmente |
| R06 | Relatório técnico | PDF de oito páginas e fonte HTML | `output/pdf/Relatorio-Tecnico-UESPIMerito.pdf` | Concluído; evidências on-chain marcadas |
| R07 | Nome | `UESPIMérito` | Teste de metadados | Concluído |
| R08 | Símbolo | `UESPM` | Teste de metadados | Concluído |
| R09 | Supply total | `totalSupply()` explícito e compatível com ERC-20 | Testes de oferta inicial, mint e burn | Concluído |
| R10 | Transferência | `transfer(address,uint256)` explícito e compatível | Testes de transferência e saldo insuficiente | Concluído |
| R11 | Controle de saldo | `balanceOf(address)` explícito; armazenamento ERC-20 da OpenZeppelin | Testes de saldo | Concluído |
| R12 | `constructor` | Recebe administrador inicial, valida endereço e emite oferta inicial | Testes de implantação e endereço zero | Concluído |
| R13 | `mapping` | `academicRewardsMinted` registra emissões por beneficiário | Teste de mint e leitura pública | Concluído |
| R14 | `require` | Valida administrador, beneficiário e quantidade | Testes de reversão | Concluído |
| R15 | Funções públicas | `mint`, `pause`, `unpause`, `totalSupply`, `balanceOf`, `transfer` | ABI exportada e testes | Concluído |
| R16 | Pelo menos duas funcionalidades extras | Mint, burn e pause | Testes específicos; mint e pause/unpause validados na Sepolia | Concluído - três extras |
| R17 | Deploy real em testnet | Ethereum Sepolia, chain ID 11155111 | Bloco 12.169.999 | Concluído |
| R18 | Endereço do contrato | `0xe0b6a9d39C90C5DE7772Bf3c74753Faa487A10e8` | Etherscan e relatório | Concluído |
| R19 | Link Etherscan | Contrato com código-fonte verificado | Etherscan Sepolia | Concluído |
| R20 | Hash do deploy | `0x9716c1...8359d7` | Recibo e Etherscan | Concluído |
| R21 | Conectar MetaMask | `eth_requestAccounts` com detecção de ausência/rejeição | Frontend e tratamento de erro | Concluído localmente |
| R22 | Mostrar saldo | `balanceOf` e `formatUnits` | Dashboard | Concluído localmente |
| R23 | Transferir tokens | Formulário, validação, `parseUnits` e status | Dashboard e transação `0x9b35a4...f9d432` | Concluído on-chain |
| R24 | Tecnologia permitida | React | `frontend/package.json` | Concluído |
| R25 | Relatório: introdução | Objetivo e contexto do token | Relatório, página 2 | Concluído |
| R26 | Relatório: supply, utilidade e distribuição | Tokenomics detalhada | Relatório, página 2 | Concluído |
| R27 | Relatório: arquitetura | Frontend + contrato + blockchain | Relatório, página 3 | Concluído |
| R28 | Relatório: custos | Estratégia e campos de gas | Relatório, página 7 | Estrutura concluída; números reais pendentes |
| R29 | Relatório: testes, prints e evidências | Resultados locais reais e placeholders on-chain | Relatório, páginas 6 e 7 | Parcial por restrição de deploy |
| R30 | Máximo 10 páginas | Relatório projetado com oito páginas A4 | `pdfinfo` | Concluído |
| R31 | Vídeo de até 5 minutos | Roteiro cronometrado de 4min40s | `docs/ROTEIRO_VIDEO.md` | Roteiro concluído; gravação pendente |
| R32 | Estrutura com contratos, frontend, README e relatório | Diretórios e artefatos correspondentes | Árvore do projeto | Concluído |
| R33 | OpenZeppelin (bônus) | ERC20, Burnable, Capped, Pausable e AccessControl | Imports e lockfile | Concluído |
| R34 | Design moderno (bônus) | Interface responsiva, contraste alto e identidade visual | Build e render desktop/mobile | Concluído |
| R35 | Dashboard (bônus) | Saldo, supply, transferência, status e administração | Frontend | Concluído |
| R36 | Propósito real (bônus) | Recompensas acadêmicas auditáveis | Contrato e documentação | Concluído |
| R37 | Segurança (bônus) | Papéis, cap, pause, validações e testes negativos | Testes e bloqueio de transferência durante pausa na Sepolia | Concluído on-chain |
| R38 | Otimização de gas (bônus) | Otimizador Solidity, 200 execuções; constantes imutáveis no bytecode | `hardhat.config.js` | Concluído |
| R39 | Defesa oral opcional: arquitetura, deploy, MetaMask, transferências | Incorporado ao roteiro de vídeo | Roteiro | Preparado |
| R40 | Ferramentas permitidas | Hardhat, React, MetaMask; Solidity/OpenZeppelin/ethers/Vite complementares | Manifestos | Concluído |
| R41 | Entrega: código-fonte | Projeto completo no workspace | Arquivos do repositório | Concluído |
| R42 | Entrega: PDF | Relatório em `output/pdf` | Renderização e inspeção | Concluído |
| R43 | Entrega: link GitHub | `https://github.com/AlvaroMelo66/UESPIMerito` | Repositório público | Concluído |
| R44 | Entrega: link explorer | Contrato e transação disponíveis no Etherscan Sepolia | URLs no README | Concluído |
| R45 | Entrega: vídeo curto | Depende de gravação pelo aluno | Arquivo/link a fornecer | Pendente manual |

## Cobertura dos critérios de pontuação

| Critério | Valor | Cobertura atual |
|---|---:|---|
| Smart contract funcional | 3 | Implementado, compilado e testado localmente |
| Funcionalidades extras | 2 | Mint, burn e pause implementados e testados |
| Deploy real | 2 | Publicado e verificado na Ethereum Sepolia |
| Frontend Web3 | 2 | Implementado, compilado e validado com conexão, saldo e transferência on-chain |
| Relatório técnico | 1 | PDF com até 10 páginas e roteiro de vídeo preparados |

## Penalizações mitigadas

- Código original adaptado ao propósito acadêmico; não é cópia genérica sem adaptação.
- Frontend e relatório estão presentes.
- A penalização por ausência de deploy foi mitigada com publicação e verificação reais na Sepolia.
