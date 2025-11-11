import React, { useState } from 'react';
import { ArrowLeft, FileText, Phone, Mail, AlertCircle, Shield } from 'lucide-react';
import '../styles/PatientDetail.css';

const PatientDetailPage = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState('clinical-history');

  // Default patient data if none provided
  const patientData = patient || {
    id: 'P20250002',
    name: 'James Martinez',
    status: 'active',
    age: 47,
    dob: 'Jul 21, 1978',
    gender: 'Male',
    bloodType: 'A+',
    phone: '(555) 234-5678',
    email: 'james.martinez@email.com',
    emergencyContact: {
      name: 'Maria Martinez',
      phone: '(555) 234-5679'
    },
    allergies: ['Latex'],
    chronicConditions: ['Type 2 Diabetes', 'High Cholesterol'],
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET987654321'
    },
    clinicalNotes: []
  };

  const tabs = [
    { id: 'clinical-history', label: 'Clinical History' },
    { id: 'tasks', label: 'Tasks', count: 0 },
    { id: 'appointments', label: 'Appointments' },
    { id: 'referrals', label: 'Referrals' },
    { id: 'ai-insights', label: 'AI Insights' }
  ];

  return (
    <div className="patient-detail-page">
      {/* Header */}
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="patient-header-info">
          <div className="patient-title-row">
            <h1 className="patient-name">{patientData.name}</h1>
            <span className="status-badge active">{patientData.status}</span>
          </div>
          <p className="patient-id">Patient ID: {patientData.id}</p>
        </div>
        <button className="new-note-button">
          <FileText className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Patient Info Cards */}
      <div className="patient-info-grid">
        {/* Demographics */}
        <div className="info-card">
          <h3 className="info-card-title">
            <span className="icon-circle blue">👤</span>
            Demographics
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Age</span>
              <span className="info-value">{patientData.age} years</span>
            </div>
            <div className="info-item">
              <span className="info-label">DOB</span>
              <span className="info-value">{patientData.dob}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{patientData.gender}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Blood Type</span>
              <span className="blood-type-badge">{patientData.bloodType}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-card">
          <h3 className="info-card-title">
            <Phone className="w-5 h-5 text-cyan-600" />
            Contact Information
          </h3>
          <div className="contact-info">
            <div className="contact-item">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{patientData.phone}</span>
            </div>
            <div className="contact-item">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{patientData.email}</span>
            </div>
            <div className="emergency-contact">
              <p className="emergency-label">Emergency Contact</p>
              <p className="emergency-name">{patientData.emergencyContact.name}</p>
              <p className="emergency-phone">{patientData.emergencyContact.phone}</p>
            </div>
          </div>
        </div>

        {/* Medical Alerts */}
        <div className="info-card">
          <h3 className="info-card-title">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Medical Alerts
          </h3>
          
          <div className="alert-section allergies">
            <p className="alert-section-title">ALLERGIES</p>
            {patientData.allergies.map((allergy, i) => (
              <span key={i} className="alert-tag allergy-tag">{allergy}</span>
            ))}
          </div>

          <div className="alert-section conditions">
            <p className="alert-section-title">CHRONIC CONDITIONS</p>
            <div className="condition-tags">
              {patientData.chronicConditions.map((condition, i) => (
                <span key={i} className="alert-tag condition-tag">{condition}</span>
              ))}
            </div>
          </div>

          <div className="alert-section insurance">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="insurance-label">Insurance</span>
            <p className="insurance-provider">{patientData.insurance.provider}</p>
            <p className="insurance-policy">{patientData.insurance.policyNumber}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            {tab.count !== undefined && <span className="tab-count">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'clinical-history' && (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <h3>No Clinical Notes</h3>
            <p>No documentation available for this patient yet.</p>
          </div>
        )}
        {activeTab === 'tasks' && (
          <div className="empty-state">
            <p>No tasks assigned to this patient.</p>
          </div>
        )}
        {activeTab === 'appointments' && (
          <div className="empty-state">
            <p>No upcoming appointments.</p>
          </div>
        )}
        {activeTab === 'referrals' && (
          <div className="empty-state">
            <p>No referrals on file.</p>
          </div>
        )}
        {activeTab === 'ai-insights' && (
          <div className="empty-state">
            <p>AI insights will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailPage;