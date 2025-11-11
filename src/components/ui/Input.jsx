/**
 * Input.jsx - Reusable Input Component
 * 
 * A flexible input component with built-in validation and error handling.
 * Used throughout forms in the application.
 * 
 * Integration:
 * - Import in NewPatient.jsx, NoteEditor.jsx, and other forms
 * - Provides consistent styling and validation UX
 * 
 * Example:
 * <Input
 *   label="First Name"
 *   value={firstName}
 *   onChange={(e) => setFirstName(e.target.value)}
 *   error={errors.firstName}
 *   required
 * />
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}
            ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}
            hover:border-slate-400
          `}
          {...props}
        />
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2.5 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          transition-all duration-200 resize-none
          ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}
          ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}
          hover:border-slate-400
        `}
        {...props}
      />
      
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const Select = ({
  label,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}
          ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}
          hover:border-slate-400
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;