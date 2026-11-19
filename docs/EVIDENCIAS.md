# Evidências e pendências

## Evidências locais obtidas

- [x] PDF da avaliação lido integralmente: 5 páginas A4.
- [x] Contrato compilado: 14 arquivos Solidity, compilador 0.8.28, EVM Paris.
- [x] Suíte Hardhat: 14 testes aprovados, 0 falhas.
- [x] Cobertura do contrato original: 100% statements, branches, functions e lines.
- [x] ABI exportada do artefato compilado.
- [x] Frontend: 177 módulos transformados e build de produção concluído.
- [x] Relatório: PDF renderizado e verificado, com no máximo 10 páginas.

## Evidências que devem permanecer como marcadores até existirem

- [x] Endereço Sepolia: `0xe0b6a9d39C90C5DE7772Bf3c74753Faa487A10e8`.
- [x] Hash do deploy: `0x9716c168aad414576bd09570efdb58e006a079ddb0be6e3e0e7b81d2018359d7`.
- [x] Etherscan: `https://sepolia.etherscan.io/address/0xe0b6a9d39C90C5DE7772Bf3c74753Faa487A10e8#code`.
- [x] Deploy: `7.450.016 gas`, `1 gwei`, custo `0,007450016 SepoliaETH`.
- [x] Transferência de `1 UESPM`: hash `0x9b35a41dd65190ab0113f9db1fc479555d7f579b0d96d4bee37b8f4b79f9d432`, bloco `12.170.133`, `143.183 gas`, custo `0,000214774502147745 SepoliaETH`.
- [x] Mint de `10 UESPM`: hash `0x68e1d5f8c6ec0ffdf1f56aa424b32a0dc2bcf525d570a7f28a45cf856617f06b`, bloco `12.170.854`, `159.737 gas`, custo `0,000239605502236318 SepoliaETH`.
- [x] Pause: hash `0xcf6b9c9df7b509a8544aeae88afee791d4990ef3906d86e95fc637ec1d89230b`, bloco `12.170.873`, `129.092 gas`, custo `0,000193638001807288 SepoliaETH`.
- [x] Transferência recusada durante a pausa; saldo do aluno permaneceu em `11 UESPM`.
- [x] Unpause: hash `0x934bbdb66562fc6ac2cc4fda2bf5632b54628a50b17a48d27adbf11586c6e5f7`, bloco `12.170.882`, `24.937 gas`, custo `0,000037405500349118 SepoliaETH`.
- [x] Estado final: oferta total `1.000.010 UESPM`, aluno `11 UESPM` e token não pausado.
- [ ] `[EVIDÊNCIA PENDENTE - PRINT DEPLOY]` Captura do contrato verificado.
- [x] Capturas da MetaMask em Sepolia com endereços abreviados e sem dados sensíveis: `docs/evidencias/admin-supply.png` e `docs/evidencias/saldo-aluno.png`.
- [x] Dashboard com saldos reais: administrador `999.999 UESPM`, aluno `11 UESPM` e supply `1.000.010 UESPM`.
- [ ] `[EVIDÊNCIA PENDENTE - PRINT TRANSFER]` Captura visual da transferência confirmada e hash (a evidência on-chain já foi obtida).
- [ ] `[EVIDÊNCIA PENDENTE - VÍDEO]` Link/arquivo da gravação de até cinco minutos.
- [x] GitHub público: `https://github.com/AlvaroMelo66/UESPIMerito`.

## Procedimento para completar

1. Registrar capturas sem expor saldo sensível, chave ou frase-semente.
2. Regenerar o relatório com a evidência on-chain da transferência.
3. Gravar o vídeo usando `docs/ROTEIRO_VIDEO.md`.
