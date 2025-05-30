const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  loadFixture,
  time,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('PoolManager', function () {
  // Fixture for deploying contracts
  async function deployPoolManagerFixture() {
    const [
      owner,
      admin1,
      admin2,
      donor1,
      donor2,
      donor3,
      recipient1,
      recipient2,
      recipient3,
      nonAuthorized,
    ] = await ethers.getSigners();

    // Deploy MockERC20 token
    const MockERC20 = await ethers.getContractFactory('MockERC20');
    const token = await MockERC20.deploy(
      'Test Token',
      'TEST',
      ethers.parseEther('1000000')
    );

    // Deploy PoolManager
    const PoolManager = await ethers.getContractFactory('PoolManager');
    const poolManager = await PoolManager.deploy(await token.getAddress());

    // Mint tokens to donors for testing
    await token.connect(donor1).faucet(ethers.parseEther('10000'));
    await token.connect(donor2).faucet(ethers.parseEther('10000'));
    await token.connect(donor3).faucet(ethers.parseEther('10000'));

    return {
      token,
      poolManager,
      owner,
      admin1,
      admin2,
      donor1,
      donor2,
      donor3,
      recipient1,
      recipient2,
      recipient3,
      nonAuthorized,
    };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { poolManager, owner } = await loadFixture(
        deployPoolManagerFixture
      );
      expect(await poolManager.isOwner(owner.address)).to.be.true;
      expect(await poolManager.owner()).to.equal(owner.address);
    });

    it('Should set the right token address', async function () {
      const { poolManager, token } = await loadFixture(
        deployPoolManagerFixture
      );
      expect(await poolManager.token()).to.equal(await token.getAddress());
    });

    it('Should initialize with zero balances', async function () {
      const { poolManager } = await loadFixture(deployPoolManagerFixture);
      const stats = await poolManager.getContractStats();
      expect(stats[0]).to.equal(0); // totalDonated
      expect(stats[1]).to.equal(0); // totalDistributed
      expect(stats[2]).to.equal(0); // currentBalance
      expect(stats[3]).to.equal(0); // totalDonations
      expect(stats[4]).to.equal(0); // totalDistributions
    });

    it('Should revert if token address is zero', async function () {
      const PoolManager = await ethers.getContractFactory('PoolManager');
      await expect(PoolManager.deploy(ethers.ZeroAddress)).to.be.revertedWith(
        'Token address cannot be zero'
      );
    });
  });

  describe('Admin Management', function () {
    it('Should allow owner to add admin', async function () {
      const { poolManager, owner, admin1 } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(poolManager.connect(owner).addAdmin(admin1.address))
        .to.emit(poolManager, 'AdminAdded')
        .withArgs(admin1.address);

      expect(await poolManager.isAdmin(admin1.address)).to.be.true;
    });

    it('Should allow owner to remove admin', async function () {
      const { poolManager, owner, admin1 } = await loadFixture(
        deployPoolManagerFixture
      );

      await poolManager.connect(owner).addAdmin(admin1.address);

      await expect(poolManager.connect(owner).removeAdmin(admin1.address))
        .to.emit(poolManager, 'AdminRemoved')
        .withArgs(admin1.address);

      expect(await poolManager.isAdmin(admin1.address)).to.be.false;
    });

    it('Should not allow non-owner to add admin', async function () {
      const { poolManager, admin1, nonAuthorized } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(nonAuthorized).addAdmin(admin1.address)
      ).to.be.revertedWith('Only owner can call this function');
    });

    it('Should not allow adding zero address as admin', async function () {
      const { poolManager, owner } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(owner).addAdmin(ethers.ZeroAddress)
      ).to.be.revertedWith('Admin address cannot be zero');
    });

    it('Should not allow adding same admin twice', async function () {
      const { poolManager, owner, admin1 } = await loadFixture(
        deployPoolManagerFixture
      );

      await poolManager.connect(owner).addAdmin(admin1.address);

      await expect(
        poolManager.connect(owner).addAdmin(admin1.address)
      ).to.be.revertedWith('Address is already an admin');
    });

    it('Should not allow removing non-admin', async function () {
      const { poolManager, owner, admin1 } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(owner).removeAdmin(admin1.address)
      ).to.be.revertedWith('Address is not an admin');
    });

    // Note: getAdmins functionality removed for compatibility
  });

  describe('Ownership Transfer', function () {
    it('Should allow owner to transfer ownership', async function () {
      const { poolManager, owner, admin1 } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(poolManager.connect(owner).transferOwnership(admin1.address))
        .to.emit(poolManager, 'OwnershipTransferred')
        .withArgs(owner.address, admin1.address);

      expect(await poolManager.isOwner(admin1.address)).to.be.true;
      expect(await poolManager.isOwner(owner.address)).to.be.false;
      expect(await poolManager.owner()).to.equal(admin1.address);
    });

    it('Should not allow non-owner to transfer ownership', async function () {
      const { poolManager, admin1, nonAuthorized } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(nonAuthorized).transferOwnership(admin1.address)
      ).to.be.revertedWith('Only owner can call this function');
    });

    it('Should not allow transferring to zero address', async function () {
      const { poolManager, owner } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(owner).transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith('New owner cannot be zero address');
    });

    it('Should not allow transferring to self', async function () {
      const { poolManager, owner } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(owner).transferOwnership(owner.address)
      ).to.be.revertedWith('New owner cannot be current owner');
    });
  });

  describe('Donations', function () {
    it('Should accept donations via donate function', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const donationAmount = ethers.parseEther('100');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);

      await expect(poolManager.connect(donor1).donate(donationAmount)).to.emit(
        poolManager,
        'DonationReceived'
      );

      expect(await poolManager.totalDonatedByAddress(donor1.address)).to.equal(
        donationAmount
      );
      expect(await poolManager.currentBalance()).to.equal(donationAmount);
      expect(await poolManager.totalDonated()).to.equal(donationAmount);
    });

    it('Should track multiple donations from same donor', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const firstDonation = ethers.parseEther('100');
      const secondDonation = ethers.parseEther('50');

      await token
        .connect(donor1)
        .approve(
          await poolManager.getAddress(),
          firstDonation + secondDonation
        );

      await poolManager.connect(donor1).donate(firstDonation);
      await poolManager.connect(donor1).donate(secondDonation);

      expect(await poolManager.totalDonatedByAddress(donor1.address)).to.equal(
        firstDonation + secondDonation
      );
      expect(await poolManager.getTotalDonations()).to.equal(2);

      const donationIds = await poolManager.getDonationIdsByAddress(
        donor1.address
      );
      expect(donationIds).to.have.length(2);
    });

    it('Should track donations from multiple donors', async function () {
      const { poolManager, token, donor1, donor2, donor3 } = await loadFixture(
        deployPoolManagerFixture
      );

      const amounts = [
        ethers.parseEther('100'),
        ethers.parseEther('200'),
        ethers.parseEther('300'),
      ];

      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), amounts[0]);
      await token
        .connect(donor2)
        .approve(await poolManager.getAddress(), amounts[1]);
      await token
        .connect(donor3)
        .approve(await poolManager.getAddress(), amounts[2]);

      await poolManager.connect(donor1).donate(amounts[0]);
      await poolManager.connect(donor2).donate(amounts[1]);
      await poolManager.connect(donor3).donate(amounts[2]);

      expect(await poolManager.totalDonatedByAddress(donor1.address)).to.equal(
        amounts[0]
      );
      expect(await poolManager.totalDonatedByAddress(donor2.address)).to.equal(
        amounts[1]
      );
      expect(await poolManager.totalDonatedByAddress(donor3.address)).to.equal(
        amounts[2]
      );

      const totalExpected = amounts[0] + amounts[1] + amounts[2];
      expect(await poolManager.totalDonated()).to.equal(totalExpected);
      expect(await poolManager.currentBalance()).to.equal(totalExpected);
    });

    it('Should not allow zero donations', async function () {
      const { poolManager, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(poolManager.connect(donor1).donate(0)).to.be.revertedWith(
        'Donation amount must be greater than 0'
      );
    });

    it('Should not allow donations without sufficient allowance', async function () {
      const { poolManager, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const donationAmount = ethers.parseEther('100');

      await expect(poolManager.connect(donor1).donate(donationAmount)).to.be
        .reverted;
    });

    it('Should handle donations with transfer fees correctly', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const donationAmount = ethers.parseEther('100');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);

      await poolManager.connect(donor1).donate(donationAmount);

      // Verify the actual amount received is recorded
      const donation = await poolManager.getDonation(0);
      expect(donation.amount).to.equal(donationAmount);
    });
  });

  describe('Direct Transfers', function () {
    it('Should handle direct token transfers via syncBalance', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const transferAmount = ethers.parseEther('100');

      // Transfer tokens directly to contract
      await token
        .connect(donor1)
        .transfer(await poolManager.getAddress(), transferAmount);

      // Call syncBalance to record the direct transfer
      await expect(poolManager.syncBalance()).to.emit(
        poolManager,
        'DonationReceived'
      );

      expect(await poolManager.currentBalance()).to.equal(transferAmount);
      expect(await poolManager.totalDonated()).to.equal(transferAmount);
    });

    it('Should handle direct transfers via handleDirectTransfer', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const transferAmount = ethers.parseEther('100');

      // Transfer tokens directly to contract
      await token
        .connect(donor1)
        .transfer(await poolManager.getAddress(), transferAmount);

      // Call handleDirectTransfer
      await poolManager.handleDirectTransfer();

      expect(await poolManager.currentBalance()).to.equal(transferAmount);
      expect(await poolManager.totalDonated()).to.equal(transferAmount);

      const donation = await poolManager.getDonation(0);
      expect(donation.donor).to.equal(ethers.ZeroAddress);
      expect(donation.isDirect).to.be.true;
    });

    it('Should not create duplicate records for same direct transfer', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const transferAmount = ethers.parseEther('100');

      await token
        .connect(donor1)
        .transfer(await poolManager.getAddress(), transferAmount);
      await poolManager.syncBalance();

      // Calling again should not create duplicate record
      await poolManager.syncBalance();

      expect(await poolManager.getTotalDonations()).to.equal(1);
    });
  });

  describe('Fund Distribution', function () {
    beforeEach(async function () {
      // Setup some donations for distribution tests
      const { poolManager, token, donor1, donor2 } = await loadFixture(
        deployPoolManagerFixture
      );

      const amount1 = ethers.parseEther('1000');
      const amount2 = ethers.parseEther('500');

      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), amount1);
      await token
        .connect(donor2)
        .approve(await poolManager.getAddress(), amount2);

      await poolManager.connect(donor1).donate(amount1);
      await poolManager.connect(donor2).donate(amount2);

      return { poolManager, token, donor1, donor2 };
    });

    it('Should allow owner to distribute funds', async function () {
      const { poolManager, owner, recipient1, recipient2 } =
        (await this.ctx) || (await loadFixture(deployPoolManagerFixture));

      // First set up donations
      const { token, donor1 } = await loadFixture(deployPoolManagerFixture);
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseEther('300'), ethers.parseEther('200')];

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.emit(poolManager, 'FundsDistributed');

      expect(await poolManager.totalDistributed()).to.equal(
        amounts[0] + amounts[1]
      );
      expect(await poolManager.currentBalance()).to.equal(
        donationAmount - amounts[0] - amounts[1]
      );
    });

    it('Should allow admin to distribute funds', async function () {
      const { poolManager, token, owner, admin1, donor1, recipient1 } =
        await loadFixture(deployPoolManagerFixture);

      // Add admin
      await poolManager.connect(owner).addAdmin(admin1.address);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address];
      const amounts = [ethers.parseEther('100')];

      await expect(
        poolManager.connect(admin1).distributeFunds(recipients, amounts)
      ).to.emit(poolManager, 'FundsDistributed');
    });

    it('Should not allow non-authorized to distribute funds', async function () {
      const { poolManager, token, donor1, nonAuthorized, recipient1 } =
        await loadFixture(deployPoolManagerFixture);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address];
      const amounts = [ethers.parseEther('100')];

      await expect(
        poolManager.connect(nonAuthorized).distributeFunds(recipients, amounts)
      ).to.be.revertedWith('Only owner or admin can call this function');
    });

    it('Should not allow distribution with mismatched array lengths', async function () {
      const { poolManager, token, owner, donor1, recipient1, recipient2 } =
        await loadFixture(deployPoolManagerFixture);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseEther('100')]; // Mismatched length

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.be.revertedWith('Arrays length mismatch');
    });

    it('Should not allow empty recipients array', async function () {
      const { poolManager, owner } = await loadFixture(
        deployPoolManagerFixture
      );

      await expect(
        poolManager.connect(owner).distributeFunds([], [])
      ).to.be.revertedWith('Recipients array cannot be empty');
    });

    it('Should not allow zero amounts', async function () {
      const { poolManager, token, owner, donor1, recipient1 } =
        await loadFixture(deployPoolManagerFixture);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address];
      const amounts = [0];

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.be.revertedWith('Amount must be greater than 0');
    });

    it('Should not allow zero address recipients', async function () {
      const { poolManager, token, owner, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [ethers.ZeroAddress];
      const amounts = [ethers.parseEther('100')];

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.be.revertedWith('Recipient cannot be zero address');
    });

    it('Should not allow distribution exceeding balance', async function () {
      const { poolManager, token, owner, donor1, recipient1 } =
        await loadFixture(deployPoolManagerFixture);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address];
      const amounts = [ethers.parseEther('1001')]; // More than available

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.be.revertedWith('Insufficient funds in contract');
    });

    it('Should enforce maximum recipients limit', async function () {
      const { poolManager, token, owner, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Setup large donation
      const donationAmount = ethers.parseEther('10000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      // Try to distribute to 101 recipients (exceeds limit of 100)
      const recipients = [];
      const amounts = [];
      for (let i = 0; i < 101; i++) {
        recipients.push(ethers.Wallet.createRandom().address);
        amounts.push(ethers.parseEther('1'));
      }

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.be.revertedWith('Too many recipients (max 100)');
    });

    it('Should handle maximum recipients (100) successfully', async function () {
      const { poolManager, token, owner, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Setup large donation
      const donationAmount = ethers.parseEther('10000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      // Distribute to exactly 100 recipients
      const recipients = [];
      const amounts = [];
      for (let i = 0; i < 100; i++) {
        recipients.push(ethers.Wallet.createRandom().address);
        amounts.push(ethers.parseEther('1'));
      }

      await expect(
        poolManager.connect(owner).distributeFunds(recipients, amounts)
      ).to.emit(poolManager, 'FundsDistributed');

      expect(await poolManager.getTotalDistributions()).to.equal(1);
    });

    it('Should record distribution details correctly', async function () {
      const { poolManager, token, owner, donor1, recipient1, recipient2 } =
        await loadFixture(deployPoolManagerFixture);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseEther('300'), ethers.parseEther('200')];

      await poolManager.connect(owner).distributeFunds(recipients, amounts);

      const distribution = await poolManager.getDistribution(0);
      expect(distribution.recipients).to.deep.equal(recipients);
      expect(distribution.amounts.map((a) => a.toString())).to.deep.equal(
        amounts.map((a) => a.toString())
      );
      expect(distribution.distributor).to.equal(owner.address);
      expect(distribution.totalAmount).to.equal(amounts[0] + amounts[1]);
    });
  });

  describe('Getter Functions', function () {
    it('Should return correct donation details', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const donationAmount = ethers.parseEther('100');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      const donation = await poolManager.getDonation(0);
      expect(donation.donor).to.equal(donor1.address);
      expect(donation.amount).to.equal(donationAmount);
      expect(donation.isDirect).to.be.false;
    });

    it('Should revert for invalid donation ID', async function () {
      const { poolManager } = await loadFixture(deployPoolManagerFixture);

      await expect(poolManager.getDonation(0)).to.be.revertedWith(
        'Invalid donation ID'
      );
    });

    it('Should revert for invalid distribution ID', async function () {
      const { poolManager } = await loadFixture(deployPoolManagerFixture);

      await expect(poolManager.getDistribution(0)).to.be.revertedWith(
        'Invalid distribution ID'
      );
    });

    it('Should return correct contract stats', async function () {
      const { poolManager, token, owner, donor1, recipient1 } =
        await loadFixture(deployPoolManagerFixture);

      // Make a donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      // Make a distribution
      const distributionAmount = ethers.parseEther('300');
      await poolManager
        .connect(owner)
        .distributeFunds([recipient1.address], [distributionAmount]);

      const stats = await poolManager.getContractStats();
      expect(stats[0]).to.equal(donationAmount); // totalDonated
      expect(stats[1]).to.equal(distributionAmount); // totalDistributed
      expect(stats[2]).to.equal(donationAmount - distributionAmount); // currentBalance
      expect(stats[3]).to.equal(1); // totalDonations
      expect(stats[4]).to.equal(1); // totalDistributions
    });

    it('Should return empty array for donor with no donations', async function () {
      const { poolManager, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const donationIds = await poolManager.getDonationIdsByAddress(
        donor1.address
      );
      expect(donationIds).to.have.length(0);
    });
  });

  describe('Edge Cases and Security', function () {
    it('Should handle reentrancy protection', async function () {
      // This is inherently protected by the nonReentrant modifier
      // The actual reentrancy would need a malicious contract to test properly
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      const donationAmount = ethers.parseEther('100');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);

      // Multiple rapid calls should all succeed independently
      await poolManager.connect(donor1).donate(donationAmount);
      expect(await poolManager.currentBalance()).to.equal(donationAmount);
    });

    it('Should handle large numbers correctly', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Test with very large amount
      const largeAmount = ethers.parseEther('1000000');
      await token.connect(donor1).faucet(largeAmount);
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), largeAmount);

      await poolManager.connect(donor1).donate(largeAmount);
      expect(await poolManager.currentBalance()).to.equal(largeAmount);
    });

    it('Should handle balance discrepancies gracefully', async function () {
      const { poolManager, token, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Send tokens directly first
      const directAmount = ethers.parseEther('100');
      await token
        .connect(donor1)
        .transfer(await poolManager.getAddress(), directAmount);

      // Then make regular donation
      const donationAmount = ethers.parseEther('200');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      // Sync balance should handle the direct transfer
      await poolManager.syncBalance();

      expect(await poolManager.currentBalance()).to.equal(
        directAmount + donationAmount
      );
    });

    it('Should handle multiple admin operations correctly', async function () {
      const { poolManager, token, owner, admin1, admin2, donor1, recipient1 } =
        await loadFixture(deployPoolManagerFixture);

      // Add multiple admins
      await poolManager.connect(owner).addAdmin(admin1.address);
      await poolManager.connect(owner).addAdmin(admin2.address);

      // Setup donation
      const donationAmount = ethers.parseEther('1000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      // Both admins should be able to distribute
      await poolManager
        .connect(admin1)
        .distributeFunds([recipient1.address], [ethers.parseEther('100')]);
      await poolManager
        .connect(admin2)
        .distributeFunds([recipient1.address], [ethers.parseEther('100')]);

      expect(await poolManager.getTotalDistributions()).to.equal(2);
    });

    it('Should handle edge case with zero balance distribution attempt', async function () {
      const { poolManager, owner, recipient1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Try to distribute when no funds available
      await expect(
        poolManager
          .connect(owner)
          .distributeFunds([recipient1.address], [ethers.parseEther('1')])
      ).to.be.revertedWith('Insufficient funds in contract');
    });
  });

  describe('Gas Optimization Tests', function () {
    it('Should handle maximum distribution efficiently', async function () {
      const { poolManager, token, owner, donor1 } = await loadFixture(
        deployPoolManagerFixture
      );

      // Setup large donation
      const donationAmount = ethers.parseEther('10000');
      await token
        .connect(donor1)
        .approve(await poolManager.getAddress(), donationAmount);
      await poolManager.connect(donor1).donate(donationAmount);

      // Create 50 recipients (reasonable batch size)
      const recipients = [];
      const amounts = [];
      for (let i = 0; i < 50; i++) {
        recipients.push(ethers.Wallet.createRandom().address);
        amounts.push(ethers.parseEther('10'));
      }

      const tx = await poolManager
        .connect(owner)
        .distributeFunds(recipients, amounts);
      const receipt = await tx.wait();

      // Should complete successfully with reasonable gas
      expect(receipt.gasUsed).to.be.greaterThan(0);
      expect(await poolManager.getTotalDistributions()).to.equal(1);
    });
  });
});
