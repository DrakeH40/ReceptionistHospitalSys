/**
 * Patients.jsx - Patient Directory Page
 * Shows list of all patients with search functionality
 */
import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Plus, Search } from 'lucide-react';

const Patients = ({ patients, onPatientClick, onRefresh, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  // Filter patients when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const getInitials = (firstName, lastName) => `${firstName[0]}${lastName[0]}`;
  
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading patients...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Patient Directory</h1>
            <p className="text-slate-600">Manage and view all patient records</p>
          </div>
          <button className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Patient Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onPatientClick(patient)}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold text-xl">
                  {getInitials(patient.firstName, patient.lastName)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-slate-500">ID: {patient.id}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {patient.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  {calculateAge(patient.dateOfBirth)} years old
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText className="w-4 h-4" />
                  {patient.phone}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No patients found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;