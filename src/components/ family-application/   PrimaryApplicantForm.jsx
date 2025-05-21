import React from 'react';
import { motion } from 'framer-motion';

import { FaWallet, FaPlus, FaTrash } from 'react-icons/fa';

const PrimaryApplicantForm = ({ formik, socialMediaLinks, onSocialMediaChange, onAddSocialMedia, onRemoveSocialMedia }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 sm:space-y-6"
    >
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6">
          Primary Applicant Details
        </h3>
        
        <div className="space-y-3 sm:space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-4">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps('basicInfo.fullName')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your full name"
                />
                {formik.touched.basicInfo?.fullName && formik.errors.basicInfo?.fullName && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.basicInfo.fullName}</div>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Document *
                </label>
                <div className="border-2 border-dashed rounded-lg p-3 bg-white">
                  <input
                    type="file"
                    onChange={(e) => formik.setFieldValue('basicInfo.idDocument', e.target.files[0])}
                    className="w-full text-sm"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, JPG, PNG (Max size: 5MB)
                  </p>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Needs
                </label>
                <textarea
                  {...formik.getFieldProps('basicInfo.medicalNeeds')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 min-h-[80px]"
                  placeholder="Describe any medical conditions or needs"
                />
              </div>
            </div>
          </div>

          {/* Housing & Financial Information */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-4">
              Housing & Financial Information
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps('housingInfo.location')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your location"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Housing Conditions *
                </label>
                <select
                  {...formik.getFieldProps('housingInfo.housingCondition')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Housing Condition</option>
                  <option value="owned">Owned Property</option>
                  <option value="rented">Rented Accommodation</option>
                  <option value="temporary">Temporary Housing</option>
                  <option value="homeless">Currently Homeless</option>
                  <option value="shelter">Living in Shelter</option>
                </select>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Income
                </label>
                <input
                  type="number"
                  {...formik.getFieldProps('housingInfo.monthlyIncome')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crypto Wallet Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...formik.getFieldProps('cryptoWallet')}
                    className="w-full px-3 py-2 pl-9 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="0x..."
                  />
                  <FaWallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-4">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  {...formik.getFieldProps('basicInfo.contactNumber')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...formik.getFieldProps('basicInfo.email')}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Social Media Links Section */}
              <div className="w-full space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Social Media Links
                  <span className="text-gray-500 text-xs ml-1">(Max 5)</span>
                </label>
                
                {socialMediaLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <select
                          value={link.platform}
                          onChange={(e) => onSocialMediaChange(index, 'platform', e.target.value)}
                          className="w-1/3 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Platform</option>
                          <option value="facebook">Facebook</option>
                          <option value="twitter">Twitter</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="other">Other</option>
                        </select>
                        
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => onSocialMediaChange(index, 'url', e.target.value)}
                          className="w-2/3 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Enter URL"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => onRemoveSocialMedia(index)}
                      className="px-2 text-red-500 hover:text-red-700"
                      aria-label="Remove social media link"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))}
                
                {socialMediaLinks.length < 5 && (
                  <button
                    type="button"
                    onClick={onAddSocialMedia}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 mt-2"
                  >
                    <FaPlus className="text-xs" />
                    Add Social Media Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrimaryApplicantForm;