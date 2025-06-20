import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaClock } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const InitiativeApplicationPage = () => {
  const { auth } = useAuth(); // Get authenticated user
  const [loading, setLoading] = useState(false);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Modified form states for each step
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    contactNumber: '',
    contactEmail: '',
    registrationNumber: '',
    legalStatus: '', // Will be updated with correct enum values
    location: '',
    AreaOfOperation: '',
    urgencyLevel: 'medium' // Default value
  });
  
  const [organizationInfo, setOrganizationInfo] = useState({
    servicesOffered: '',
    NumberOfVolunteers: '',
    cryptoWallet: {
      address: '',
      network: 'ERC20',
      currency: 'USDT'
    },
    monthlyNeed: '',
    totalReceived: 0,
    lastDistribution: '',
    nextDistribution: ''
  });
  
  const [documents, setDocuments] = useState({
    registrationDocuments: null,
    PastWorkReport: null,
    verificationDocuments: null
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Updated validation schemas
  const stepOneValidation = Yup.object().shape({
    fullName: Yup.string().required('Please provide a name'),
    contactNumber: Yup.string()
      .required('Please provide a contact number')
      .matches(/^\+[1-9]\d{1,14}$/, 'Phone number must be in international format (e.g., +123456789)'),
    contactEmail: Yup.string()
      .email('Invalid email format')
      .required('Please provide a contact email'),
    registrationNumber: Yup.string().required('Registration number is required'),
    legalStatus: Yup.string()
      .oneOf(['ngo', 'nonprofit', 'charity', 'foundation'], 'Please select a valid legal status')
      .required('Legal status is required'),
    location: Yup.string().required('Location is required'),
    AreaOfOperation: Yup.string().required('Area of operation is required'),
    urgencyLevel: Yup.string()
      .oneOf(['low', 'medium', 'high', 'critical'], 'Please select a valid urgency level')
      .required('Urgency level is required')
  });

  const stepTwoValidation = Yup.object().shape({
    servicesOffered: Yup.string()
      .required('Services offered is required')
      .min(10, 'Please provide more detail about your services'),
    
    NumberOfVolunteers: Yup.number()
      .required('Number of volunteers is required')
      .min(1, 'Must have at least 1 volunteer')
      .typeError('Must be a number'),
    
    cryptoWallet: Yup.object().shape({
      address: Yup.string()
        .required('Wallet address is required')
        .matches(
          /^0x[a-fA-F0-9]{40}$/,
          'Must be a valid Ethereum wallet address'
        )
    }),
    
    monthlyNeed: Yup.number()
      .required('Monthly need amount is required')
      .min(1, 'Amount must be greater than 0')
      .typeError('Must be a number')
  });

  const stepThreeValidation = Yup.object().shape({
    registrationDocuments: Yup.mixed().required('Registration document is required'),
    PastWorkReport: Yup.mixed().required('Past work reports are required'),
    verificationDocuments: Yup.mixed().required('Verification documents are required')
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

  // Update the handleOrganizationInfoChange function to handle nested objects
  const handleOrganizationInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (cryptoWallet)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOrganizationInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle regular fields
      setOrganizationInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Update file upload handler
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
          currentData = {
            fullName: basicInfo.fullName,
            contactNumber: basicInfo.contactNumber,
            contactEmail: basicInfo.contactEmail,
            registrationNumber: basicInfo.registrationNumber,
            legalStatus: basicInfo.legalStatus,
            location: basicInfo.location,
            AreaOfOperation: basicInfo.AreaOfOperation,
            urgencyLevel: basicInfo.urgencyLevel
          };
          break;
        case 2:
          currentValidation = stepTwoValidation;
          currentData = {
            ...organizationInfo,
            cryptoWallet: {
              ...organizationInfo.cryptoWallet
            }
          };
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
      // toast.error('Please fill in all required fields');
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
    setLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Add basic info
      Object.keys(basicInfo).forEach(key => {
        formData.append(key, basicInfo[key]);
      });

      // Add organization info
      formData.append('servicesOffered', organizationInfo.servicesOffered);
      formData.append('NumberOfVolunteers', organizationInfo.NumberOfVolunteers);
      formData.append('cryptoWallet.address', organizationInfo.cryptoWallet.address);
      formData.append('cryptoWallet.network', organizationInfo.cryptoWallet.network);
      formData.append('cryptoWallet.currency', organizationInfo.cryptoWallet.currency);
      formData.append('monthlyNeed', organizationInfo.monthlyNeed);

      // Add files
      if (documents.registrationDocuments) {
        formData.append('registrationDocuments', documents.registrationDocuments);
      }
      if (documents.PastWorkReport) {
        formData.append('PastWorkReport', documents.PastWorkReport);
      }
      if (documents.verificationDocuments) {
        formData.append('verificationDocuments', documents.verificationDocuments);
      }

      // Make API request
      const response = await axios.post(
        'https://gazabackend-production.up.railway.app/api/v1/initiatives',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success('Initiative application submitted successfully!');
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      // Handle specific error for existing initiative
      if (error.response?.data?.error === "User already has an initiative profile") {
        toast.error('You already have an active initiative application. Only one initiative per user is allowed.');
        // Optional: Redirect to initiative management page
        // navigate('/initiatives/manage');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add this helper function at the top of your component
  const formatValue = (key, value) => {
    if (!value) return 'Not provided';
    
    if (typeof value === 'object' && !value.name) {
      if (key === 'cryptoWallet') {
        return value.address;
      }
      return JSON.stringify(value);
    }
    
    if (value instanceof File) {
      return value.name;
    }
    
    return value;
  };

  // Add this check at the beginning of your component
  useEffect(() => {
    const checkExistingInitiative = async () => {
      try {
        const response = await axios.get(
          'https://gazabackend-production.up.railway.app/api/v1/initiatives/user',
          {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        );

        if (response.data.success && response.data.data) {
          toast.error('You already have an active initiative application.');
          // Optional: Redirect to initiative management page
          // navigate('/initiatives/manage');
        }
      } catch (error) {
        console.error('Error checking existing initiative:', error);
      }
    };

    checkExistingInitiative();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
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
      <div className="max-w-7xl mx-auto px-4">
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
                        placeholder="Enter registration number"
                      />
                      {errors.registrationNumber && (
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
                        <option value="ngo">NGO</option>
                        <option value="organization">Organization</option>
                        <option value="individual">Individual</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.legalStatus && (
                        <div className="text-red-500 text-sm mt-1">{errors.legalStatus}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area of Operation
                      </label>
                      <textarea
                        name="AreaOfOperation"
                        value={basicInfo.AreaOfOperation}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.AreaOfOperation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows="3"
                        placeholder="Describe your geographical area of operation"
                      />
                      {errors.AreaOfOperation && (
                        <div className="text-red-500 text-sm mt-1">{errors.AreaOfOperation}</div>
                      )}
                    </div>

   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level
                      </label>
                      <select
                        name="urgencyLevel"
                        value={basicInfo.urgencyLevel}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                         errors.urgencyLevel ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Urgency Level</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      {errors.urgencyLevel && (
                        <div className="text-red-500 text-sm mt-1">{errors.urgencyLevel }</div>
                      )}
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={basicInfo.fullName}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={basicInfo.contactNumber}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+123456789"
                      />
                      {errors.contactNumber && (
                        <div className="text-red-500 text-sm mt-1">{errors.contactNumber}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={basicInfo.contactEmail}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="email@example.com"
                      />
                      {errors.contactEmail && (
                        <div className="text-red-500 text-sm mt-1">{errors.contactEmail}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={basicInfo.location}
                        onChange={handleBasicInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your location"
                      />
                      {errors.location && (
                        <div className="text-red-500 text-sm mt-1">{errors.location}</div>
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
                        placeholder="e.g., Food distribution, medical aid, shelter assistance..."
                      />
                      {errors.servicesOffered && (
                        <div className="text-red-500 text-sm mt-1">{errors.servicesOffered}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Staff/Volunteers
                      </label>
                      <input
                        type="number"
                        name="NumberOfVolunteers"
                        value={organizationInfo.NumberOfVolunteers}
                        onChange={handleOrganizationInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.NumberOfVolunteers ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="1"
                        placeholder="Enter number of volunteers"
                      />
                      {errors.NumberOfVolunteers && (
                        <div className="text-red-500 text-sm mt-1">{errors.NumberOfVolunteers}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crypto Wallet Address (ERC20)
                      </label>
                      <input
                        type="text"
                        name="cryptoWallet.address"
                        value={organizationInfo.cryptoWallet.address}
                        onChange={handleOrganizationInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors['cryptoWallet.address'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0x..."
                      />
                      {errors['cryptoWallet.address'] && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors['cryptoWallet.address']}
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Enter a valid Ethereum wallet address starting with 0x
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Need (USDT)
                      </label>
                      <input
                        type="number"
                        name="monthlyNeed"
                        value={organizationInfo.monthlyNeed}
                        onChange={handleOrganizationInfoChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.monthlyNeed ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="1"
                        placeholder="Enter amount in USDT"
                      />
                      {errors.monthlyNeed && (
                        <div className="text-red-500 text-sm mt-1">{errors.monthlyNeed}</div>
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
                          {field.charAt(0).toUpperCase() + field.slice(1)} 
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
                      type="button"
                      onClick={() => handleEdit(1)}
                      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(basicInfo).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-2">
                          <p className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium">{formatValue(key, value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Organization Information Review */}
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => handleEdit(2)}
                      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <h4 className="font-medium text-gray-900 mb-2">Organization Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(organizationInfo).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-2">
                          <p className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          {key === 'cryptoWallet' ? (
                            <p className="font-medium">{value.address}</p>
                          ) : (
                            <p className="font-medium">{formatValue(key, value)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Review */}
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => handleEdit(3)}
                      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Documents</h4>
                    <div className="space-y-3">
                      {Object.entries(documents).map(([key, file]) => (
                        <div key={key} className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <div className="flex items-center">
                            {file ? (
                              <FaCheck className="text-green-500 mr-2" />
                            ) : (
                              <FaTimes className="text-red-500 mr-2" />
                            )}
                            <div>
                              <p className="text-sm text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="font-medium">
                                {file ? file.name : 'No file uploaded'}
                              </p>
                            </div>
                          </div>
                          {file && (
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
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
                    disabled={loading}
                    className={`px-6 py-2 bg-green-500 text-white rounded-lg 
                      ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-600'}`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
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