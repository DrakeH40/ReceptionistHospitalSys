/**
 * formatters.js - Data Formatting Utilities
 * 
 * This module provides consistent formatting functions across the application.
 * Used throughout the UI to display dates, names, phone numbers, etc.
 * 
 * Integration: Import these functions anywhere you need to display formatted data
 * Example: import { formatDate, formatPhone } from './utils/formatters';
 */

/**
 * Format date to readable long format
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - "Wednesday, January 15, 2025"
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const dateObj = date instanceof Date ? date : new Date(date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Format date to short format
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - "Jan 15, 2025"
 */
export const formatShortDate = (date) => {
  if (!date) return 'N/A';
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Format date to time
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - "2:30 PM"
 */
export const formatTime = (date) => {
  if (!date) return 'N/A';
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

/**
 * Calculate age from date of birth
 * @param {Date|string} dob - Date of birth
 * @returns {number} - Age in years
 */
export const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Get initials from first and last name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} - "JD"
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return '??';
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

/**
 * Format full name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} - "John Doe"
 */
export const formatFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} - "(555) 123-4567"
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Format patient ID
 * @param {string} id - Patient ID
 * @returns {string} - "P-2025-0001"
 */
export const formatPatientId = (id) => {
  if (!id) return 'N/A';
  // If already formatted, return as is
  if (id.includes('-')) return id;
  // Format as P-YYYY-NNNN
  const match = id.match(/P(\d{4})(\d+)/);
  if (match) {
    return `P-${match[1]}-${match[2].padStart(4, '0')}`;
  }
  return id;
};

/**
 * Format blood type
 * @param {string} bloodType - Blood type
 * @returns {string} - Formatted blood type
 */
export const formatBloodType = (bloodType) => {
  if (!bloodType) return 'Unknown';
  return bloodType.toUpperCase();
};

/**
 * Get status badge color
 * @param {string} status - Status string
 * @returns {object} - Object with bg and text color classes
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: { bg: 'bg-green-100', text: 'text-green-700' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-700' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
    scheduled: { bg: 'bg-purple-100', text: 'text-purple-700' },
  };
  return statusColors[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

/**
 * Get severity badge color
 * @param {string} severity - Severity level
 * @returns {object} - Object with bg and text color classes
 */
export const getSeverityColor = (severity) => {
  const severityColors = {
    mild: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    moderate: { bg: 'bg-orange-100', text: 'text-orange-700' },
    severe: { bg: 'bg-red-100', text: 'text-red-700' },
    life_threatening: { bg: 'bg-red-200', text: 'text-red-900' },
  };
  return severityColors[severity?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatShortDate(dateObj);
};