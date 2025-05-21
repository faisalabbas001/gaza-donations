import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaClock } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast'

const InitiativeApplicationPage = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Modified form states for each step
  const [basicInfo, setBasicInfo] = useState({
    registrationNumber: '',
    legalStatus: '',
    areaOfOperation: ''
  });
  
  const [organizationInfo, setOrganizationInfo] = useState({
    servicesOffered: '',
    numberOfStaff: '',
    cryptoWallet: ''
  });
  
  const [documents, setDocuments] = useState({
    pastWorkReports: null,
    registrationDocument: null,
    additionalDocuments: null
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Updated validation schemas
  const stepOneValidation = Yup.object().shape({
    registrationNumber: Yup.string()
      .required('Registration number is required'),
    legalStatus: Yup.string()
      .required('Legal status is required'),
    areaOfOperation: Yup.string()
      .required('Area of operation is required')
  });

  const stepTwoValidation = Yup.object().shape({
    servicesOffered: Yup.string()
      .required('Services offered is required'),
    numberOfStaff: Yup.string()
      .required('Number of staff/volunteers is required'),
    cryptoWallet: Yup.string()
      .required('Crypto wallet address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address')
  });

  const stepThreeValidation = Yup.object().shape({
    pastWorkReports: Yup.mixed().required('Past work reports are required'),
    registrationDocument: Yup.mixed().required('Registration document is required'),
    additionalDocuments: Yup.mixed().required('Additional documents are required')
  });

  // Add edit mode state
  const [editMode, setEditMode] = useState({
    step: null,
    isEditing: false
  });

  // Handle field changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleOrganizationInfoChange = (e) => {
    const { name, value } = e.target;
    setOrganizationInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileUpload = (fieldName, file) => {
    setDocuments(prev => ({
      ...prev,
      [fieldName]: file
    }));
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  // Validate current step
  const validateStep = async () => {
    try {
      let currentValidation;
      let currentData;

      switch (currentStep) {
        case 1:
          currentValidation = stepOneValidation;
          currentData = basicInfo;
          break;
        case 2:
          currentValidation = stepTwoValidation;
          currentData = organizationInfo;
          break;
        case 3:
          currentValidation = stepThreeValidation;
          currentData = documents;
          break;
        default:
          return true;
      }

      await currentValidation.validate(currentData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {  
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Add edit functionality
  const handleEdit = (step) => {
    setEditMode({ step, isEditing: true });
    setCurrentStep(step);
  };

  // Modify handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps before final submission
    let isValid = true;
    for (let step = 1; step <= 3; step++) {
      let currentData;
      let currentValidation;
      
      switch (step) {
        case 1:
          currentData = basicInfo;
          currentValidation = stepOneValidation;
          break;
        case 2:
          currentData = organizationInfo;
          currentValidation = stepTwoValidation;
          break;
        case 3:
          currentData = documents;
          currentValidation = stepThreeValidation;
          break;
      }
      
      try {
        await currentValidation.validate(currentData, { abortEarly: false });
      } catch (error) {
        isValid = false;
        toast.error(`Please check step ${step} for errors`);
        break;
      }
    }

    if (isValid) {
      const formData = {
        ...basicInfo,
        ...organizationInfo,
        documents
      };
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Initiative Application
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Apply for support as an organization helping multiple families
          </p>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>Please fill out all required fields carefully to ensure quick processing of your application</p>
          </div>
        </div>
      </div>
      <div className="max-w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-green-500 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            <div className="relative z-10 flex justify-between">
              {['Basic Info', 'Organization Details', 'Documents', 'Review'].map((label, index) => (
                <div key={label} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${index + 1 <= currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                      } transition-all duration-300`}
                  >
                    {index + 1 <= currentStep ? <FaCheck /> : index + 1}
                  </div>
                  <div 
                    className={`mt-2 text-sm font-medium
                      ${index + 1 <= currentStep ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={basicInfo.registrationNumber}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.registrationNumber && touched.registrationNumber && (
                        <div className="text-red-500 text-sm mt-1">{errors.registrationNumber}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Legal Status
                      </label>
                      <select
                        name="legalStatus"
                        value={basicInfo.legalStatus}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.legalStatus ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Legal Status</option>
                        <option value="registered_ngo">Registered NGO</option>
                        <option value="charity">Registered Charity</option>
                        <option value="foundation">Foundation</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.legalStatus && touched.legalStatus && (
                        <div className="text-red-500 text-sm mt-1">{errors.legalStatus}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area of Operation
                      </label>
                      <textarea
                        name="areaOfOperation"
                        value={basicInfo.areaOfOperation}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.areaOfOperation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows="3"
                        placeholder="Describe your geographical area of operation"
                      />
                      {errors.areaOfOperation && touched.areaOfOperation && (
                        <div className="text-red-500 text-sm mt-1">{errors.areaOfOperation}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Organization Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Services Offered
                      </label>
                      <textarea
                        name="servicesOffered"
                        value={organizationInfo.servicesOffered}
                        onChange={handleOrganizationInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.servicesOffered ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows="3"
                        placeholder="Describe the services your organization offers"
                      />
                      {errors.servicesOffered && touched.servicesOffered && (
                        <div className="text-red-500 text-sm mt-1">{errors.servicesOffered}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Staff/Volunteers
                      </label>
                      <input
                        type="number"
                        name="numberOfStaff"
                        value={organizationInfo.numberOfStaff}
                        onChange={handleOrganizationInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.numberOfStaff ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="1"
                      />
                      {errors.numberOfStaff && touched.numberOfStaff && (
                        <div className="text-red-500 text-sm mt-1">{errors.numberOfStaff}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crypto Wallet Address
                      </label>
                      <input
                        type="text"
                        name="cryptoWallet"
                        value={organizationInfo.cryptoWallet}
                        onChange={handleOrganizationInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.cryptoWallet ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0x..."
                      />
                      {errors.cryptoWallet && touched.cryptoWallet && (
                        <div className="text-red-500 text-sm mt-1">{errors.cryptoWallet}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6">
                    {Object.keys(documents).map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.charAt(0).toUpperCase() + field.slice(1)} Document
                        </label>
                        <div 
                          className={`border-2 border-dashed rounded-lg p-4 ${
                            documents[field] ? 'border-green-500 bg-green-50' : 'border-gray-300'
                          }`}
                        >
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(field, e.target.files[0])}
                            className="hidden"
                            id={`file-${field}`}
                          />
                          <label
                            htmlFor={`file-${field}`}
                            className="cursor-pointer block text-center"
                          >
                            {documents[field] ? (
                              <span className="text-green-600">{documents[field].name}</span>
                            ) : (
                              <span className="text-gray-500">Click to upload</span>
                            )}
                          </label>
                        </div>
                        {errors[field] && touched[field] && (
                          <div className="text-red-500 text-sm mt-1">{errors[field]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Review Your Application
                  </h3>

                  {/* Basic Information Review */}
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      onClick={() => handleEdit(1)}
                      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(basicInfo).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-gray-600">{key}</p>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Organization Information Review */}
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      onClick={() => handleEdit(2)}
                      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <h4 className="font-medium text-gray-900 mb-2">Organization Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(organizationInfo).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-gray-600">{key}</p>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Review */}
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      onClick={() => handleEdit(3)}
                      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {Object.entries(documents).map(([key, file]) => (
                        <div key={key} className="flex items-center">
                          <FaCheck className="text-green-500 mr-2" />
                          <p className="text-sm">{file?.name || 'No file uploaded'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="confirm"
                      className="h-4 w-4 text-green-500 rounded border-gray-300"
                      required
                    />
                    <label htmlFor="confirm" className="ml-2 text-sm text-gray-600">
                      I confirm that all the information provided is accurate and complete
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                     className="w-full sm:w-auto sm:ml-auto px-4 sm:px-6 py-2 bg-blue-700 text-white rounded-lg  flex items-center justify-center sm:justify-start gap-2"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Success message content from previous response */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 
                }}
                className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <FaClock className="text-4xl text-green-500" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Your application is now under review. We will notify you once the review is complete.
              </p>

              {/* Status Timeline */}
              <div className="max-w-md mx-auto text-left">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-gray-500">Your application has been received</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Under Review</p>
                      <p className="text-sm text-gray-500">Estimated time: 3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitiativeApplicationPage;