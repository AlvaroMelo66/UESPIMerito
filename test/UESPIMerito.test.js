const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UESPIMerito", function () {
  async function deployFixture() {
    const [admin, student, other] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("UESPIMerito");
    const token = await Token.deploy(admin.address);
    await token.waitForDeployment();
    return { token, admin, student, other };
  }

  it("configura nome, simbolo, 18 decimais e oferta inicial", async function () {
    const { token, admin } = await deployFixture();
    const initial = ethers.parseEther("1000000");
    expect(await token.name()).to.equal("UESPIMerito");
    expect(await token.symbol()).to.equal("UESPM");
    expect(await token.decimals()).to.equal(18);
    expect(await token.totalSupply()).to.equal(initial);
    expect(await token.balanceOf(admin.address)).to.equal(initial);
  });

  it("rejeita administrador zero", async function () {
    const Token = await ethers.getContractFactory("UESPIMerito");
    await expect(Token.deploy(ethers.ZeroAddress)).to.be.revertedWith("UESPM: administrador invalido");
  });

  it("atribui os tres papeis ao administrador", async function () {
    const { token, admin } = await deployFixture();
    expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
    expect(await token.hasRole(await token.MINTER_ROLE(), admin.address)).to.equal(true);
    expect(await token.hasRole(await token.PAUSER_ROLE(), admin.address)).to.equal(true);
  });

  it("transfere tokens e atualiza saldos", async function () {
    const { token, admin, student } = await deployFixture();
    const amount = ethers.parseEther("125");
    await expect(token.transfer(student.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(admin.address, student.address, amount);
    expect(await token.balanceOf(student.address)).to.equal(amount);
  });

  it("rejeita transferencia acima do saldo", async function () {
    const { token, student, other } = await deployFixture();
    await expect(token.connect(student).transfer(other.address, 1n))
      .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("permite mint autorizado e registra recompensa", async function () {
    const { token, admin, student } = await deployFixture();
    const amount = ethers.parseEther("1000");
    await expect(token.mint(student.address, amount))
      .to.emit(token, "AcademicRewardMinted")
      .withArgs(student.address, amount, admin.address);
    expect(await token.balanceOf(student.address)).to.equal(amount);
    expect(await token.academicRewardsMinted(student.address)).to.equal(amount);
  });

  it("impede mint por conta sem MINTER_ROLE", async function () {
    const { token, student } = await deployFixture();
    await expect(token.connect(student).mint(student.address, 1n))
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
  });

  it("rejeita mint zero e beneficiario zero", async function () {
    const { token, student } = await deployFixture();
    await expect(token.mint(student.address, 0n)).to.be.revertedWith("UESPM: quantidade deve ser positiva");
    await expect(token.mint(ethers.ZeroAddress, 1n)).to.be.revertedWith("UESPM: beneficiario invalido");
  });

  it("respeita o teto de 1.250.000 UESPM", async function () {
    const { token, student } = await deployFixture();
    await token.mint(student.address, ethers.parseEther("250000"));
    expect(await token.totalSupply()).to.equal(await token.MAX_SUPPLY());
    await expect(token.mint(student.address, 1n)).to.be.revertedWithCustomError(token, "ERC20ExceededCap");
  });

  it("permite que titular queime os proprios tokens", async function () {
    const { token, student } = await deployFixture();
    const amount = ethers.parseEther("25");
    await token.transfer(student.address, amount);
    await expect(token.connect(student).burn(amount)).to.changeTokenBalance(token, student, -amount);
    expect(await token.totalSupply()).to.equal(ethers.parseEther("999975"));
  });

  it("pause bloqueia transferencia, mint e burn", async function () {
    const { token, admin, student } = await deployFixture();
    await token.transfer(student.address, 10n);
    await token.pause();
    await expect(token.transfer(student.address, 1n)).to.be.revertedWithCustomError(token, "EnforcedPause");
    await expect(token.mint(student.address, 1n)).to.be.revertedWithCustomError(token, "EnforcedPause");
    await expect(token.connect(student).burn(1n)).to.be.revertedWithCustomError(token, "EnforcedPause");
    expect(await token.balanceOf(admin.address)).to.be.greaterThan(0n);
  });

  it("unpause restaura operacoes", async function () {
    const { token, student } = await deployFixture();
    await token.pause();
    await token.unpause();
    await expect(token.transfer(student.address, 1n)).to.emit(token, "Transfer");
  });

  it("impede pause e unpause sem PAUSER_ROLE", async function () {
    const { token, student } = await deployFixture();
    await expect(token.connect(student).pause()).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
    await token.pause();
    await expect(token.connect(student).unpause()).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
  });

  it("administrador pode conceder e revogar papel de emissor", async function () {
    const { token, student } = await deployFixture();
    const role = await token.MINTER_ROLE();
    await token.grantRole(role, student.address);
    await expect(token.connect(student).mint(student.address, 2n)).to.emit(token, "AcademicRewardMinted");
    await token.revokeRole(role, student.address);
    await expect(token.connect(student).mint(student.address, 1n))
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
  });
});
