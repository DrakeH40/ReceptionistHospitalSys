import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Phone, Mail, AlertCircle, Shield } from 'lucide-react';
import dbService from '../services/databaseService';

const PatientProfile = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      const data = await dbService.getPatientById(patientId);
      setPatient(data);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading patient...</div>;
  }

  if (!patient) {
    return <div className="p-6 text-center text-red-600">Patient not found</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-2">{patient.firstName} {patient.lastName}</h1>
          <p className="text-slate-600">Patient ID: {patient.id}</p>
          
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Demographics</h3>
              <p className="text-sm">DOB: {patient.dateOfBirth}</p>
              <p className="text-sm">Gender: {patient.gender}</p>
              <p className="text-sm">Blood Type: {patient.bloodType}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm">{patient.phone}</p>
              <p className="text-sm">{patient.email}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Insurance</h3>
              <p className="text-sm">{patient.insuranceProvider}</p>
              <p className="text-sm">{patient.insurancePolicyNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;