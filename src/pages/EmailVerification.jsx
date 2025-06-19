import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaRedo, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    verificationCode: '',
    loading: false,
    resendDisabled: false,
    countdown: 30,
    verificationStatus: 'pending', // 'pending' | 'success' | 'failed'
    email: localStorage.getItem('tempEmail')
  });

  // Professional API client setup
  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Handle countdown timer with useCallback
  const handleCountdown = useCallback(() => {
    setState(prev => ({
      ...prev,
      countdown: prev.countdown - 1,
      resendDisabled: prev.countdown > 0
    }));
  }, []);

  // Session validation
  useEffect(() => {
    if (!state.email) {
      toast.error('Session expired. Please register again.');
      navigate('/register', { replace: true });
      return;
    }

    const timer = state.resendDisabled && state.countdown > 0 
      ? setInterval(handleCountdown, 1000)
      : null;

    return () => timer && clearInterval(timer);
  }, [state.email, state.resendDisabled, state.countdown, handleCountdown, navigate]);

  // Professional verification handler
  const handleVerify = async (e) => {
    e.preventDefault();
    const { verificationCode, email } = state;

    // Input validation
    if (!verificationCode?.match(/^\d{6}$/)) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data } = await apiClient.post('/auth/verify', {
        email,
        code: verificationCode.trim()
      });

      if (data.success) {
        setState(prev => ({ ...prev, verificationStatus: 'success' }));
        
        // Clear session data
        localStorage.removeItem('tempEmail');
        
        // Show success animation and redirect
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate('/login', { 
          replace: true,
          state: { verified: true }
        });
      }
    } catch (error) {
      setState(prev => ({ ...prev, verificationStatus: 'failed' }));
      
      const errorMessage = error.response?.data?.error 
        ? error.response.data.error.includes('expired')
          ? 'Code expired. Please request a new one.'
          : 'Invalid verification code. Please try again.'
        : 'Verification failed. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Professional resend handler
  const handleResend = async () => {
    if (state.resendDisabled) return;

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      resendDisabled: true,
      countdown: 30 
    }));

    try {
      const { data } = await apiClient.post('/auth/resend-verification', {
        email: state.email
      });

      if (data.success) {
        toast.success('New verification code sent!');
        setState(prev => ({ 
          ...prev,
          verificationCode: ''
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        resendDisabled: false,
        countdown: 0 
      }));
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Enhanced UI with animations and loading states
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto mt-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center">
            <motion.div
              animate={state.verificationStatus === 'success' ? {
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              } : {}}
            >
              {state.verificationStatus === 'success' ? (
                <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
              ) : (
                <FaEnvelope className="mx-auto h-12 w-12 text-blue-600" />
              )}
            </motion.div>
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {state.verificationStatus === 'success' 
                ? 'Email Verified!' 
                : 'Verify your email'}
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              Verification code sent to<br />
              <span className="font-medium text-gray-900">
                {state.email}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            <div>
              <label htmlFor="code" className="sr-only">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={state.verificationCode}
                onChange={(e) => setState({ ...state, verificationCode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                placeholder="Enter 6-digit code"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm 
                  placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 
                  text-center text-lg tracking-wider"
                maxLength="6"
                pattern="\d*"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={state.loading || !state.verificationCode}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                ${state.loading || !state.verificationCode ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              {state.loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={state.resendDisabled}
                className={`inline-flex items-center text-sm text-blue-600 hover:text-blue-500 
                  ${state.resendDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <FaRedo className="mr-2 h-4 w-4" />
                {state.resendDisabled 
                  ? `Resend code in ${state.countdown}s` 
                  : 'Resend verification code'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerification;