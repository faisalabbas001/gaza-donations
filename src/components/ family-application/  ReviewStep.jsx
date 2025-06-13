import React from 'react';

import { motion } from 'framer-motion';
import { FaUser, FaUsers, FaPen, FaExclamationCircle, FaCheck } from 'react-icons/fa';

const ReviewField = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
    <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-sm sm:text-base font-medium text-gray-900 break-all">{value || 'Not provided'}</p>
  </div>
);

const ReviewStep = ({ 
  formik, 
  familyMembers, 
  onSubmit, 
  isSubmitting,
  onEdit 
}) => {
  // Add local state for confirmation
  const [confirmed, setConfirmed] = React.useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) {
      toast.error('Please confirm the accuracy of information');
      return;
    }
    if (!formik.isValid) {
      toast.error('Please check all required fields');
      return;
    }
    await onSubmit(formik.values);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Basic Information Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FaUser className="text-green-500 text-sm" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>
          </div>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
          >
            <FaPen size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ReviewField label="Full Name" value={formik.values.basicInfo.fullName} />
          <ReviewField label="Contact Number" value={formik.values.basicInfo.contactNumber} />
          <ReviewField label="Email" value={formik.values.basicInfo.email} />
          <ReviewField label="Housing Condition" value={formik.values.housingInfo.housingCondition} />
          <ReviewField label="Location" value={formik.values.housingInfo.location} />
          <ReviewField 
            label="Monthly Income" 
            value={formik.values.housingInfo.monthlyIncome ? 
              `$${formik.values.housingInfo.monthlyIncome}` : 'Not specified'} 
          />
          <ReviewField 
            label="Crypto Wallet" 
            value={formik.values.cryptoWallet} 
          />
          <ReviewField 
            label="Social Media Links" 
            value={
              formik.values.basicInfo.socialMediaLinks?.length > 0 
                ? formik.values.basicInfo.socialMediaLinks
                    .filter(link => link.platform && link.url)
                    .map(link => `${link.platform}: ${link.url}`)
                    .join('\n')
                : 'None provided'
            } 
          />
        </div>
      </div>

      {/* Family Members Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FaUsers className="text-purple-500 text-sm" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold">
              Family Members ({familyMembers.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
          >
            <FaPen size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-4">
          {familyMembers.map((member, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <h4 className="font-medium text-sm sm:text-base mb-3">
                Family Member {index + 1}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReviewField label="Full Name" value={member.fullName} />
                <ReviewField label="Age" value={member.age} />
                <ReviewField label="Relationship" value={member.relationship} />
                <ReviewField label="Medical Needs" value={member.medicalNeeds || 'None'} />
                <ReviewField 
                  label="Is Dependent" 
                  value={member.isDependent ? 'Yes' : 'No'} 
                />
                <ReviewField 
                  label="ID Document" 
                  value={member.idDocument?.name || 'Not uploaded'} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="confirmAccuracy"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="confirmAccuracy" className="text-sm text-gray-700">
            I confirm that all the information provided is accurate and complete. 
            I understand that providing false information may result in the rejection of my application.
          </label>
        </div>
        {!confirmed && (
          <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
            <FaExclamationCircle className="text-xs" />
            <span>Please confirm the accuracy of your information</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !confirmed}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg text-white flex items-center justify-center gap-2
            ${isSubmitting || !confirmed ? 
              'bg-gray-400 cursor-not-allowed' : 
              'bg-green-500 hover:bg-green-600'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
          {!isSubmitting && <FaCheck className="text-sm" />}
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;