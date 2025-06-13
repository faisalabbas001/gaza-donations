import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaExclamationCircle } from 'react-icons/fa';

const FieldError = ({ error }) => (
  error ? (
    <div className="text-red-500 text-sm mt-1">
      <span className="flex items-center gap-1">
        <FaExclamationCircle className="text-xs" />
        {error}
      </span>
    </div>
  ) : null
);

const InputField = ({ label, error, required, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 ${
        error ? 'border-red-500 bg-red-50' : ''
      }`}
    />
    {error && (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    )}
  </div>
);

const FamilyMemberForm = ({ 
  familyMembers, 
  onAdd, 
  onRemove, 
  onChange, 
  fieldErrors 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        {familyMembers.map((member, index) => (
          <div key={index} className="border rounded-lg p-4 relative bg-white shadow-sm">
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
            
            <h3 className="text-base sm:text-lg font-medium mb-4">
              Family Member {index + 1}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <InputField
                label="Full Name"
                required
                type="text"
                value={member.fullName}
                onChange={(e) => onChange(index, 'fullName', e.target.value)}
                placeholder="Enter family member's name"
                error={fieldErrors[`member${index}_fullName`]}
              />

              <InputField
                label="Age"
                required
                type="number"
                value={member.age}
                onChange={(e) => onChange(index, 'age', e.target.value)}
                placeholder="Enter age"
                min="0"
                error={fieldErrors[`member${index}_age`]}
              />

              <InputField
                label="Relationship"
                required
                type="text"
                value={member.relationship}
                onChange={(e) => onChange(index, 'relationship', e.target.value)}
                placeholder="Enter relationship"
                error={fieldErrors[`member${index}_relationship`]}
              />

              {/* Medical Needs Field */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Needs
                </label>
                <textarea
                  value={member.medicalNeeds}
                  onChange={(e) => onChange(index, 'medicalNeeds', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 min-h-[80px]"
                  placeholder="Describe any medical conditions or needs"
                />
              </div>

              {/* Is Dependent Field */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is Dependent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={member.isDependent}
                    onChange={(e) => onChange(index, 'isDependent', e.target.checked)}
                    className="text-green-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </div>
              </div>
 <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is Disabled
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={member.isDisabled}
                    onChange={(e) => onChange(index, 'isDisabled', e.target.checked)}
                    className="text-green-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </div>
              </div>
              {/* ID Document Field */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Document *
                </label>
                <div className="border-2 border-dashed rounded-lg p-3 bg-white">
                  <input
                    type="file"
                    onChange={(e) => onChange(index, 'idDocument', e.target.files[0])}
                    className="w-full text-sm"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, JPG, PNG (Max size: 5MB)
                  </p>
                </div>
                <FieldError error={fieldErrors[`member${index}_idDocument`]} />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
        >
          + Add Another Family Member
        </button>
      </div>
    </motion.div>
  );
};

export default FamilyMemberForm;