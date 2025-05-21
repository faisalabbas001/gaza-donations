import React from 'react';

import { FaCheck } from 'react-icons/fa';

const ProgressBar = ({ currentStep }) => (
  <div className="relative mb-6 sm:mb-8 px-2">
    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -translate-y-1/2" />
    
    <div 
      className="absolute top-1/2 left-0 h-[2px] bg-green-500 -translate-y-1/2 transition-all duration-500"
      style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
    />

    <div className="relative z-10 flex justify-between">
      {[
        { step: 1, label: 'Basic Information' },
        { step: 2, label: 'Family Members' },
        { step: 3, label: 'Review & Submit' }
      ].map(({ step, label }) => (
        <div key={step} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 text-xs sm:text-base
              ${step <= currentStep 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-500'}`}
          >
            {step < currentStep ? <FaCheck className="text-xs sm:text-sm" /> : step}
          </div>
          <div 
            className={`mt-1 sm:mt-2 text-[10px] sm:text-sm font-medium text-center transition-all duration-300
              ${step <= currentStep ? 'text-green-500' : 'text-gray-400'}`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProgressBar;