import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Import components
import NoFamilyModal from '../components/ family-application/ NoFamilyModal';
import ProgressBar from '../components/ family-application/ProgressBar';
import SuccessMessage from '../components/ family-application/SuccessMessage';
import PrimaryApplicantForm from '../components/ family-application/   PrimaryApplicantForm';
import FamilyMemberForm from '../components/ family-application/    FamilyMemberForm';
import ReviewStep from '../components/ family-application/  ReviewStep';
import NavigationButtons from '../components/ family-application/ NavigationButtons';

// Validation Schema
const validationSchema = Yup.object({
  basicInfo: Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .min(3, 'Name must be at least 3 characters')
      .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    contactNumber: Yup.string()
      .required('Contact number is required')
      .matches(/^\+[1-9]\d{1,14}$/, 'Enter valid international format (e.g., +123456789)'),
    email: Yup.string()
      .required('Email address is required')
      .email('Invalid email format'),
    medicalNeeds: Yup.string(),
    idDocument: Yup.mixed()
      .required('ID document is required')
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return true; // Let required handle null/undefined
        return value.size <= 5000000; // 5MB limit
      })
      .test('fileType', 'Unsupported file format', (value) => {
        if (!value) return true;
        return ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type);
      })
  }),
  housingInfo: Yup.object({
    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters'),
    housingCondition: Yup.string()
      .required('Housing condition is required')
      .oneOf(['owned', 'rented', 'temporary', 'homeless', 'shelter'], 'Invalid housing condition'),
    monthlyIncome: Yup.number()
      .required('Monthly income is required')
      .min(0, 'Must be a positive number')
      .typeError('Monthly income must be a number'),
    monthlyNeed: Yup.number()
      .required('Monthly need is required')
      .min(0, 'Must be a positive number')
      .typeError('Monthly need must be a number')
  }),
  cryptoWallet: Yup.string()
    .required('Wallet address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
});

const familyMemberSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .max(120, 'Invalid age')
    .typeError('Age must be a number'),
  relationship: Yup.string()
    .required('Relationship is required')
    .min(2, 'Please specify the relationship'),
  medicalNeeds: Yup.string()
    .required('Medical needs are required if any'),
  isDependent: Yup.boolean().required('Is dependent is required'),
  isDisabled: Yup.boolean().required('Is disabled is required'),
  idDocument: Yup.mixed()
    .required('ID document is required')
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;
      return value.size <= 5000000;
    })
    .test('fileType', 'Only PDF, JPG, PNG files are allowed', (value) => {
      if (!value) return true;
      return ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type);
    })
});

const FamilyApplicationPage = () => {
  const { auth } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNoFamilyModal, setShowNoFamilyModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  // Check authentication on mount
  // useEffect(() => {
  //   if (!auth.user?.id) {
  //     toast.error('Please login to submit an application');
  //     // Optionally redirect to login page
  //     // navigate('/login');
  //   }
  // }, [auth]);

  // Add this useEffect at the top of your component
useEffect(() => {
  const checkFormCompletion = async () => {
    if (currentStep > 1) {
      // Check if first step is completed
      const isFirstStepComplete = Object.keys(formik.values.basicInfo).every(
        key => formik.values.basicInfo[key]
      ) && Object.keys(formik.values.housingInfo).every(
        key => formik.values.housingInfo[key]
      ) && formik.values.cryptoWallet;

      if (!isFirstStepComplete) {
        toast.error('Please complete the first step before proceeding');
        setCurrentStep(1);
      }
    }
  };

  checkFormCompletion();
}, [currentStep]);

  // Define handleFormSubmit before using it in useFormik
  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // if (!auth?.user?.id) {
      //   toast.error('User not authenticated');
      //   return;
      // }

      const formData = new FormData();

      // Prepare familyMembersList with idDocument metadata
     const processedFamilyMembers = familyMembers.map((member, index) => {
  if (member.idDocument instanceof File) {
    formData.append(`familyMembersList[${index}].idDocument`, member.idDocument);
  }

  return {
    fullName: member.fullName,
    age: parseInt(member.age),
    relationship: member.relationship,
    medicalNeeds: member.medicalNeeds ? [member.medicalNeeds] : [],
    isDepended: Boolean(member.isDependent),
    idDocument: member.idDocument ? member.idDocument.name : null // Optional: store filename or null
  };
});

      // Append structured data
      formData.append('user', auth.user._id);
      formData.append('status', 'pending');
      formData.append('fullName', values.basicInfo.fullName);
      formData.append('location', values.housingInfo.location);
      formData.append('housingCondition', values.housingInfo.housingCondition);
      formData.append('monthlyIncome', values.housingInfo.monthlyIncome);
      formData.append('monthlyNeed', values.housingInfo.monthlyNeed);
      formData.append('contactNumber', values.basicInfo.contactNumber);
      formData.append('emailAddress', values.basicInfo.email);
      formData.append('description', values.basicInfo.medicalNeeds || '');
      formData.append('cryptoWallet', JSON.stringify({
        address: values.cryptoWallet,
        network: 'ERC20',
        currency: 'USDT'
      }));
      formData.append('familyMembers', JSON.stringify({
        adults: familyMembers.filter(m => parseInt(m.age) >= 18 && parseInt(m.age) <= 65).length,
        children: familyMembers.filter(m => parseInt(m.age) < 18).length,
        infants: familyMembers.filter(m => parseInt(m.age) < 3).length,
        elderly: familyMembers.filter(m => parseInt(m.age) > 65).length,
        disabled: familyMembers.filter(m => m.isDisabled=== true).length
      }));
      formData.append('familyMembersList', JSON.stringify(processedFamilyMembers));

      // Append primary ID document
      if (values.basicInfo.idDocument instanceof File) {
        formData.append('idDocument', values.basicInfo.idDocument);
      }

      const response = await axios.post(
        'http://localhost:5000/api/v1/families',
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
        toast.success('Family application submitted successfully!');
      }
    } catch (error) {
      console.error('Submission error:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated formik initialization
  const formik = useFormik({
    initialValues: {
      basicInfo: {
        fullName: '',
        contactNumber: '',
        email: '',
        medicalNeeds: '',
        idDocument: null
      },
      housingInfo: {
        location: '',
        housingCondition: '',
        monthlyIncome: '',
        monthlyNeed: ''
      },
      cryptoWallet: '',
      confirmAccuracy: false
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleFormSubmit
  });

  // Add step validation
  const validateStep = async () => {
    try {
      if (currentStep === 1) {
        await validationSchema.validate(formik.values, { abortEarly: false });
      } else if (currentStep === 2 && familyMembers.length > 0) {
        // Validate family members
        for (const member of familyMembers) {
          if (!member.fullName || !member.age || !member.relationship) {
            throw new Error('Please complete all required fields for family members');
          }
        }
      }
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error.inner) {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setFieldErrors(newErrors);
      }
      toast.error(error.message || 'Please check the form for errors');
      return false;
    }
  };

  // Update handleNext to use validation
  const handleNext = async () => {
  try {
    // For Step 1 (Basic Information)
    if (currentStep === 1) {
      // Mark all fields as touched to trigger validation
      await formik.setTouched({
        basicInfo: {
          fullName: true,
          contactNumber: true,
          email: true,
          idDocument: true,
          medicalNeeds: true
        },
        housingInfo: {
          location: true,
          housingCondition: true,
          monthlyIncome: true,
          monthlyNeed: true
        },
        cryptoWallet: true
      }, true);

      // Validate the form
      await formik.validateForm();

      // Check for specific section errors
      const hasBasicInfoErrors = Object.keys(formik.errors.basicInfo || {}).length > 0;
      const hasHousingInfoErrors = Object.keys(formik.errors.housingInfo || {}).length > 0;
      const hasCryptoWalletError = formik.errors.cryptoWallet;

      if (hasBasicInfoErrors || hasHousingInfoErrors || hasCryptoWalletError) {
        // Show specific error messages for each section
        if (hasBasicInfoErrors) {
          toast.error('Please complete all required fields in Basic Information');
        }
        if (hasHousingInfoErrors) {
          toast.error('Please complete all required fields in Housing Information');
        }
        if (hasCryptoWalletError) {
          toast.error('Please provide a valid crypto wallet address');
        }

        // Scroll to the first error
        const firstErrorElement = document.querySelector('.text-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    // For Step 2 (Family Members)
    if (currentStep === 2) {
      // Validate family members
      const newErrors = {};
      let hasErrors = false;

      // Check if there are any family members to validate
      if (familyMembers.length === 0) {
        setShowNoFamilyModal(true);
        return;
      }

      // Validate each family member
      for (let i = 0; i < familyMembers.length; i++) {
        const member = familyMembers[i];
        try {
          await familyMemberSchema.validate(member, { abortEarly: false });
        } catch (err) {
          hasErrors = true;
          // Check if err.inner exists before using forEach
          if (err.inner && Array.isArray(err.inner)) {
            err.inner.forEach((error) => {
              newErrors[`member${i}_${error.path}`] = error.message;
            });
          } else {
            // Fallback error handling
            newErrors[`member${i}_error`] = 'Invalid form data';
          }
        }
      }

      if (hasErrors) {
        setFieldErrors(newErrors);
        toast.error('Please complete all required fields for family members');
        // Scroll to first error
        const firstErrorElement = document.querySelector('.text-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    // Existing validation for other steps
     

    // If no errors, proceed to next step
    setCurrentStep(prev => Math.min(prev + 1, 3));
  } catch (error) {
    console.error('Validation error:', error);
    toast.error('Please check the form for errors');
  }
};

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddFamilyMember = () => {
    setFamilyMembers(prev => [...prev, {
      fullName: '',
      age: '',
      relationship: '',
      medicalNeeds: '',
      isDependent: false,
      idDocument: null
    }]);
  };

  const handleRemoveFamilyMember = (index) => {
    setFamilyMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFamilyMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
  };

  const handleAddSocialMedia = () => {
    setSocialMediaLinks(prev => [...prev, { platform: '', url: '' }]);
  };

  const handleRemoveSocialMedia = (index) => {
    setSocialMediaLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSocialMediaChange = (index, field, value) => {
    setSocialMediaLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const handleEdit = (step) => {
    setCurrentStep(step);
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
     <div className="mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Family Application
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

      <ProgressBar currentStep={currentStep} />

      <form onSubmit={formik.handleSubmit}>
        {currentStep === 1 && (
          <PrimaryApplicantForm
            formik={formik}
            socialMediaLinks={socialMediaLinks}
            onSocialMediaChange={handleSocialMediaChange}
            onAddSocialMedia={handleAddSocialMedia}
            onRemoveSocialMedia={handleRemoveSocialMedia}
          />
        )}

        {currentStep === 2 && (
          <FamilyMemberForm
            familyMembers={familyMembers}
            onAdd={handleAddFamilyMember}
            onRemove={handleRemoveFamilyMember}
            onChange={handleFamilyMemberChange}
            fieldErrors={fieldErrors}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            formik={formik}
            familyMembers={familyMembers}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            onEdit={handleEdit}
          />
        )}

        <NavigationButtons
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isSubmitting={isSubmitting}
        />
      </form>

      <NoFamilyModal
        isOpen={showNoFamilyModal}
        onConfirm={() => {
          setShowNoFamilyModal(false);
          setCurrentStep(3);
        }}
        onCancel={() => setShowNoFamilyModal(false)}
      />
    </div>
  );
};

export default FamilyApplicationPage;