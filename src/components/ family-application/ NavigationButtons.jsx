import React from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const NavigationButtons = ({ currentStep, onNext, onPrevious, isSubmitting }) => (
  <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-0">
    {currentStep > 1 && (
      <button
        type="button"
        onClick={onPrevious}
        className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start gap-2"
      >
        <FaArrowLeft className="text-sm" />
        Previous
      </button>
    )}
    
    {currentStep < 3 && (
      <button
        type="button"
        onClick={onNext}
        className="w-full sm:w-auto sm:ml-auto px-4 sm:px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center justify-center sm:justify-start gap-2"
      >
        Next
        <FaArrowRight className="text-sm" />
      </button>
    )}
  </div>
);

export default NavigationButtons;