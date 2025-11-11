/**
 * validators.js - Data Validation Utilities
 * 
 * This module provides validation functions for form inputs and data integrity.
 * Used in forms and data processing throughout the application.
 * 
 * Integration: Import these functions in forms and data processing
 * Example: import { validateEmail, validatePhone } from './utils/validators';
 */

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate phone number (US format)
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'Phone number must be 10 digits' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDateOfBirth = (dob) => {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' };
  }
  const date = new Date(dob);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (date >= now) {
    return { isValid: false, error: 'Date of birth must be in the past' };
  }
  
  const age = now.getFullYear() - date.getFullYear();
  if (age > 150) {
    return { isValid: false, error: 'Invalid date of birth' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

/**
 * Validate blood type
 * @param {string} bloodType - Blood type to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateBloodType = (bloodType) => {
  if (!bloodType) {
    return { isValid: false, error: 'Blood type is required' };
  }
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodTypes.includes(bloodType.toUpperCase())) {
    return { isValid: false, error: 'Invalid blood type' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate insurance policy number
 * @param {string} policyNumber - Policy number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePolicyNumber = (policyNumber) => {
  if (!policyNumber) {
    return { isValid: false, error: 'Policy number is required' };
  }
  if (policyNumber.length < 5) {
    return { isValid: false, error: 'Policy number must be at least 5 characters' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate patient form data
 * @param {object} patientData - Patient data object
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validatePatientForm = (patientData) => {
  const errors = {};
  
  // Validate first name
  const firstNameValidation = validateRequired(patientData.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error;
  }
  
  // Validate last name
  const lastNameValidation = validateRequired(patientData.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }
  
  // Validate date of birth
  const dobValidation = validateDateOfBirth(patientData.dateOfBirth);
  if (!dobValidation.isValid) {
    errors.dateOfBirth = dobValidation.error;
  }
  
  // Validate email
  if (patientData.email) {
    const emailValidation = validateEmail(patientData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }
  }
  
  // Validate phone
  if (patientData.phone) {
    const phoneValidation = validatePhone(patientData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }
  }
  
  // Validate blood type
  if (patientData.bloodType) {
    const bloodTypeValidation = validateBloodType(patientData.bloodType);
    if (!bloodTypeValidation.isValid) {
      errors.bloodType = bloodTypeValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate clinical note
 * @param {object} noteData - Clinical note data
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateClinicalNote = (noteData) => {
  const errors = {};
  
  const patientIdValidation = validateRequired(noteData.patientId, 'Patient ID');
  if (!patientIdValidation.isValid) {
    errors.patientId = patientIdValidation.error;
  }
  
  const contentValidation = validateRequired(noteData.content, 'Note content');
  if (!contentValidation.isValid) {
    errors.content = contentValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize string input (prevent XSS)
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate and sanitize form data
 * @param {object} formData - Form data object
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};