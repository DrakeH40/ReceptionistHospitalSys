/**
 * Navbar.jsx - Top Navigation Bar Component
 * 
 * Displays the main navigation menu at the top of the application.
 * 
 * Props:
 * - currentPage: string - ID of the currently active page
 * - onNavigate: function - Called when user clicks a navigation item
 * 
 * Used by: ClinicalDashboard.jsx
 * 
 * Features:
 * - Logo and branding
 * - Navigation buttons (Dashboard, Patients, Documentation, etc.)
 * - User profile display
 * - Active page highlighting
 */

import React from 'react';
import { Activity, LayoutDashboard, Users, FileText, GitBranch, Shield } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'workflows', label: 'Workflows', icon: GitBranch },
    { id: 'admin', label: 'Admin Panel', icon: Shield },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">MediFlow AI</h1>
              <p className="text-xs text-slate-500">Clinical Documentation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Drake Helm</p>
              <p className="text-xs text-slate-500">storyman104@...</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
              D
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;