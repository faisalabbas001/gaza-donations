import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBitcoin, FaEthereum, FaCreditCard, FaUsers, FaLightbulb, FaHeart, FaHandHoldingHeart, FaHome, FaLeaf, FaChild, FaHandsHelping, FaCheck, FaLock, FaPaypal, FaPrint, FaSpinner } from 'react-icons/fa';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DonationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    donationType: '',
    category: '',
    amount: 50,
    customAmount: '',
    paymentMethod: 'card',
    donorName: '',
    email: '',
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
  const navigate = useNavigate();

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

  const validateForm = () => {
    const errors = {};
    if (!formData.donorName) errors.donorName = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.customAmount && !formData.amount) errors.amount = 'Please select an amount';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate receipt data
      const receipt = {
        id: `TXN-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        amount: formData.customAmount || formData.amount
      };
      
      setReceiptData(receipt);
      setIsProcessing(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
                    onChange={handleInputChange}
                    className="w-full p-2 md:p-3 border rounded-lg text-base md:text-lg"
                    placeholder="Enter your name"
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
                    onChange={handleInputChange}
                    className="w-full p-2 md:p-3 border rounded-lg text-base md:text-lg"
                    placeholder="Enter your email"
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
                    onClick={() => setFormData(prev => ({ ...prev, amount: presetAmount, customAmount: '' }))}
                    className={`
                      py-4 rounded-lg  text-center transition-all transform hover:scale-105
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
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter custom amount"
                />
              </div>
            </div>

            {/* Recurring Donation */}
            <div className="mb-8">
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
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'card', icon: FaCreditCard, label: 'Credit Card' },
                  { id: 'bitcoin', icon: FaBitcoin, label: 'Bitcoin' },
                  { id: 'ethereum', icon: FaEthereum, label: 'Ethereum' },
                  { id: 'paypal', icon: FaPaypal, label: 'PayPal' }
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: id }))}
                    className={`
                      p-4 rounded-xl border-2 transition-all transform hover:scale-105
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
            </div>

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