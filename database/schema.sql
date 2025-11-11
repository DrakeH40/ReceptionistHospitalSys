-- MediFlow AI - PostgreSQL Database Schema
-- Complete schema for clinical documentation system
-- Compatible with hospital EHR systems

-- ============================================
-- CORE TABLES
-- ============================================

-- Patients Table
CREATE TABLE patients (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50),
    blood_type VARCHAR(5),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    insurance_provider VARCHAR(200),
    insurance_policy_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    CONSTRAINT patients_status_check CHECK (status IN ('active', 'inactive', 'deceased'))
);

-- Indexes for fast lookups
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);
CREATE INDEX idx_patients_email ON patients(email);

-- ============================================
-- MEDICAL INFORMATION TABLES
-- ============================================

-- Allergies Table
CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergen VARCHAR(200) NOT NULL,
    reaction TEXT,
    severity VARCHAR(20) DEFAULT 'moderate',
    status VARCHAR(20) DEFAULT 'active',
    diagnosed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    CONSTRAINT allergies_severity_check CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening')),
    CONSTRAINT allergies_status_check CHECK (status IN ('active', 'resolved', 'historical'))
);

CREATE INDEX idx_allergies_patient ON allergies(patient_id);
CREATE INDEX idx_allergies_severity ON allergies(severity);

-- Chronic Conditions Table
CREATE TABLE chronic_conditions (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    condition VARCHAR(200) NOT NULL,
    diagnosis_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    CONSTRAINT conditions_status_check CHECK (status IN ('active', 'resolved', 'in_remission'))
);

CREATE INDEX idx_conditions_patient ON chronic_conditions(patient_id);
CREATE INDEX idx_conditions_status ON chronic_conditions(status);

-- Medications Table
CREATE TABLE medications (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(50),
    prescribing_physician VARCHAR(200),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    CONSTRAINT medications_status_check CHECK (status IN ('active', 'discontinued', 'completed'))
);

CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_medications_status ON medications(status);

-- ============================================
-- CLINICAL DOCUMENTATION TABLES
-- ============================================

-- Clinical Notes Table
CREATE TABLE clinical_notes (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    note_type VARCHAR(50) NOT NULL,
    subject VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    is_ai_generated BOOLEAN DEFAULT FALSE,
    encounter_date TIMESTAMP,
    signed_by VARCHAR(50),
    signed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50),
    CONSTRAINT notes_type_check CHECK (note_type IN ('progress', 'assessment', 'consultation', 'procedure', 'discharge', 'admission')),
    CONSTRAINT notes_status_check CHECK (status IN ('draft', 'final', 'amended', 'signed'))
);

CREATE INDEX idx_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_notes_type ON clinical_notes(note_type);
CREATE INDEX idx_notes_created ON clinical_notes(created_at DESC);
CREATE INDEX idx_notes_status ON clinical_notes(status);

-- Note Templates Table (for standardized documentation)
CREATE TABLE note_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    note_type VARCHAR(50) NOT NULL,
    template_content TEXT NOT NULL,
    category VARCHAR(100),
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50)
);

-- ============================================
-- WORKFLOW TABLES
-- ============================================

-- Tasks Table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    task_type VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to VARCHAR(50),
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    completed_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    CONSTRAINT tasks_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT tasks_status_check CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

CREATE INDEX idx_tasks_patient ON tasks(patient_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due ON tasks(due_date);

-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_type VARCHAR(100) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 30,
    provider VARCHAR(200),
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    CONSTRAINT appointments_status_check CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'))
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Referrals Table
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    referring_physician VARCHAR(200),
    specialist VARCHAR(200) NOT NULL,
    specialty VARCHAR(100),
    reason TEXT NOT NULL,
    urgency VARCHAR(20) DEFAULT 'routine',
    status VARCHAR(20) DEFAULT 'pending',
    referral_date DATE DEFAULT CURRENT_DATE,
    appointment_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    CONSTRAINT referrals_urgency_check CHECK (urgency IN ('routine', 'urgent', 'emergency')),
    CONSTRAINT referrals_status_check CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled'))
);

CREATE INDEX idx_referrals_patient ON referrals(patient_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- ============================================
-- WORKFLOW TEMPLATES
-- ============================================

-- Workflow Templates Table
CREATE TABLE workflow_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    steps JSONB NOT NULL,
    checklist_items JSONB,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50)
);

-- Workflow Instances Table (when a workflow is started for a patient)
CREATE TABLE workflow_instances (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    template_id INT REFERENCES workflow_templates(id),
    status VARCHAR(20) DEFAULT 'in_progress',
    current_step INT DEFAULT 1,
    completed_steps JSONB,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_by VARCHAR(50),
    completed_at TIMESTAMP,
    CONSTRAINT workflow_status_check CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

-- ============================================
-- AUDIT AND COMPLIANCE TABLES
-- ============================================

-- Audit Log Table (for HIPAA compliance)
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    user_role VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    changes JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_action_check CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PRINT', 'EXPORT'))
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_log(action);

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'physician', 'nurse', 'receptionist', 'medical_assistant'))
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- User Sessions Table (for authentication)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- ============================================
-- SYSTEM TABLES
-- ============================================

-- System Settings Table
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    data_type VARCHAR(20),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50)
);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinical_notes_updated_at BEFORE UPDATE ON clinical_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (entity_type, entity_id, action, user_id, changes)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT),
        TG_OP,
        CURRENT_USER,
        CASE
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            ELSE row_to_json(NEW)
        END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_patients_changes
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_clinical_notes_changes
    AFTER INSERT OR UPDATE OR DELETE ON clinical_notes
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Patient Summary
CREATE OR REPLACE VIEW patient_summary AS
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.date_of_birth,
    p.gender,
    p.status,
    COUNT(DISTINCT cn.id) as note_count,
    COUNT(DISTINCT a.id) as appointment_count,
    COUNT(DISTINCT t.id) as task_count,
    MAX(cn.created_at) as last_note_date
FROM patients p
LEFT JOIN clinical_notes cn ON p.id = cn.patient_id
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN tasks t ON p.id = t.patient_id
GROUP BY p.id, p.first_name, p.last_name, p.date_of_birth, p.gender, p.status;

-- View: Active Tasks
CREATE OR REPLACE VIEW active_tasks AS
SELECT 
    t.*,
    p.first_name || ' ' || p.last_name as patient_name
FROM tasks t
LEFT JOIN patients p ON t.patient_id = p.id
WHERE t.status IN ('pending', 'in_progress')
ORDER BY 
    CASE t.priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END,
    t.due_date;

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample patients
INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, blood_type, phone, email, status)
VALUES 
    ('P20250001', 'John', 'Doe', '1980-05-15', 'Male', 'A+', '(555) 123-4567', 'john.doe@email.com', 'active'),
    ('P20250002', 'Jane', 'Smith', '1992-08-22', 'Female', 'O-', '(555) 234-5678', 'jane.smith@email.com', 'active'),
    ('P20250003', 'Robert', 'Johnson', '1975-12-10', 'Male', 'B+', '(555) 345-6789', 'robert.j@email.com', 'active');

-- Insert sample allergies
INSERT INTO allergies (patient_id, allergen, reaction, severity)
VALUES 
    ('P20250001', 'Penicillin', 'Hives, difficulty breathing', 'severe'),
    ('P20250002', 'Latex', 'Skin rash', 'moderate');

-- ============================================
-- GRANTS (for application user)
-- ============================================

-- Create application user
CREATE USER mediflow_app WITH PASSWORD 'your_secure_password_here';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mediflow_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mediflow_app;

-- ============================================
-- BACKUP AND MAINTENANCE
-- ============================================

-- Backup command (run from terminal):
-- pg_dump -U postgres -d mediflow -F c -b -v -f mediflow_backup_$(date +%Y%m%d).dump

-- Restore command:
-- pg_restore -U postgres -d mediflow -v mediflow_backup_YYYYMMDD.dump

-- ============================================
-- NOTES FOR HOSPITAL INTEGRATION
-- ============================================

/*
1. HIPAA COMPLIANCE:
   - All tables include audit logging
   - Sensitive data should be encrypted at rest
   - Use SSL/TLS for database connections
   - Regular backup schedule required
   - Access controls via user roles

2. HL7/FHIR INTEGRATION:
   - Patient ID mapping may need adjustment
   - Consider adding HL7 message log table
   - FHIR resource IDs can be stored in separate columns

3. PERFORMANCE:
   - Indexes are optimized for common queries
   - Consider partitioning large tables (clinical_notes, audit_log)
   - Regular VACUUM and ANALYZE maintenance

4. SCALABILITY:
   - Schema supports millions of records
   - Use connection pooling (pgBouncer)
   - Consider read replicas for reporting

5. DATA RETENTION:
   - Clinical notes: Retain 7-10 years (legal requirement)
   - Audit logs: Retain 6 years minimum (HIPAA)
   - Implement archival strategy for old data
*/






// When you save a note, it calls:
await dbService.createClinicalNote({
  patientId: selectedPatientId,
  content: noteContent,
  noteType: selectedNoteType,
  createdBy: 'current-user'
});
// Note is PERMANENTLY saved to database!