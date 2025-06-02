import React, { createContext, useContext } from 'react';
import { useAccount } from 'wagmi';
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';

import {
  poolManagerAddress,
  poolManagerAbi,
  tokenAddress,
  tokenAbi,
} from './constants';
import { parseEther, formatEther } from 'viem';
import { config } from './config';

// Create the context
const ContractContext = createContext();

// Provider component
export const ContractProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  // const { data: client } = useClient();
  async function getApproval(amount) {
    try {
      let allowance = await readContract(config, {
        abi: tokenAbi,
        address: tokenAddress,
        functionName: 'allowance',
        args: [address, poolManagerAddress],
      });
      console.log('allowance', allowance);
      if (allowance < parseEther(amount.toString())) {
        const { request, result } = await simulateContract(config, {
          abi: tokenAbi,
          address: tokenAddress,
          functionName: 'approve',
          args: [poolManagerAddress, parseEther(amount.toString())],
        });
        const hash = await writeContract(config, request);
        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        });
        console.log('contract hash', transactionReceipt);
        return {
          success: true,
          message: 'Approval granted',
          tx: hash,
        };
      } else if (allowance > parseEther(amount.toString())) {
        return {
          success: true,
          message: 'Approval already granted',
          tx: allowance,
        };
      }
    } catch (error) {
      console.error('Error getting approval:', error);
      return {
        success: false,
        error: 'Error getting approval',
      };
    }
  }

  async function donate(amount) {
    try {
      const approval = await getApproval(amount);
      if (!approval.success) {
        return {
          success: false,
          error: 'Error while approving',
        };
      }
      const { request, result } = await simulateContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'donate',
        args: [parseEther(amount.toString())],
      });

      const hash = await writeContract(config, request);
      const transactionReceipt = await waitForTransactionReceipt(config, {
        // confirmations: 2,
        hash: hash,
      });
      console.log('contract hash', transactionReceipt);
      return {
        success: true,
        tx: hash,
      };
    } catch (error) {
      console.error('Error donating:', error);
      return {
        success: false,
        error: 'Error donating',
      };
    }
  }

  async function getDonation(donationId) {
    try {
      const donations = await readContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'getDonation',
        args: [donationId],
      });
      return {
        success: true,
        donations: donations,
      };
    } catch (error) {
      console.error('Error getting donations:', error);
      return {
        success: true,
        error: 'Error getting donations',
      };
    }
  }

  async function getTotalDonations() {
    try {
      const totalDonations = await readContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'getTotalDonations',
      });
      console.log('totalDonations', totalDonations);
      return {
        success: true,
        totalDonations: totalDonations,
      };
    } catch (error) {
      console.error('Error getting total donations:', error);
      return {
        success: false,
        error: 'Error getting total donations',
      };
    }
  }

  async function getTotalDistributions() {
    try {
      const totalDistributions = await readContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'getTotalDistributions',
      });
      console.log('totalDistributions', totalDistributions);
      return {
        success: true,
        totalDistributions: totalDistributions,
      };
    } catch (error) {
      console.error('Error getting total distributions:', error);
      return {
        success: false,
        error: 'Error getting total distributions',
      };
    }
  }

  async function getDistribution(distributionId) {
    try {
      const distribution = await readContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'getDistribution',
        args: [distributionId],
      });
      console.log('distribution', distribution);
      if (distribution.recipients.length === 0) {
        return {
          success: true,
          distribution: [],
          message: 'No distribution found',
        };
      } else {
        return {
          success: true,
          distribution: distribution,
          message: 'Distribution found',
        };
      }
    } catch (error) {
      console.error('Error getting distribution:', error);
      return {
        success: false,
        error: 'Error getting distribution:' + error,
      };
    }
  }

  async function getDonationIdsByAddress(address) {
    try {
      const donationIds = await readContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'getDonationIdsByAddress',
        args: [address],
      });
      console.log('donationIds', donationIds);
      return {
        success: true,
        donationIds: donationIds,
      };
    } catch (error) {
      console.error('Error getting donation ids by address:', error);
      return {
        success: false,
        error: 'Error getting donation ids by address:' + error,
      };
    }
  }

  async function getContractStats() {
    try {
      const contractStats = await readContract(config, {
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'getContractStats',
      });
      console.log('contractStats', contractStats);
      return {
        success: true,
        contractStats: contractStats,
      };
    } catch (error) {
      console.error('Error getting contract stats:', error);
      return {
        success: false,
        error: 'Error getting contract stats:' + error,
      };
    }
  }

  const value = {
    donate,
    getDonation,
    getTotalDonations,
    getTotalDistributions,
    getDistribution,
    getDonationIdsByAddress,
    getContractStats,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook for using the contract context
export const useContract = () => useContext(ContractContext);
