# Supabase Integration Setup Guide

This guide will help you set up Supabase as the backend for your DK Clinic Management System.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js installed on your machine

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "dk-clinic")
5. Enter a database password (save this securely)
6. Choose a region close to your users
7. Click "Create new project"

### 2. Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under Project URL section)
   - **anon public key** (under Project API keys section)

### 3. Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `database/schema.sql` from this project
3. Copy all the SQL content and paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `patients` table
- `doctors` table  
- `appointments` table
- Necessary indexes for performance
- Sample data to get started
- Row Level Security policies

### 5. Verify the Setup

1. Start your development server: `npm run dev`
2. Navigate to the Patients page
3. You should see sample patients loaded from Supabase
4. Try adding a new patient to test the integration

## Database Structure

### Patients Table
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `email` (Text, Required, Unique)
- `phone` (Text, Required)
- `date_of_birth` (Date, Required)
- `gender` (Text, Required)
- `address` (Text, Required)
- `status` (Text, Default: 'Active')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Doctors Table
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `email` (Text, Required, Unique)
- `phone` (Text, Required)
- `specialization` (Text, Required)
- `experience` (Integer, Required)
- `availability` (Text Array, Required)
- `rating` (Decimal, Default: 4.5)
- `image_url` (Text, Optional)
- `status` (Text, Default: 'Available')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Appointments Table
- `id` (UUID, Primary Key)
- `patient_id` (UUID, Foreign Key to patients)
- `doctor_id` (UUID, Foreign Key to doctors)
- `appointment_date` (Date, Required)
- `appointment_time` (Time, Required)
- `status` (Text, Default: 'Pending')
- `reason` (Text, Required)
- `type` (Text, Default: 'Consultation')
- `priority` (Text, Default: 'Medium')
- `duration` (Integer, Default: 30)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Features Implemented

✅ **Patient Management**
- Create new patients
- View all patients
- Delete patients
- Search patients by name, email, or phone
- Patient statistics (total, active, inactive)

🔄 **Coming Next**
- Edit patient information
- Doctor management
- Appointment booking
- Real-time updates
- User authentication

## Technologies Used

- **Supabase**: PostgreSQL database with real-time subscriptions
- **React Query**: Data fetching and caching
- **TypeScript**: Type safety
- **React**: Frontend framework

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Make sure `.env.local` is in the project root
   - Restart your development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and anon key are correct
   - Check if your project is active in the Supabase dashboard

3. **SQL errors**
   - Make sure you ran the complete schema from `database/schema.sql`
   - Check the Supabase dashboard logs for detailed error messages

4. **CORS errors**
   - Supabase automatically handles CORS for localhost
   - For production, add your domain to the allowed origins in Supabase settings

### Getting Help

- Check the browser console for error messages
- Review the Supabase dashboard logs
- Ensure all environment variables are set correctly
- Verify the database schema was created successfully

## Next Steps

1. **Add Authentication**: Implement user login/signup
2. **Expand Entities**: Add services for doctors and appointments
3. **Real-time Updates**: Use Supabase subscriptions for live data
4. **Add Validation**: Implement form validation and error handling
5. **Optimize Performance**: Add pagination and advanced filtering