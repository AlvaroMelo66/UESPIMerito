# Registro de comandos e resultados

Registro reproduzível da preparação realizada em 19/11/2026. Caminhos do Node portátil são específicos deste ambiente; em uma máquina com Node instalado, use diretamente `npm`/`npx`.

| Comando ou operação equivalente | Resultado |
|---|---|
| `pdfinfo 3a_prova.pdf` | 5 páginas A4, PDF 1.7, sem criptografia |
| `pdftotext -layout -enc UTF-8 3a_prova.pdf ...` | Texto integral extraído |
| `pdftoppm -png -r 120 3a_prova.pdf ...` | 5 páginas renderizadas e inspecionadas |
| instalador de dependências do Sites / `npm install` | Primeira tentativa falhou por conflito Chai 5 × matcher; manifesto corrigido para Chai 4 |
| `npm install` (raiz) | Dependências Hardhat/OpenZeppelin instaladas |
| `npm --prefix frontend install` | Dependências React/Vite/ethers instaladas; 0 vulnerabilidades reportadas nessa execução |
| `npm run compile` | 14 arquivos Solidity compilados com sucesso |
| `npm run abi:export` | ABI real exportada ao frontend |
| `npm test` | 14 testes aprovados em aproximadamente 2 segundos |
| `npm run test:coverage` | 100% statements, branches, functions e lines |
| primeiro `vite build` | Falhou porque o carregador esbuild tentou ler diretório pai bloqueado pelo sandbox |
| `vite build --configLoader runner` | Build concluído; 177 módulos transformados |
| build após divisão de chunks | `index` 240,77 kB; `ethers` 261,34 kB; sem alerta de chunk |
| preview local | HTTP 200 em `http://127.0.0.1:4173/` |
| `npm audit` no frontend | 0 vulnerabilidades |
| `npm audit` na raiz | 25 avisos transitivos da toolchain de desenvolvimento; 2 altos; correção exige mudanças quebradoras |
| `npm audit fix` sem `--force` | Nenhuma correção compatível disponível; versões testadas preservadas |

## Comandos que não foram executados

- qualquer mint, burn ou pause em rede pública
- publicação do frontend
- push para GitHub

Essas ações exigem decisão/credenciais do usuário ou representam publicação externa e permanecem manuais.

## Operações Sepolia autorizadas posteriormente

| Comando | Resultado |
|---|---|
| `npm run deploy:sepolia` | Contrato criado no bloco 12.169.999; gas 7.450.016; custo 0,007450016 SepoliaETH |
| `npm run verify:sepolia` | Código-fonte verificado publicamente no Etherscan |
| Transferência assinada pelo usuário via frontend/MetaMask | `1 UESPM` no bloco 12.170.133; gas 143.183; custo 0,000214774502147745 SepoliaETH |
| Mint assinado pelo usuário via frontend/MetaMask | `10 UESPM` no bloco 12.170.854; gas 159.737; custo 0,000239605502236318 SepoliaETH |
| Pause assinado pelo usuário via frontend/MetaMask | Bloco 12.170.873; gas 129.092; custo 0,000193638001807288 SepoliaETH |
| Tentativa de transferência durante pausa | Recusada antes do envio; nenhum token movimentado |
| Unpause assinado pelo usuário via frontend/MetaMask | Bloco 12.170.882; gas 24.937; custo 0,000037405500349118 SepoliaETH |
