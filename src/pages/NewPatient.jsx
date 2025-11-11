/**
 * NewPatient.jsx - New Patient Form Component
 * 
 * Complete form for adding new patients to the system.
 * Includes validation, error handling, and integration with databaseService.
 * 
 * Integration:
 * - Used in Modal from QuickActionsSidebar or Patients page
 * - Connects to: databaseService (create patient), validators, formatters
 * - Updates patient list in parent component after creation
 * 
 * Data Flow:
 * NewPatient → validates data → databaseService.createPatient() → updates UI
 * 
 * Example:
 * <Modal isOpen={showNewPatient} onClose={handleClose}>
 *   <NewPatient onSuccess={handleSuccess} onCancel={handleClose} />
 * </Modal>
 */

import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, Heart, Shield, AlertCircle } from 'lucide-react';
import { Input, Select, TextArea } from '../components/ui/Input';
import { validatePatientForm } from '../utils/validators';
import dbService from '../services/databaseService';

const NewPatient = ({ onSuccess, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    phone: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Handle input changes
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    const validation = validatePatientForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create patient in database
      const result = await dbService.createPatient(formData);
      
      if (result) {
        // Success! Call parent callback
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      setSubmitError(error.message || 'Failed to create patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'NY', label: 'New York' },
    { value: 'FL', label: 'Florida' },
    // Add more states as needed
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error Creating Patient</h4>
            <p className="text-sm text-red-700 mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Section: Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            required
            placeholder="John"
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            required
            placeholder="Doe"
          />
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            error={errors.dateOfBirth}
            required
            icon={Calendar}
          />
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            options={genderOptions}
            error={errors.gender}
            required
          />
        </div>
      </div>

      {/* Section: Medical Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Blood Type"
            value={formData.bloodType}
            onChange={(e) => handleChange('bloodType', e.target.value)}
            options={bloodTypeOptions}
            error={errors.bloodType}
          />
        </div>
      </div>

      {/* Section: Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-cyan-600" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="(555) 123-4567"
            icon={Phone}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            placeholder="john.doe@email.com"
            icon={Mail}
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main St"
            className="md:col-span-2"
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="San Francisco"
          />
          <Select
            label="State"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            options={stateOptions}
          />
          <Input
            label="ZIP Code"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            placeholder="94102"
          />
        </div>
      </div>

      {/* Section: Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name"
            value={formData.emergencyContactName}
            onChange={(e) => handleChange('emergencyContactName', e.target.value)}
            placeholder="Jane Doe"
          />
          <Input
            label="Emergency Contact Phone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
            placeholder="(555) 987-6543"
          />
        </div>
      </div>

      {/* Section: Insurance Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Insurance Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Insurance Provider"
            value={formData.insuranceProvider}
            onChange={(e) => handleChange('insuranceProvider', e.target.value)}
            placeholder="Blue Cross Blue Shield"
          />
          <Input
            label="Policy Number"
            value={formData.insurancePolicyNumber}
            onChange={(e) => handleChange('insurancePolicyNumber', e.target.value)}
            placeholder="ABC123456789"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            'Create Patient'
          )}
        </button>
      </div>
    </form>
  );
};

export default NewPatient;