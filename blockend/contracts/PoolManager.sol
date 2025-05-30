// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PoolManager is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public immutable token;
    address public contractOwner;

    struct DonationRecord {
        address donor;
        uint256 amount;
        uint256 timestamp;
        bool isDirect; // true if sent directly to contract, false if via donate function
    }

    struct DistributionRecord {
        address[] recipients;
        uint256[] amounts;
        uint256 timestamp;
        address distributor;
        uint256 totalAmount;
    }

    // State variables
    DonationRecord[] public donations;
    DistributionRecord[] public distributions;

    mapping(address => uint256) public totalDonatedByAddress;
    mapping(address => uint256[]) public donationIdsByAddress;

    uint256 public totalDonated;
    uint256 public totalDistributed;
    uint256 public currentBalance;

    // Events
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        bool isDirect,
        uint256 donationId
    );

    event FundsDistributed(
        address indexed distributor,
        uint256 totalAmount,
        uint256 recipientCount,
        uint256 timestamp,
        uint256 distributionId
    );

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // Modifiers
    modifier onlyOwner() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Only owner can call this function"
        );
        _;
    }

    modifier onlyOwnerOrAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(ADMIN_ROLE, msg.sender),
            "Only owner or admin can call this function"
        );
        _;
    }

    constructor(address _token) {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
        contractOwner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Donate function for users to send tokens to the contract
     * @param amount The amount of tokens to donate
     */
    function donate(uint256 amount) external nonReentrant {
        require(amount > 0, "Donation amount must be greater than 0");

        uint256 balanceBefore = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 balanceAfter = token.balanceOf(address(this));

        uint256 actualAmount = balanceAfter - balanceBefore;
        require(actualAmount > 0, "No tokens received");

        _recordDonation(msg.sender, actualAmount, false);
    }

    /**
     * @dev Distribute funds to multiple recipients
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts corresponding to each recipient
     */
    function distributeFunds(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwnerOrAdmin nonReentrant {
        require(recipients.length > 0, "Recipients array cannot be empty");
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 100, "Too many recipients (max 100)");

        uint256 totalAmount = 0;

        // Calculate total and validate amounts
        for (uint256 i = 0; i < amounts.length; i++) {
            require(amounts[i] > 0, "Amount must be greater than 0");
            require(
                recipients[i] != address(0),
                "Recipient cannot be zero address"
            );
            totalAmount += amounts[i];
        }

        require(
            totalAmount <= currentBalance,
            "Insufficient funds in contract"
        );

        // Perform transfers
        for (uint256 i = 0; i < recipients.length; i++) {
            token.safeTransfer(recipients[i], amounts[i]);
        }

        // Update state
        totalDistributed += totalAmount;
        currentBalance -= totalAmount;

        // Record distribution
        distributions.push(
            DistributionRecord({
                recipients: recipients,
                amounts: amounts,
                timestamp: block.timestamp,
                distributor: msg.sender,
                totalAmount: totalAmount
            })
        );

        emit FundsDistributed(
            msg.sender,
            totalAmount,
            recipients.length,
            block.timestamp,
            distributions.length - 1
        );
    }

    /**
     * @dev Add a new admin
     * @param admin Address to be granted admin role
     */
    function addAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Admin address cannot be zero");
        require(!hasRole(ADMIN_ROLE, admin), "Address is already an admin");

        _grantRole(ADMIN_ROLE, admin);
        emit AdminAdded(admin);
    }

    /**
     * @dev Remove an admin
     * @param admin Address to be removed from admin role
     */
    function removeAdmin(address admin) external onlyOwner {
        require(hasRole(ADMIN_ROLE, admin), "Address is not an admin");

        _revokeRole(ADMIN_ROLE, admin);
        emit AdminRemoved(admin);
    }

    /**
     * @dev Transfer ownership to a new owner
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        require(newOwner != msg.sender, "New owner cannot be current owner");

        address previousOwner = msg.sender;
        _revokeRole(DEFAULT_ADMIN_ROLE, previousOwner);
        _grantRole(DEFAULT_ADMIN_ROLE, newOwner);
        contractOwner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @dev Handle direct token transfers to the contract
     * This function will be called when tokens are sent directly to the contract
     */
    function handleDirectTransfer() external {
        uint256 contractBalance = token.balanceOf(address(this));
        if (contractBalance > currentBalance) {
            uint256 newDonation = contractBalance - currentBalance;
            _recordDonation(address(0), newDonation, true); // address(0) for unknown direct sender
        }
    }

    /**
     * @dev Internal function to record donations
     */
    function _recordDonation(
        address donor,
        uint256 amount,
        bool isDirect
    ) internal {
        donations.push(
            DonationRecord({
                donor: donor,
                amount: amount,
                timestamp: block.timestamp,
                isDirect: isDirect
            })
        );

        uint256 donationId = donations.length - 1;

        if (donor != address(0)) {
            totalDonatedByAddress[donor] += amount;
            donationIdsByAddress[donor].push(donationId);
        }

        totalDonated += amount;
        currentBalance += amount;

        emit DonationReceived(
            donor,
            amount,
            block.timestamp,
            isDirect,
            donationId
        );
    }

    // Getter functions

    /**
     * @dev Get total number of donations
     */
    function getTotalDonations() external view returns (uint256) {
        return donations.length;
    }

    /**
     * @dev Get total number of distributions
     */
    function getTotalDistributions() external view returns (uint256) {
        return distributions.length;
    }

    /**
     * @dev Get donation details by ID
     */
    function getDonation(
        uint256 donationId
    )
        external
        view
        returns (
            address donor,
            uint256 amount,
            uint256 timestamp,
            bool isDirect
        )
    {
        require(donationId < donations.length, "Invalid donation ID");
        DonationRecord storage donation = donations[donationId];
        return (
            donation.donor,
            donation.amount,
            donation.timestamp,
            donation.isDirect
        );
    }

    /**
     * @dev Get distribution details by ID
     */
    function getDistribution(
        uint256 distributionId
    )
        external
        view
        returns (
            address[] memory recipients,
            uint256[] memory amounts,
            uint256 timestamp,
            address distributor,
            uint256 totalAmount
        )
    {
        require(
            distributionId < distributions.length,
            "Invalid distribution ID"
        );
        DistributionRecord storage distribution = distributions[distributionId];
        return (
            distribution.recipients,
            distribution.amounts,
            distribution.timestamp,
            distribution.distributor,
            distribution.totalAmount
        );
    }

    /**
     * @dev Get donation IDs for a specific address
     */
    function getDonationIdsByAddress(
        address donor
    ) external view returns (uint256[] memory) {
        return donationIdsByAddress[donor];
    }

    /**
     * @dev Get contract stats
     */
    function getContractStats()
        external
        view
        returns (
            uint256 _totalDonated,
            uint256 _totalDistributed,
            uint256 _currentBalance,
            uint256 _totalDonations,
            uint256 _totalDistributions
        )
    {
        return (
            totalDonated,
            totalDistributed,
            currentBalance,
            donations.length,
            distributions.length
        );
    }

    /**
     * @dev Check if address is admin
     */
    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    /**
     * @dev Check if address is owner
     */
    function isOwner(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    /**
     * @dev Get current owner
     */
    function owner() external view returns (address) {
        return contractOwner;
    }

    /**
     * @dev Emergency function to sync balance (in case of direct transfers)
     */
    function syncBalance() external {
        uint256 actualBalance = token.balanceOf(address(this));
        if (actualBalance > currentBalance) {
            uint256 difference = actualBalance - currentBalance;
            _recordDonation(address(0), difference, true);
        } else if (actualBalance < currentBalance) {
            // This should not happen in normal operation, but we handle it
            currentBalance = actualBalance;
        }
    }
}
