# Segurança e ameaças consideradas

## Controles implementados

| Risco | Controle |
|---|---|
| Emissão ilimitada | `ERC20Capped` com teto de 1.250.000 UESPM |
| Emissão por usuário comum | `onlyRole(MINTER_ROLE)` |
| Pausa por usuário comum | `onlyRole(PAUSER_ROLE)` |
| Administrador inválido | `require(initialAdmin != address(0))` |
| Recompensa inválida | Rejeição de endereço zero e quantidade zero |
| Operação durante incidente | `ERC20Pausable` bloqueia transfer, mint e burn |
| Saldo insuficiente | Erro padrão `ERC20InsufficientBalance` |
| Divergência de ABI | Exportação automática do artefato compilado |
| Rede errada | Troca/adição explícita da Sepolia no frontend |
| Erros opacos | Tratamento de rejeição, permissão, pausa e gas |
| Segredo no repositório | `.env` ignorado e modelos sem credenciais reais |

## Privilégios

No deploy, a conta recebe `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` e `PAUSER_ROLE`. Isso simplifica a avaliação, mas a operação madura deve separar funções:

- multisig institucional como administradora;
- carteira operacional limitada para emissão;
- carteira de resposta a incidentes para pausa;
- processo documentado de concessão, revogação e recuperação.

O administrador pode conceder e revogar papéis. Essa capacidade é intencional e deve ser protegida. Renunciar ao último administrador pode tornar a gestão impossível; o projeto não automatiza essa decisão.

## Limitações e riscos residuais

- Endereços são pseudônimos; não registrar dados pessoais on-chain.
- Uma carteira com papel comprometido pode agir até a revogação.
- A pausa depende de uma conta autorizada disponível.
- RPC público pode sofrer indisponibilidade ou limitação.
- O frontend não substitui auditoria independente.
- Testes locais não provam o comportamento de infraestrutura externa.
- `npm audit` encontrou 25 avisos transitivos na toolchain de desenvolvimento Hardhat/coverage (15 baixos, 8 moderados e 2 altos). O frontend apresentou 0. A correção completa sugerida exige `--force`, Hardhat 3 e alterações incompatíveis no coverage; as versões reproduzíveis e testadas foram preservadas. Não processar entradas não confiáveis com essa toolchain e reavaliar a migração antes de uso contínuo.

## Checklist antes do deploy

- Confirmar hash do código e lockfiles.
- Reexecutar compilação, testes, cobertura e build.
- Usar carteira exclusiva de Sepolia sem fundos de mainnet.
- Conferir chain ID `11155111` e saldo de teste.
- Registrar endereço do deployer e aprovação do responsável.
- Publicar, verificar no Etherscan e comparar bytecode.
- Fazer transferência de pequeno valor e registrar gas.
- Transferir administração para multisig se o projeto deixar o contexto didático.

Nunca informe frase-semente. Uma chave privada de teste, quando necessária, deve ficar apenas no `.env` local e ser descartada/rotacionada após a atividade.
