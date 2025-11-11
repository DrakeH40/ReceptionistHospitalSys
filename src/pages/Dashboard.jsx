/**
 * Dashboard.jsx - Main Dashboard Page
 * 
 * Overview page showing key statistics and recent activity.
 * 
 * Props:
 * - patients: array - List of all patients
 * - stats: object - Statistics (patient count, notes, etc.)
 * - onPatientClick: function - Called when user clicks a patient
 * - loading: boolean - Whether data is still loading
 * 
 * Used by: ClinicalDashboard.jsx
 * Uses: 
 * - StatsCard component (displays stat cards)
 * - RecentPatients component (displays patient list)
 * 
 * Data Flow:
 * ClinicalDashboard → Dashboard (receives props) → Displays data
 */

import React from 'react';
import { Calendar, Users, FileText, AlertCircle, Activity } from 'lucide-react';

const Dashboard = ({ patients, stats, onPatientClick, loading }) => {
  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  /**
   * Formats date to readable string
   * Example: "Wednesday, January 15, 2025"
   */
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * Gets initials from first and last name
   * Example: "John Doe" → "JD"
   */
  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  /**
   * Formats date to short format
   * Example: "Jan 15"
   */
  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER DASHBOARD
  // ============================================
  
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Clinical Dashboard
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(new Date())}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Patients"
            value={stats?.activePatients || 0}
            icon={Users}
            iconBg="bg-blue-500"
            trend="+12% this month"
          />
          <StatsCard
            title="Notes Today"
            value={stats?.totalClinicalNotes || 0}
            icon={FileText}
            iconBg="bg-green-500"
            trend={`${stats?.aiGeneratedNotes || 0} AI-generated`}
          />
          <StatsCard
            title="Pending Tasks"
            value={stats?.pendingTasks || 0}
            icon={AlertCircle}
            iconBg="bg-orange-500"
            trend="Requires attention"
          />
          <StatsCard
            title="Workflows"
            value="3"
            icon={Activity}
            iconBg="bg-purple-500"
            trend="Templates available"
          />
        </div>

        {/* Recent Patients Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            Recent Patients
          </h2>
          
          <div className="space-y-2">
            {patients.slice(0, 5).map((patient) => (
              <div
                key={patient.id}
                onClick={() => onPatientClick(patient)}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {/* Patient Avatar */}
                <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                  {getInitials(patient.firstName, patient.lastName)}
                </div>
                
                {/* Patient Info */}
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{patient.id}</p>
                </div>
                
                {/* Date Added */}
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Added {formatShortDate(patient.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * StatsCard Component
 * 
 * Displays a single statistic with icon and trend
 * 
 * Props:
 * - title: string - Card title
 * - value: number - Main stat value
 * - icon: Component - Lucide icon component
 * - iconBg: string - Tailwind background color class
 * - trend: string - Trend text
 */
const StatsCard = ({ title, value, icon: Icon, iconBg, trend }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="p-6">
      <div className="flex items-start justify-between">
        {/* Left side - text */}
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          <p className="text-xs text-slate-500">{trend}</p>
        </div>
        
        {/* Right side - icon */}
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
    
    {/* Bottom gradient bar */}
    <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
  </div>
);

export default Dashboard;