// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title UESPIMerito
/// @notice Token de recompensas por atividades e conquistas academicas da UESPI.
contract UESPIMerito is ERC20, ERC20Burnable, ERC20Capped, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 public constant MAX_SUPPLY = 1_250_000 * 10 ** 18;

    /// @dev Registro auditavel do total de recompensas emitidas para cada participante.
    mapping(address account => uint256 amount) public academicRewardsMinted;

    event AcademicRewardMinted(address indexed beneficiary, uint256 amount, address indexed operator);

    constructor(address initialAdmin) ERC20("UESPIMerito", "UESPM") ERC20Capped(MAX_SUPPLY) {
        require(initialAdmin != address(0), "UESPM: administrador invalido");

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
        _grantRole(PAUSER_ROLE, initialAdmin);
        _mint(initialAdmin, INITIAL_SUPPLY);
    }

    /// @notice Emite recompensas sem ultrapassar o limite maximo de 1.250.000 UESPM.
    function mint(address beneficiary, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(beneficiary != address(0), "UESPM: beneficiario invalido");
        require(amount > 0, "UESPM: quantidade deve ser positiva");

        academicRewardsMinted[beneficiary] += amount;
        _mint(beneficiary, amount);
        emit AcademicRewardMinted(beneficiary, amount, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Overrides explicitos preservam as assinaturas minimas solicitadas pela avaliacao.
    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        return super.transfer(to, value);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
