import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUser } from 'react-icons/fa';

const ApplicationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-5">
        {/* Header Section */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            Application Form
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Apply for support as an initiative or family
          </motion.p>
        </div>

        {/* Cards Container */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Initiative Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/apply/initiative')}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
              cursor-pointer border border-gray-100 overflow-hidden group"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center 
                mx-auto mb-6 group-hover:bg-blue-200 transition-all duration-300"
              >
                <FaUsers className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Initiative</h2>
              <p className="text-gray-600">
                For organizations helping multiple families
              </p>
              <div className="mt-6 inline-flex items-center text-blue-600 group-hover:text-blue-700">
                <span className="font-medium">Apply as Initiative</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Family Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/apply/family')}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
              cursor-pointer border border-gray-100 overflow-hidden group"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center 
                mx-auto mb-6 group-hover:bg-green-200 transition-all duration-300"
              >
                <FaUser className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Family</h2>
              <p className="text-gray-600">
                For individual families seeking support
              </p>
              <div className="mt-6 inline-flex items-center text-green-600 group-hover:text-green-700">
                <span className="font-medium">Apply as Family</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>
            Need help choosing? Contact our support team at{' '}
            <a href="mailto:support@givegaza.org" 
              className="text-blue-600 hover:text-blue-700 font-medium">
              support@givegaza.org
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationPage;