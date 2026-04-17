'use client';

import { useState } from 'react';
import { User, Mail, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import Link from 'next/link';

export default function MyProfilePage() {
  const { user, updateName } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name ?? '');

  const getRoleLabel = (role: string) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return 'Staff';
  };

  const handleSave = () => {
    updateName(editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user?.name ?? '');
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3 sm:mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">My Profile</h1>
        <p className="text-sm sm:text-base text-gray-600">View and manage your profile information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 max-w-2xl">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">Profile Information</h3>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">
                {user?.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-900">
              {user?.email}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Shield className="w-4 h-4" />
              Role
            </label>
            <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-500">
              {getRoleLabel(user?.role ?? 'staff')}
            </div>
            <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
          </div>

          {/* Account Status */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <CheckCircle className="w-4 h-4" />
              Account Status
            </label>
            <div className="px-4 py-2.5 bg-gray-50 rounded-lg">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 rounded text-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}