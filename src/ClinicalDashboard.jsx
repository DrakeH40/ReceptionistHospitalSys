/**
 * ClinicalDashboard.jsx - Main Application Controller (ENHANCED)
 * 
 * Fully functional main controller with:
 * - Working "New Patient" modal
 * - Working "New Note" modal
 * - Proper state management
 * - Database integration
 * - All pages functional
 * 
 * Changes from original:
 * - Added modal state management
 * - Added NewPatient modal
 * - Added NewNote functionality (redirects to Documentation)
 * - All CRUD operations save to database
 */

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

// Import services
import dbService from './services/databaseService';

// Import pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Documentation from './pages/Documentation'; // Use enhanced version
import Workflows from './pages/Workflows'; // Use enhanced version
import AdminDashboard from './pages/AdminDashboard'; // Use enhanced version

// Import layout components
import Navbar from './components/layout/Navbar';
import QuickActionsSidebar from './components/layout/QuickActionsSidebar';

// Import UI components
import Modal from './components/ui/Modal';
import NewPatient from './pages/NewPatient';

const ClinicalDashboard = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Data state
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  // ============================================
  // DATA LOADING
  // ============================================
  
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load all data from database
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const patientsData = await dbService.getAllPatients();
      const statsData = await dbService.getStatistics();
      
      setPatients(patientsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  
  /**
   * Handle patient selection
   */
  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setCurrentPage('patient-profile');
  };

  /**
   * Handle back from patient profile
   */
  const handleBackFromPatient = () => {
    setSelectedPatient(null);
    setCurrentPage('patients');
  };

  /**
   * Handle page navigation
   */
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    setSelectedPatient(null);
  };

  // ============================================
  // QUICK ACTION HANDLERS
  // ============================================
  
  /**
   * Handle "New Patient" button click
   */
  const handleNewPatient = () => {
    setShowNewPatientModal(true);
  };

  /**
   * Handle successful patient creation
   */
  const handlePatientCreated = async (newPatient) => {
    // Reload data to include new patient
    await loadData();
    
    // Close modal
    setShowNewPatientModal(false);
    
    // Optional: Navigate to new patient's profile
    if (newPatient) {
      setSelectedPatient(newPatient);
      setCurrentPage('patient-profile');
    }
  };

  /**
   * Handle "New Note" button click
   */
  const handleNewNote = () => {
    // Navigate to Documentation page
    setCurrentPage('documentation');
  };

  // ============================================
  // RENDER PATIENT PROFILE
  // ============================================
  
  if (currentPage === 'patient-profile' && selectedPatient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar currentPage={currentPage} onNavigate={handlePageChange} />
        
        <PatientProfile 
          patientId={selectedPatient.id} 
          onBack={handleBackFromPatient}
        />
      </div>
    );
  }

  // ============================================
  // RENDER MAIN APPLICATION
  // ============================================
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation bar */}
      <Navbar currentPage={currentPage} onNavigate={handlePageChange} />
      
      {/* Quick actions sidebar */}
      <QuickActionsSidebar 
        onNewPatient={handleNewPatient}
        onNewNote={handleNewNote}
      />
      
      {/* Main content area */}
      <main className="ml-0">
        {currentPage === 'dashboard' && (
          <Dashboard 
            patients={patients}
            stats={stats}
            onPatientClick={handlePatientClick}
            loading={loading}
          />
        )}
        
        {currentPage === 'patients' && (
          <Patients 
            patients={patients}
            onPatientClick={handlePatientClick}
            onRefresh={loadData}
            loading={loading}
          />
        )}
        
        {currentPage === 'documentation' && (
          <Documentation patients={patients} />
        )}
        
        {currentPage === 'workflows' && (
          <Workflows />
        )}
        
        {currentPage === 'admin' && (
          <AdminDashboard stats={stats} />
        )}
      </main>

      {/* New Patient Modal */}
      <Modal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        title="Create New Patient"
        size="lg"
      >
        <NewPatient 
          onSuccess={handlePatientCreated}
          onCancel={() => setShowNewPatientModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ClinicalDashboard;