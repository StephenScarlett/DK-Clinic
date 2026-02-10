-- DK Clinic Database Schema
-- Run this SQL in your Supabase SQL Editor to create the database tables

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL CHECK (experience >= 0),
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Busy', 'Off Duty')),
  rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_patients_updated_at 
  BEFORE UPDATE ON patients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at 
  BEFORE UPDATE ON doctors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
  BEFORE UPDATE ON appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS patients_email_idx ON patients(email);
CREATE INDEX IF NOT EXISTS patients_status_idx ON patients(status);
CREATE INDEX IF NOT EXISTS doctors_email_idx ON doctors(email);
CREATE INDEX IF NOT EXISTS doctors_specialization_idx ON doctors(specialization);
CREATE INDEX IF NOT EXISTS doctors_status_idx ON doctors(status);
CREATE INDEX IF NOT EXISTS appointments_patient_id_idx ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust security as needed)
CREATE POLICY "Enable all operations for all users" ON patients FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON doctors FOR ALL USING (true); 
CREATE POLICY "Enable all operations for all users" ON appointments FOR ALL USING (true);

-- Insert sample data (optional)
INSERT INTO patients (name, email, phone, age, gender, address, status) VALUES
  ('John Doe', 'john.doe@email.com', '+1 (555) 123-4567', 32, 'Male', '123 Oak Street, Springfield, IL 62701', 'active'),
  ('Jane Smith', 'jane.smith@email.com', '+1 (555) 123-4568', 28, 'Female', '456 Pine Avenue, Springfield, IL 62702', 'active'),
  ('Mike Johnson', 'mike.johnson@email.com', '+1 (555) 123-4569', 45, 'Male', '789 Maple Drive, Springfield, IL 62703', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO doctors (name, email, phone, specialization, experience, status, rating) VALUES
  ('Dr. Sarah Johnson', 'sarah.johnson@dkclinic.com', '+1 (555) 123-4567', 'Cardiology', 15, 'Available', 4.9),
  ('Dr. Michael Chen', 'michael.chen@dkclinic.com', '+1 (555) 123-4568', 'Pediatrics', 12, 'Busy', 4.8),
  ('Dr. Emily Rodriguez', 'emily.rodriguez@dkclinic.com', '+1 (555) 123-4569', 'Dermatology', 10, 'Available', 4.9)
ON CONFLICT (email) DO NOTHING;