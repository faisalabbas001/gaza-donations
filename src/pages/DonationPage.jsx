import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBitcoin, FaEthereum, FaCreditCard, FaUsers, FaLightbulb, FaHeart, FaHandHoldingHeart, FaHome, FaLeaf, FaChild, FaHandsHelping, FaCheck, FaLock, FaPaypal, FaPrint, FaSpinner, FaCopy } from 'react-icons/fa';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { MdWallet } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useAuth } from '../contexts/AuthContext';
import { useContract } from '../../web3Utils/blockchainContext';
const DonationPage = () => {
  const { auth } = useAuth();
  const {donate} = useContract();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    donationType: '',
    category: '',
    amount: 50,
    customAmount: '',
    paymentMethod: 'metamask',
    donorName: auth.user?.name || '',  // Initialize with user's name
    email: auth.user?.email || '',     // Initialize with user's email
    phone: '',
    address: '',
    message: '',
    isAnonymous: false,
    isRecurring: false,
    recurringFrequency: 'monthly'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const navigate = useNavigate();

  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address: address,
  });
  const predefinedAmounts = [10, 25, 50, 100, 250, 500];
  const recurringOptions = ['monthly', 'quarterly', 'yearly'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBack = () => {
    navigate("/")
  };

  // Update validateForm function
  const validateForm = () => {
    const errors = {};

    // Check amount (either custom or predefined)
    const donationAmount = formData.customAmount || formData.amount;
    if (!donationAmount || donationAmount <= 0) {
      errors.amount = 'Please enter a valid donation amount';
    }

    // Check if wallet is connected
    if (!address) {
      errors.wallet = 'Please connect your wallet to make a donation';
    }

    // No need to validate isAnonymous as it's a boolean with default false
    // No need to validate transactionHash as it's generated during submission

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate wallet connection first
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

     
    // Validate form
    if (!validateForm()) {
      // Show all validation errors
      if (formErrors.amount) {
        toast.error(formErrors.amount);
      }
      if (formErrors.wallet) {
        toast.error(formErrors.wallet);
      }
      return;
    }

    setIsProcessing(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login first');
        navigate('/login/donor');
        return;
      }

  
      const {tx, success, error} = await donate(
        formData.customAmount || formData.amount)
      
        console.log('tx', tx);
      if (!success) {
        throw new Error(error || 'Failed to process donation');
      }

      // Prepare donation data with required fields
      const donationData = {
        amount: Number(formData.customAmount || formData.amount),
        anonymous: formData.isAnonymous,
        transactionHash: tx,
        donorWalletAddress: address // Using actual connected wallet address
      };

      // Validate all required fields are present
      if (!donationData.amount || !donationData.donorWalletAddress) {
        throw new Error('Missing required fields');
      }

      // Send data to API
      const response = await axios.post(
        'http://localhost:5000/api/v1/donations', 
        donationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        const receipt = {
          id: dummyTransactionHash,
          date: new Date().toLocaleDateString(),
          amount: donationData.amount
        };
        
        setReceiptData(receipt);
        setIsSuccess(true);
        setShowConfirmation(true);
        toast.success('Donation processed successfully!');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login/donor');
      } else {
        toast.error(error.message || error.response?.data?.message || 'Failed to process donation');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Processing overlay
  const renderProcessing = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-8 text-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Processing Your Donation</h3>
        <p className="text-gray-600 mt-2">Please wait while we process your payment...</p>
      </div>
    </motion.div>
  );

  // Confirmation message
  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 text-center"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h2>
        <p className="text-gray-600 text-lg">Your payment has been processed successfully.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-xl mb-4">Payment Details</h3>
        <div className="space-y-3 text-left">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600 text-lg">Amount Paid:</span>
            <span className="font-bold text-green-600 text-xl">
              ${formData.customAmount || formData.amount}
            </span>
          </div>
          
          {formData.isRecurring && (
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 text-lg">Payment Schedule:</span>
              <span className="font-semibold text-lg capitalize">{formData.recurringFrequency}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600 text-lg">Transaction ID:</span>
            <span className="font-semibold text-lg">{receiptData.id}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600 text-lg">Date:</span>
            <span className="font-semibold text-lg">{receiptData.date}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => navigate('/')}
          className="w-full py-4 text-lg bg-green-600 hover:bg-green-700"
        >
          Back to Home
        </Button>
        <Button
          variant="secondary"
          onClick={handlePrintReceipt}
          className="w-full py-4 text-lg"
        >
          Download Receipt
        </Button>
      </div>
    </motion.div>
  );

  // Add this helper function
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const WalletInfo = () => (
    <div className="flex flex-col items-center space-y-2"  onClick={(e) => {
      e.stopPropagation();
      setShowDisconnectModal(true);
    }}>
      <div className="flex items-center space-x-2">
        <div 
          className="cursor-pointer hover:text-primary-600 font-medium"
         
        >
          {formatAddress(address)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(address);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaCopy className="w-4 h-4 text-gray-500 hover:text-primary-600" />
        </button>
      </div>
      <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
        {Number(balanceData?.formatted).toFixed(4)} {balanceData?.symbol}
      </div>
    </div>
  );

  const DisconnectModal = () => (
    <AnimatePresence>
      {showDisconnectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDisconnectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Wallet Connection</h3>
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Connected with</span>
                <span className="font-medium">{formatAddress(address)}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Balance</span>
                <span className="font-medium">
                  {Number(balanceData?.formatted).toFixed(4)} {balanceData?.symbol}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDisconnectModal(false)}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  disconnect();
                  setShowDisconnectModal(false);
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700"
              >
                Disconnect
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Update the payment method section
  const renderPaymentMethods = () => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'card', icon: FaCreditCard, label: 'Credit Card' },
          {
            id: 'metamask',
            icon: FaCreditCard,
            label: isConnected ? <WalletInfo /> : 'Connect Wallet'
          },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              if (id === 'metamask' && !isConnected) {
                open();
              } else {
                setFormData(prev => ({ ...prev, paymentMethod: id }));
              }
            }}
            className={`
              p-4 rounded-xl border-2 transition-all cursor-pointer transform hover:scale-105
              ${formData.paymentMethod === id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200'
              }
            `}
          >
            <Icon className="text-3xl mb-2 mx-auto" />
            <span className="block text-sm">{label}</span>
          </button>
        ))}
      </div>
      <DisconnectModal />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isProcessing && renderProcessing()}
        {showConfirmation ? renderConfirmation() : (
          <motion.div
            {...pageTransition}
            className="bg-white rounded-xl shadow-lg p-4 md:p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Donation Details</h2>
            
            {/* Donor Information */}
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    readOnly
                    className="w-full p-2 md:p-3 border rounded-lg text-base md:text-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full p-2 md:p-3 border rounded-lg text-base md:text-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mt-3">Donation Amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      amount: presetAmount,
                      customAmount: presetAmount.toString() // Convert to string for input value
                    }))}
                    className={`
                      py-4 rounded-lg text-center transition-all transform hover:scale-105
                      ${formData.amount === presetAmount
                        ? 'bg-primary-600 text-black'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    ${presetAmount}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <input
                  type="number"
                  name="customAmount"
                 
                  value={formData.customAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      customAmount: value,
                      amount: value ? Number(value) : 0 // Update amount when custom amount changes
                    }));
                  }}
                  className={`w-full p-3 border rounded-lg ${
                    formErrors.amount ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter custom amount"
                />
                {formErrors.amount && (
                  <p className="mt-1 text-red-500 text-sm">{formErrors.amount}</p>
                )}
              </div>
            </div>

            {/* Recurring Donation */}
            {/* <div className="mb-8">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600"
                />
                <label className="ml-2 text-gray-700">Make this a recurring donation</label>
              </div>
              {formData.isRecurring && (
                <select
                  name="recurringFrequency"
                  value={formData.recurringFrequency}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                >
                  {recurringOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div> */}

            {/* Payment Method */}
            {renderPaymentMethods()}

            {/* Message */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave a Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                rows="4"
                placeholder="Share why you're making this donation..."
              />
            </div>

            {/* Anonymous Donation */}
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600"
                />
                <label className="ml-2 text-gray-700">Make this donation anonymous</label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <Button 
                onClick={handleBack}
                variant="secondary"
                className="w-full md:w-1/2 py-3 md:py-4 text-base md:text-lg"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-full md:w-1/2 py-3 md:py-4 text-base md:text-lg font-bold bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-white mr-2" />
                    Processing...
                  </div>
                ) : (
                  <>
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;