// Database Service for MediFlow AI
// This simulates database operations using in-memory storage
// Replace with actual API calls to your backend when ready

class DatabaseService {
  constructor() {
    // Initialize in-memory database
    this.db = {
      patients: [
        {
          id: 'P20250002',
          firstName: 'James',
          lastName: 'Martinez',
          dateOfBirth: '1978-07-21',
          gender: 'Male',
          bloodType: 'A+',
          phone: '(555) 234-5678',
          email: 'james.martinez@email.com',
          emergencyContactName: 'Maria Martinez',
          emergencyContactPhone: '(555) 234-5679',
          insuranceProvider: 'Aetna',
          insurancePolicyNumber: 'AET987654321',
          status: 'active',
          createdAt: new Date('2025-01-07')
        },
        {
          id: 'P20250003',
          firstName: 'Emily',
          lastName: 'Chen',
          dateOfBirth: '1992-11-29',
          gender: 'Female',
          bloodType: 'O+',
          phone: '(555) 345-6789',
          email: 'emily.chen@email.com',
          emergencyContactName: 'David Chen',
          emergencyContactPhone: '(555) 345-6790',
          insuranceProvider: 'Blue Cross',
          insurancePolicyNumber: 'BC123456789',
          status: 'active',
          createdAt: new Date('2025-01-04')
        },
        {
          id: 'P20250001',
          firstName: 'Sarah',
          lastName: 'Johnson',
          dateOfBirth: '1985-03-14',
          gender: 'Female',
          bloodType: 'B+',
          phone: '(555) 123-4567',
          email: 'sarah.johnson@email.com',
          emergencyContactName: 'Michael Johnson',
          emergencyContactPhone: '(555) 123-4568',
          insuranceProvider: 'United Healthcare',
          insurancePolicyNumber: 'UHC987654321',
          status: 'active',
          createdAt: new Date('2025-01-09')
        }
      ],
      allergies: [
        { id: 1, patientId: 'P20250002', allergen: 'Latex', reaction: 'Skin rash, itching', severity: 'moderate', status: 'active' },
        { id: 2, patientId: 'P20250001', allergen: 'Penicillin', reaction: 'Hives, difficulty breathing', severity: 'severe', status: 'active' },
        { id: 3, patientId: 'P20250001', allergen: 'Shellfish', reaction: 'Anaphylaxis', severity: 'life_threatening', status: 'active' }
      ],
      chronicConditions: [
        { id: 1, patientId: 'P20250002', condition: 'Type 2 Diabetes', diagnosisDate: '2015-06-15', status: 'active' },
        { id: 2, patientId: 'P20250002', condition: 'High Cholesterol', diagnosisDate: '2018-03-22', status: 'active' }
      ],
      clinicalNotes: [],
      workflows: [
        {
          id: 1,
          name: 'Emergency Department Triage',
          description: 'Rapid assessment workflow for emergency department patients',
          category: 'emergency',
          steps: 4,
          checklistItems: 5,
          usageCount: 156
        },
        {
          id: 2,
          name: 'Annual Physical Examination',
          description: 'Standard workflow for routine annual health checkups',
          category: 'examination',
          steps: 5,
          checklistItems: 5,
          usageCount: 89
        },
        {
          id: 3,
          name: 'New Patient Intake',
          description: 'Comprehensive workflow for registering and onboarding new patients',
          category: 'intake',
          steps: 4,
          checklistItems: 5,
          usageCount: 45
        }
      ],
      tasks: [],
      appointments: [],
      referrals: [],
      auditLog: []
    };
  }

  // ============================================
  // PATIENT OPERATIONS
  // ============================================

  getAllPatients() {
    return Promise.resolve([...this.db.patients]);
  }

  getPatientById(patientId) {
    const patient = this.db.patients.find(p => p.id === patientId);
    if (!patient) {
      return Promise.reject(new Error('Patient not found'));
    }
    
    // Get related data
    const allergies = this.db.allergies.filter(a => a.patientId === patientId);
    const chronicConditions = this.db.chronicConditions.filter(c => c.patientId === patientId);
    const clinicalNotes = this.db.clinicalNotes.filter(n => n.patientId === patientId);
    const tasks = this.db.tasks.filter(t => t.patientId === patientId);
    const appointments = this.db.appointments.filter(a => a.patientId === patientId);
    const referrals = this.db.referrals.filter(r => r.patientId === patientId);

    return Promise.resolve({
      ...patient,
      allergies,
      chronicConditions,
      clinicalNotes,
      tasks,
      appointments,
      referrals
    });
  }

  createPatient(patientData) {
    const newPatient = {
      id: `P${Date.now()}`,
      ...patientData,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.db.patients.push(newPatient);
    this.logAudit('Patient', newPatient.id, 'CREATE', 'system');
    return Promise.resolve(newPatient);
  }

  updatePatient(patientId, updates) {
    const index = this.db.patients.findIndex(p => p.id === patientId);
    if (index === -1) {
      return Promise.reject(new Error('Patient not found'));
    }
    
    this.db.patients[index] = {
      ...this.db.patients[index],
      ...updates,
      updatedAt: new Date()
    };
    this.logAudit('Patient', patientId, 'UPDATE', 'system');
    return Promise.resolve(this.db.patients[index]);
  }

  deletePatient(patientId) {
    const index = this.db.patients.findIndex(p => p.id === patientId);
    if (index === -1) {
      return Promise.reject(new Error('Patient not found'));
    }
    
    this.db.patients.splice(index, 1);
    // Cascade delete related data
    this.db.allergies = this.db.allergies.filter(a => a.patientId !== patientId);
    this.db.chronicConditions = this.db.chronicConditions.filter(c => c.patientId !== patientId);
    this.db.clinicalNotes = this.db.clinicalNotes.filter(n => n.patientId !== patientId);
    this.db.tasks = this.db.tasks.filter(t => t.patientId !== patientId);
    this.db.appointments = this.db.appointments.filter(a => a.patientId !== patientId);
    this.db.referrals = this.db.referrals.filter(r => r.patientId !== patientId);
    
    this.logAudit('Patient', patientId, 'DELETE', 'system');
    return Promise.resolve({ success: true });
  }

  // ============================================
  // CLINICAL NOTES OPERATIONS
  // ============================================

  getClinicalNotesByPatient(patientId) {
    const notes = this.db.clinicalNotes.filter(n => n.patientId === patientId);
    return Promise.resolve(notes);
  }

  createClinicalNote(noteData) {
    const newNote = {
      id: this.db.clinicalNotes.length + 1,
      ...noteData,
      status: noteData.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.db.clinicalNotes.push(newNote);
    this.logAudit('ClinicalNote', newNote.id, 'CREATE', noteData.createdBy || 'system');
    return Promise.resolve(newNote);
  }

  updateClinicalNote(noteId, updates) {
    const index = this.db.clinicalNotes.findIndex(n => n.id === noteId);
    if (index === -1) {
      return Promise.reject(new Error('Clinical note not found'));
    }
    
    this.db.clinicalNotes[index] = {
      ...this.db.clinicalNotes[index],
      ...updates,
      updatedAt: new Date()
    };
    this.logAudit('ClinicalNote', noteId, 'UPDATE', 'system');
    return Promise.resolve(this.db.clinicalNotes[index]);
  }

  // ============================================
  // ALLERGY OPERATIONS
  // ============================================

  getAllergiesByPatient(patientId) {
    const allergies = this.db.allergies.filter(a => a.patientId === patientId);
    return Promise.resolve(allergies);
  }

  addAllergy(allergyData) {
    const newAllergy = {
      id: this.db.allergies.length + 1,
      ...allergyData,
      status: 'active'
    };
    this.db.allergies.push(newAllergy);
    this.logAudit('Allergy', newAllergy.id, 'CREATE', 'system');
    return Promise.resolve(newAllergy);
  }

  removeAllergy(allergyId) {
    const index = this.db.allergies.findIndex(a => a.id === allergyId);
    if (index === -1) {
      return Promise.reject(new Error('Allergy not found'));
    }
    
    this.db.allergies.splice(index, 1);
    this.logAudit('Allergy', allergyId, 'DELETE', 'system');
    return Promise.resolve({ success: true });
  }

  // ============================================
  // CHRONIC CONDITIONS OPERATIONS
  // ============================================

  getChronicConditionsByPatient(patientId) {
    const conditions = this.db.chronicConditions.filter(c => c.patientId === patientId);
    return Promise.resolve(conditions);
  }

  addChronicCondition(conditionData) {
    const newCondition = {
      id: this.db.chronicConditions.length + 1,
      ...conditionData,
      status: 'active'
    };
    this.db.chronicConditions.push(newCondition);
    this.logAudit('ChronicCondition', newCondition.id, 'CREATE', 'system');
    return Promise.resolve(newCondition);
  }

  // ============================================
  // WORKFLOW OPERATIONS
  // ============================================

  getAllWorkflows() {
    return Promise.resolve([...this.db.workflows]);
  }

  getWorkflowById(workflowId) {
    const workflow = this.db.workflows.find(w => w.id === workflowId);
    if (!workflow) {
      return Promise.reject(new Error('Workflow not found'));
    }
    return Promise.resolve(workflow);
  }

  incrementWorkflowUsage(workflowId) {
    const workflow = this.db.workflows.find(w => w.id === workflowId);
    if (workflow) {
      workflow.usageCount++;
      this.logAudit('WorkflowTemplate', workflowId, 'UPDATE', 'system');
    }
    return Promise.resolve(workflow);
  }

  // ============================================
  // TASK OPERATIONS
  // ============================================

  getTasksByPatient(patientId) {
    const tasks = this.db.tasks.filter(t => t.patientId === patientId);
    return Promise.resolve(tasks);
  }

  createTask(taskData) {
    const newTask = {
      id: this.db.tasks.length + 1,
      ...taskData,
      status: taskData.status || 'pending',
      createdAt: new Date()
    };
    this.db.tasks.push(newTask);
    this.logAudit('Task', newTask.id, 'CREATE', taskData.createdBy || 'system');
    return Promise.resolve(newTask);
  }

  updateTask(taskId, updates) {
    const index = this.db.tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      return Promise.reject(new Error('Task not found'));
    }
    
    this.db.tasks[index] = {
      ...this.db.tasks[index],
      ...updates
    };
    
    if (updates.status === 'completed') {
      this.db.tasks[index].completedAt = new Date();
    }
    
    this.logAudit('Task', taskId, 'UPDATE', 'system');
    return Promise.resolve(this.db.tasks[index]);
  }

  // ============================================
  // APPOINTMENT OPERATIONS
  // ============================================

  getAppointmentsByPatient(patientId) {
    const appointments = this.db.appointments.filter(a => a.patientId === patientId);
    return Promise.resolve(appointments);
  }

  createAppointment(appointmentData) {
    const newAppointment = {
      id: this.db.appointments.length + 1,
      ...appointmentData,
      status: appointmentData.status || 'scheduled',
      createdAt: new Date()
    };
    this.db.appointments.push(newAppointment);
    this.logAudit('Appointment', newAppointment.id, 'CREATE', 'system');
    return Promise.resolve(newAppointment);
  }

  // ============================================
  // REFERRAL OPERATIONS
  // ============================================

  getReferralsByPatient(patientId) {
    const referrals = this.db.referrals.filter(r => r.patientId === patientId);
    return Promise.resolve(referrals);
  }

  createReferral(referralData) {
    const newReferral = {
      id: this.db.referrals.length + 1,
      ...referralData,
      status: referralData.status || 'pending',
      createdAt: new Date()
    };
    this.db.referrals.push(newReferral);
    this.logAudit('Referral', newReferral.id, 'CREATE', 'system');
    return Promise.resolve(newReferral);
  }

  // ============================================
  // AUDIT LOG
  // ============================================

  logAudit(entityType, entityId, action, userId) {
    const logEntry = {
      id: this.db.auditLog.length + 1,
      entityType,
      entityId: String(entityId),
      action,
      userId,
      timestamp: new Date()
    };
    this.db.auditLog.push(logEntry);
  }

  getAuditLog(filters = {}) {
    let logs = [...this.db.auditLog];
    
    if (filters.entityType) {
      logs = logs.filter(l => l.entityType === filters.entityType);
    }
    if (filters.entityId) {
      logs = logs.filter(l => l.entityId === filters.entityId);
    }
    if (filters.userId) {
      logs = logs.filter(l => l.userId === filters.userId);
    }
    
    return Promise.resolve(logs.sort((a, b) => b.timestamp - a.timestamp));
  }

  // ============================================
  // SEARCH & ANALYTICS
  // ============================================

  searchPatients(query) {
    const lowerQuery = query.toLowerCase();
    const results = this.db.patients.filter(p => 
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.id.toLowerCase().includes(lowerQuery) ||
      p.email.toLowerCase().includes(lowerQuery)
    );
    return Promise.resolve(results);
  }

  getStatistics() {
    return Promise.resolve({
      totalPatients: this.db.patients.length,
      activePatients: this.db.patients.filter(p => p.status === 'active').length,
      totalClinicalNotes: this.db.clinicalNotes.length,
      aiGeneratedNotes: this.db.clinicalNotes.filter(n => n.isAIGenerated).length,
      pendingTasks: this.db.tasks.filter(t => t.status === 'pending').length,
      upcomingAppointments: this.db.appointments.filter(a => 
        a.status === 'scheduled' && new Date(a.scheduledDate) > new Date()
      ).length
    });
  }
}

// Export singleton instance
const dbService = new DatabaseService();
export default dbService;