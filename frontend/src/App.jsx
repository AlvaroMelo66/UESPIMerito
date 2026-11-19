import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, formatUnits, isAddress, parseUnits } from "ethers";
import artifact from "./contracts/UESPIMerito.json";

const SEPOLIA = {
  chainId: "0xaa36a7",
  chainName: "Ethereum Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";

function compactAddress(value) {
  return value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "";
}

function friendlyError(error) {
  if (error?.code === 4001 || error?.code === "ACTION_REJECTED") return "Operacao rejeitada na carteira.";
  if (error?.code === -32002) return "A MetaMask ja possui uma solicitacao pendente.";
  const message = error?.shortMessage || error?.reason || error?.info?.error?.message || error?.message;
  if (!message) return "Nao foi possivel concluir a operacao.";
  if (message.includes("insufficient funds")) return "Saldo de ETH insuficiente para pagar o gas.";
  if (message.includes("AccessControlUnauthorizedAccount")) return "Esta conta nao possui a permissao necessaria.";
  if (message.includes("EnforcedPause")) return "O token esta pausado. Operacao temporariamente indisponivel.";
  return message.replace(/^execution reverted: /, "").slice(0, 220);
}

export default function App() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [balance, setBalance] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [paused, setPaused] = useState(false);
  const [roles, setRoles] = useState({ minter: false, pauser: false });
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [mintRecipient, setMintRecipient] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "Conecte sua carteira para comecar." });
  const [busy, setBusy] = useState(false);

  const hasContract = isAddress(CONTRACT_ADDRESS);
  const isSepolia = chainId === SEPOLIA.chainId;

  const getContext = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask nao encontrada. Instale a extensao para continuar.");
    if (!hasContract) throw new Error("Contrato ainda nao configurado. Defina VITE_CONTRACT_ADDRESS apos o deploy.");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer, contract: new Contract(CONTRACT_ADDRESS, artifact.abi, signer) };
  }, [hasContract]);

  const refresh = useCallback(async (selectedAccount = account) => {
    if (!selectedAccount || !isAddress(CONTRACT_ADDRESS) || !window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, artifact.abi, provider);
      const [rawBalance, rawSupply, isPaused, isMinter, isPauser] = await Promise.all([
        contract.balanceOf(selectedAccount),
        contract.totalSupply(),
        contract.paused(),
        contract.hasRole(MINTER_ROLE, selectedAccount),
        contract.hasRole(PAUSER_ROLE, selectedAccount),
      ]);
      setBalance(formatUnits(rawBalance, 18));
      setTotalSupply(formatUnits(rawSupply, 18));
      setPaused(isPaused);
      setRoles({ minter: isMinter, pauser: isPauser });
    } catch (error) {
      setStatus({ type: "error", message: friendlyError(error) });
    }
  }, [account]);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask nao encontrada. Instale a extensao para continuar.");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA.chainId }] });
    } catch (error) {
      if (error.code !== 4902) throw error;
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [SEPOLIA] });
    }
    setChainId(SEPOLIA.chainId);
  }, []);

  async function connectWallet() {
    setBusy(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask nao encontrada. Instale a extensao para continuar.");
      await switchToSepolia();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const selected = accounts[0];
      setAccount(selected);
      setChainId(await window.ethereum.request({ method: "eth_chainId" }));
      setStatus({ type: "success", message: hasContract ? "Carteira conectada na Sepolia." : "Carteira conectada. O endereco do contrato ainda precisa ser configurado." });
      await refresh(selected);
    } catch (error) {
      setStatus({ type: "error", message: friendlyError(error) });
    } finally {
      setBusy(false);
    }
  }

  async function submitTransaction(action, pendingMessage, successMessage) {
    setBusy(true);
    try {
      if (!isSepolia) await switchToSepolia();
      const { contract } = await getContext();
      const transaction = await action(contract);
      setStatus({ type: "pending", message: pendingMessage, hash: transaction.hash });
      await transaction.wait();
      setStatus({ type: "success", message: successMessage, hash: transaction.hash });
      await refresh();
      return true;
    } catch (error) {
      setStatus({ type: "error", message: friendlyError(error) });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function transfer(event) {
    event.preventDefault();
    if (!isAddress(recipient)) return setStatus({ type: "error", message: "Informe um endereco Ethereum valido." });
    if (!amount || Number(amount) <= 0) return setStatus({ type: "error", message: "Informe uma quantidade positiva." });
    const ok = await submitTransaction(
      (contract) => contract.transfer(recipient, parseUnits(amount, 18)),
      "Transferencia enviada. Aguardando confirmacao...",
      "Transferencia confirmada na Sepolia.",
    );
    if (ok) { setRecipient(""); setAmount(""); }
  }

  async function mint(event) {
    event.preventDefault();
    if (!isAddress(mintRecipient)) return setStatus({ type: "error", message: "Informe um beneficiario Ethereum valido." });
    if (!mintAmount || Number(mintAmount) <= 0) return setStatus({ type: "error", message: "Informe uma recompensa positiva." });
    const ok = await submitTransaction(
      (contract) => contract.mint(mintRecipient, parseUnits(mintAmount, 18)),
      "Emissao enviada. Aguardando confirmacao...",
      "Recompensa academica emitida com sucesso.",
    );
    if (ok) { setMintRecipient(""); setMintAmount(""); }
  }

  async function togglePause() {
    await submitTransaction(
      (contract) => paused ? contract.unpause() : contract.pause(),
      paused ? "Retomada enviada..." : "Pausa enviada...",
      paused ? "Operacoes do token retomadas." : "Token pausado com sucesso.",
    );
  }

  useEffect(() => {
    if (!window.ethereum) return undefined;
    const handleAccounts = (accounts) => {
      const selected = accounts[0] || "";
      setAccount(selected);
      if (selected) refresh(selected);
    };
    const handleChain = (nextChain) => { setChainId(nextChain); window.location.reload(); };
    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);
    Promise.all([
      window.ethereum.request({ method: "eth_accounts" }),
      window.ethereum.request({ method: "eth_chainId" }),
    ]).then(([accounts, currentChain]) => {
      setChainId(currentChain);
      if (accounts[0]) { setAccount(accounts[0]); refresh(accounts[0]); }
    }).catch(() => {});
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChain);
    };
  }, [refresh]);

  const displayedBalance = useMemo(() => Number(balance).toLocaleString("pt-BR", { maximumFractionDigits: 4 }), [balance]);
  const displayedSupply = useMemo(() => Number(totalSupply).toLocaleString("pt-BR", { maximumFractionDigits: 0 }), [totalSupply]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="topbar">
          <a className="brand" href="#inicio" aria-label="UESPIMérito - início">
            <img className="brand-crest" src="/brasao-uespi.webp" alt="Brasão da UESPI" />
            <span><strong>UESPI</strong>Mérito<small>Programa de recompensas acadêmicas</small></span>
          </a>
          <div className="institutional-signature">
            <span>Universidade pública</span>
            <strong>Conhecimento que transforma</strong>
          </div>
        </div>
        <div className="nav-strip">
          <div className="nav-inner">
            <span className="nav-context">Portal Web3 acadêmico</span>
            <div className="wallet-actions">
              {account && <span className={`network-pill ${isSepolia ? "online" : "offline"}`}>{isSepolia ? "Sepolia" : "Rede incorreta"}</span>}
              <button className="button button-primary" onClick={connectWallet} disabled={busy}>
                {account ? compactAddress(account) : "Conectar MetaMask"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="eyebrow"><span /> Mérito que circula</div>
          <h1>Reconhecimento acadêmico, registrado em blockchain.</h1>
          <p>UESPM transforma participação, pesquisa e excelência em uma recompensa digital transparente na Ethereum Sepolia.</p>
          <div className="hero-stats">
            <div><span>Oferta inicial</span><strong>1.000.000</strong><small>UESPM</small></div>
            <div><span>Limite absoluto</span><strong>1.250.000</strong><small>UESPM</small></div>
            <div><span>Padrao</span><strong>ERC-20</strong><small>OpenZeppelin</small></div>
          </div>
        </section>

        {!hasContract && (
          <div className="notice warning"><strong>Ambiente preparado, deploy pendente.</strong> Configure VITE_CONTRACT_ADDRESS somente depois de publicar o contrato com aprovacao.</div>
        )}

        <section className="dashboard" aria-label="Painel da carteira">
          <article className="card balance-card">
            <div className="card-heading"><span>Seu saldo</span><span className="token-chip">UESPM</span></div>
            <div className="balance-value">{account ? displayedBalance : "—"}</div>
            <p>{account ? compactAddress(account) : "Conecte sua carteira para consultar o saldo."}</p>
            <div className="supply-line"><span>Oferta em circulação</span><strong>{account && hasContract ? `${displayedSupply} UESPM` : "Aguardando conexão"}</strong></div>
          </article>

          <article className="card">
            <div className="card-heading"><div><span>Transferir tokens</span><p>Envie UESPM para outro endereço.</p></div></div>
            <form onSubmit={transfer}>
              <label>Endereço do destinatário<input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..." autoComplete="off" /></label>
              <label>Quantidade<div className="input-unit"><input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" inputMode="decimal" /><span>UESPM</span></div></label>
              <button className="button button-secondary" disabled={busy || !account}>Confirmar transferência</button>
            </form>
          </article>
        </section>

        <section className="status-panel" aria-live="polite">
          <span className={`status-icon ${status.type}`} />
          <div><strong>Status da operação</strong><p>{status.message}</p>
            {status.hash && <a href={`https://sepolia.etherscan.io/tx/${status.hash}`} target="_blank" rel="noreferrer">Ver transação no Etherscan</a>}
          </div>
        </section>

        {(roles.minter || roles.pauser) && (
          <section className="admin-section">
            <div className="section-title"><div className="eyebrow"><span /> Acesso autorizado</div><h2>Painel administrativo</h2><p>Controles protegidos por papeis on-chain.</p></div>
            <div className="admin-grid">
              {roles.minter && <article className="card"><div className="card-heading"><div><span>Emitir recompensa</span><p>Disponivel apenas para o papel MINTER_ROLE.</p></div></div><form onSubmit={mint}><label>Beneficiario<input value={mintRecipient} onChange={(e) => setMintRecipient(e.target.value)} placeholder="0x..." /></label><label>Quantidade<div className="input-unit"><input value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} placeholder="0,00" inputMode="decimal" /><span>UESPM</span></div></label><button className="button button-secondary" disabled={busy}>Emitir tokens</button></form></article>}
              {roles.pauser && <article className="card pause-card"><div><div className="card-heading"><div><span>Controle de emergencia</span><p>Interrompa transferencias, mint e burn em caso de incidente.</p></div></div><div className={`pause-state ${paused ? "paused" : "active"}`}><span />{paused ? "Token pausado" : "Operacoes ativas"}</div></div><button className={`button ${paused ? "button-secondary" : "button-danger"}`} onClick={togglePause} disabled={busy}>{paused ? "Retomar operacoes" : "Pausar token"}</button></article>}
            </div>
          </section>
        )}
      </main>

      <footer><span>UESPIMerito · Projeto academico UESPI</span><span>Ethereum Sepolia · Contrato {hasContract ? compactAddress(CONTRACT_ADDRESS) : "nao publicado"}</span></footer>
    </div>
  );
}
