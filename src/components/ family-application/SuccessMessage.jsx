import React from 'react';
import { FaCheck, FaClock } from 'react-icons/fa';

const SuccessMessage = () => (
  <div className="max-w-full mx-auto py-12 px-4 text-center">
    <div className="mb-8">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <FaClock className="text-white text-xl" />
        </div>
      </div>
    </div>
    
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Application Submitted Successfully!
    </h2>
    
    <p className="text-lg text-gray-600 mb-12">
      Your application is now under review. We will notify you once the review is complete.
    </p>

    <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FaCheck className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Application Submitted</h3>
            <p className="text-gray-600">Your application has been received</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <FaClock className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Under Review</h3>
            <p className="text-gray-600">Estimated time: 3-5 business days</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SuccessMessage;