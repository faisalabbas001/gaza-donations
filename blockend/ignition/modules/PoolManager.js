const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('PoolManagerModule', (m) => {
  // Deploy Mock ERC20 token first
  const mockToken = m.contract('MockERC20', [
    'Test Token', // name
    'TEST', // symbol
    '1000000000000000000000000', // 1,000,000 tokens with 18 decimals
  ]);

  // Deploy PoolManager with the mock token address
  const poolManager = m.contract('PoolManager', [mockToken]);

  return { mockToken, poolManager };
});
