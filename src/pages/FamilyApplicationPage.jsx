import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast'

// Import components
import NoFamilyModal from '../components/ family-application/ NoFamilyModal';
import ProgressBar from '../components/ family-application/ProgressBar';
import SuccessMessage from '../components/ family-application/SuccessMessage';
import PrimaryApplicantForm from '../components/ family-application/   PrimaryApplicantForm';
import FamilyMemberForm from '../components/ family-application/    FamilyMemberForm';
import ReviewStep from '../components/ family-application/  ReviewStep';
import NavigationButtons from '../components/ family-application/ NavigationButtons';

const FamilyApplicationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNoFamilyModal, setShowNoFamilyModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  // Define handleFormSubmit before using it in useFormik
  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful submission
      setIsSubmitted(true);

       
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      basicInfo: {
        fullName: '',
        contactNumber: '',
        email: '',
        medicalNeeds: '',
        idDocument: null,
        socialMediaLinks: []
      },
      housingInfo: {
        location: '',
        housingCondition: '',
        monthlyIncome: ''
      },
      cryptoWallet: '',
      confirmAccuracy: false,
      currentStep: 1
    },
    validationSchema: Yup.object({
      // Add your validation schema here
    }),
    onSubmit: handleFormSubmit
  });

  const handleNext = () => {
    if (currentStep === 2 && familyMembers.length === 0) {
      setShowNoFamilyModal(true);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
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
    <div className="max-w-full mx-auto py-8 px-4">
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