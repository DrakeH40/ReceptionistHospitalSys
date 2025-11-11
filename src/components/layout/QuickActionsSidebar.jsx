/**
 * QuickActionsSidebar.jsx - Quick Actions Sidebar (ENHANCED)
 * 
 * Sidebar with quick action buttons that trigger modals.
 * Properly integrated with parent component state.
 * 
 * Integration:
 * - Parent component manages modal state
 * - This component just triggers callbacks
 */

import React from 'react';
import { Plus, FileText } from 'lucide-react';

const QuickActionsSidebar = ({ onNewPatient, onNewNote }) => {
  return (
    <div className="fixed left-6 top-24 z-40 bg-white rounded-xl shadow-lg p-4 space-y-2">
      <p className="text-xs font-semibold text-slate-600 uppercase mb-3">
        Quick Actions
      </p>
      
      <button 
        onClick={onNewPatient}
        className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        title="Add New Patient"
      >
        <Plus className="w-4 h-4" />
        New Patient
      </button>
      
      <button 
        onClick={onNewNote}
        className="w-full bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium border border-slate-200 flex items-center justify-center gap-2"
        title="Create New Clinical Note"
      >
        <FileText className="w-4 h-4" />
        New Note
      </button>
    </div>
  );
};

export default QuickActionsSidebar;