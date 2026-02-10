-- DK Clinic Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL,
  availability TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 4.5,
  image_url TEXT,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Busy', 'Off Duty')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  reason TEXT NOT NULL,
  type TEXT DEFAULT 'Consultation' CHECK (type IN ('Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  duration INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for patients
INSERT INTO patients (name, email, phone, date_of_birth, gender, address) VALUES
('John Doe', 'john.doe@email.com', '+1 234-567-8901', '1985-05-15', 'Male', '123 Main St, City, State 12345'),
('Jane Wilson', 'jane.wilson@email.com', '+1 234-567-8902', '1990-08-22', 'Female', '456 Oak Ave, City, State 12345'),
('Mike Brown', 'mike.brown@email.com', '+1 234-567-8903', '1978-12-03', 'Male', '789 Pine Rd, City, State 12345');

-- Insert sample data for doctors
INSERT INTO doctors (name, email, phone, specialization, experience, availability, rating) VALUES
('Dr. Sarah Johnson', 'dr.sarah@clinic.com', '+1 234-567-9001', 'Cardiology', 15, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Friday'], 4.8),
('Dr. Michael Chen', 'dr.michael@clinic.com', '+1 234-567-9002', 'Pediatrics', 12, ARRAY['Monday', 'Wednesday', 'Thursday', 'Saturday'], 4.9),
('Dr. Emily Davis', 'dr.emily@clinic.com', '+1 234-567-9003', 'Dermatology', 8, ARRAY['Tuesday', 'Thursday', 'Friday'], 4.7),
('Dr. Robert Wilson', 'dr.robert@clinic.com', '+1 234-567-9004', 'Orthopedics', 20, ARRAY['Monday', 'Tuesday', 'Thursday'], 4.6);

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, type, priority)
SELECT 
  (SELECT id FROM patients ORDER BY created_at LIMIT 1),
  (SELECT id FROM doctors ORDER BY created_at LIMIT 1),
  '2026-02-15',
  '10:00:00',
  'Regular checkup and consultation',
  'Consultation',
  'Medium';

-- Enable Row Level Security (RLS) for better security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access (modify based on your auth requirements)
-- For now, we'll allow all operations for authenticated users
-- In production, you'd want more granular policies

CREATE POLICY "Public access to patients" ON patients
  FOR ALL USING (true);

CREATE POLICY "Public access to doctors" ON doctors
  FOR ALL USING (true);

CREATE POLICY "Public access to appointments" ON appointments
  FOR ALL USING (true);