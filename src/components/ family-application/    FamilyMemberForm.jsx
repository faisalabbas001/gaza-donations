import React from 'react';

import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

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
              {/* Full Name Field */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={member.fullName}
                  onChange={(e) => onChange(index, 'fullName', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter family member's name"
                />
                <FieldError error={fieldErrors[`member${index}_fullName`]} />
              </div>

              {/* Age Field */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={member.age}
                  onChange={(e) => onChange(index, 'age', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter age"
                  min="0"
                />
                <FieldError error={fieldErrors[`member${index}_age`]} />
              </div>

              {/* Relationship Field */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <input
                  type="text"
                  value={member.relationship}
                  onChange={(e) => onChange(index, 'relationship', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter relationship"
                />
                <FieldError error={fieldErrors[`member${index}_relationship`]} />
              </div>

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