/**
 * usePatients.js - Custom Hook for Patients List Management
 * 
 * This hook manages the state and operations for multiple patients.
 * It provides methods to load, search, create, and delete patients.
 * 
 * Integration:
 * - Import in Patients.jsx, Dashboard.jsx, or any component showing patient lists
 * - Provides centralized patient list management
 * 
 * Example:
 * const { patients, loading, searchPatients, createPatient } = usePatients();
 */

import { useState, useEffect, useCallback } from 'react';
import dbService from '../services/databaseService';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Load all patients from database
   */
  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dbService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search patients by query
   * @param {string} query - Search query
   */
  const searchPatients = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query || query.trim() === '') {
      setFilteredPatients(patients);
      return;
    }

    try {
      const results = await dbService.searchPatients(query);
      setFilteredPatients(results);
    } catch (err) {
      setError(err.message);
      console.error('Error searching patients:', err);
    }
  }, [patients]);

  /**
   * Filter patients locally (client-side)
   * @param {function} filterFn - Filter function
   */
  const filterPatients = useCallback((filterFn) => {
    const filtered = patients.filter(filterFn);
    setFilteredPatients(filtered);
  }, [patients]);

  /**
   * Create new patient
   * @param {object} patientData - Patient information
   */
  const createPatient = async (patientData) => {
    try {
      const newPatient = await dbService.createPatient(patientData);
      setPatients(prev => [...prev, newPatient]);
      setFilteredPatients(prev => [...prev, newPatient]);
      return { success: true, data: newPatient };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Update patient
   * @param {string} patientId - Patient ID
   * @param {object} updates - Fields to update
   */
  const updatePatient = async (patientId, updates) => {
    try {
      const updated = await dbService.updatePatient(patientId, updates);
      setPatients(prev => prev.map(p => p.id === patientId ? updated : p));
      setFilteredPatients(prev => prev.map(p => p.id === patientId ? updated : p));
      return { success: true, data: updated };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Delete patient
   * @param {string} patientId - Patient ID
   */
  const deletePatient = async (patientId) => {
    try {
      await dbService.deletePatient(patientId);
      setPatients(prev => prev.filter(p => p.id !== patientId));
      setFilteredPatients(prev => prev.filter(p => p.id !== patientId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Get patient by ID
   * @param {string} patientId - Patient ID
   */
  const getPatientById = useCallback((patientId) => {
    return patients.find(p => p.id === patientId);
  }, [patients]);

  /**
   * Get active patients count
   */
  const getActiveCount = useCallback(() => {
    return patients.filter(p => p.status === 'active').length;
  }, [patients]);

  /**
   * Get patients by status
   * @param {string} status - Patient status
   */
  const getPatientsByStatus = useCallback((status) => {
    return patients.filter(p => p.status === status);
  }, [patients]);

  /**
   * Get recent patients (last N patients)
   * @param {number} limit - Number of patients to return
   */
  const getRecentPatients = useCallback((limit = 5) => {
    return [...patients]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }, [patients]);

  /**
   * Sort patients by field
   * @param {string} field - Field to sort by
   * @param {string} order - Sort order ('asc' or 'desc')
   */
  const sortPatients = useCallback((field, order = 'asc') => {
    const sorted = [...filteredPatients].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    setFilteredPatients(sorted);
  }, [filteredPatients]);

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  return {
    // State
    patients: filteredPatients,
    allPatients: patients,
    loading,
    error,
    searchQuery,
    
    // Actions
    reload: loadPatients,
    searchPatients,
    filterPatients,
    createPatient,
    updatePatient,
    deletePatient,
    sortPatients,
    
    // Getters
    getPatientById,
    getActiveCount,
    getPatientsByStatus,
    getRecentPatients
  };
};

export default usePatients;