import React from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';

const NoFamilyModal = ({ isOpen, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: isOpen ? 1 : 0 }}
    exit={{ opacity: 0 }}
    className={`fixed inset-0 z-50 flex items-center justify-center ${!isOpen && 'hidden'}`}
  >
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-50 shadow-xl"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Confirm No Family Members
      </h3>
      
      <div className="mb-6">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <FaInfoCircle className="text-xl" />
          <p className="text-sm">You haven't added any family members.</p>
        </div>
        
        <p className="text-gray-600 text-sm">
          Are you sure you want to proceed without adding any family members? This means you're applying as a single individual.
        </p>
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
        >
          Go Back & Add Family
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Continue Without Family
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default NoFamilyModal;