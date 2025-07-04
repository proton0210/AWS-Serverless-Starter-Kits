'use client';

import ProtectedRoute from '@/components/protected-route';
import ProfileForm from '@/components/profile-form';
import ChangePasswordForm from '@/components/change-password-form';
import Navbar from '@/components/navbar';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <ProfileForm />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}