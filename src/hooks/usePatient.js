/**
 * usePatient.js - Custom Hook for Single Patient Management
 * 
 * This hook manages the state and operations for a single patient.
 * It provides methods to load, update, and manage patient data.
 * 
 * Integration:
 * - Import in PatientProfile.jsx or any component that needs patient data
 * - Replaces direct databaseService calls with a cleaner API
 * 
 * Example:
 * const { patient, loading, error, updatePatient, addAllergy } = usePatient(patientId);
 */

import { useState, useEffect, useCallback } from 'react';
import dbService from '../services/databaseService';

export const usePatient = (patientId) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load patient data from database
   */
  const loadPatient = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dbService.getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading patient:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  /**
   * Update patient information
   * @param {object} updates - Fields to update
   */
  const updatePatient = async (updates) => {
    try {
      const updated = await dbService.updatePatient(patientId, updates);
      setPatient(prev => ({ ...prev, ...updated }));
      return { success: true, data: updated };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Add allergy to patient
   * @param {object} allergyData - Allergy information
   */
  const addAllergy = async (allergyData) => {
    try {
      const newAllergy = await dbService.addAllergy({
        ...allergyData,
        patientId
      });
      setPatient(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy]
      }));
      return { success: true, data: newAllergy };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Remove allergy from patient
   * @param {number} allergyId - Allergy ID to remove
   */
  const removeAllergy = async (allergyId) => {
    try {
      await dbService.removeAllergy(allergyId);
      setPatient(prev => ({
        ...prev,
        allergies: prev.allergies.filter(a => a.id !== allergyId)
      }));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Add chronic condition to patient
   * @param {object} conditionData - Condition information
   */
  const addChronicCondition = async (conditionData) => {
    try {
      const newCondition = await dbService.addChronicCondition({
        ...conditionData,
        patientId
      });
      setPatient(prev => ({
        ...prev,
        chronicConditions: [...(prev.chronicConditions || []), newCondition]
      }));
      return { success: true, data: newCondition };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Create clinical note for patient
   * @param {object} noteData - Note information
   */
  const createClinicalNote = async (noteData) => {
    try {
      const newNote = await dbService.createClinicalNote({
        ...noteData,
        patientId
      });
      setPatient(prev => ({
        ...prev,
        clinicalNotes: [...(prev.clinicalNotes || []), newNote]
      }));
      return { success: true, data: newNote };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Create task for patient
   * @param {object} taskData - Task information
   */
  const createTask = async (taskData) => {
    try {
      const newTask = await dbService.createTask({
        ...taskData,
        patientId
      });
      setPatient(prev => ({
        ...prev,
        tasks: [...(prev.tasks || []), newTask]
      }));
      return { success: true, data: newTask };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Update task status
   * @param {number} taskId - Task ID
   * @param {object} updates - Fields to update
   */
  const updateTask = async (taskId, updates) => {
    try {
      const updated = await dbService.updateTask(taskId, updates);
      setPatient(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? updated : t)
      }));
      return { success: true, data: updated };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Create appointment for patient
   * @param {object} appointmentData - Appointment information
   */
  const createAppointment = async (appointmentData) => {
    try {
      const newAppointment = await dbService.createAppointment({
        ...appointmentData,
        patientId
      });
      setPatient(prev => ({
        ...prev,
        appointments: [...(prev.appointments || []), newAppointment]
      }));
      return { success: true, data: newAppointment };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Create referral for patient
   * @param {object} referralData - Referral information
   */
  const createReferral = async (referralData) => {
    try {
      const newReferral = await dbService.createReferral({
        ...referralData,
        patientId
      });
      setPatient(prev => ({
        ...prev,
        referrals: [...(prev.referrals || []), newReferral]
      }));
      return { success: true, data: newReferral };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Load patient data when patientId changes
  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  return {
    patient,
    loading,
    error,
    reload: loadPatient,
    updatePatient,
    addAllergy,
    removeAllergy,
    addChronicCondition,
    createClinicalNote,
    createTask,
    updateTask,
    createAppointment,
    createReferral
  };
};

export default usePatient;