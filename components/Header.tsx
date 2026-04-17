import { useState } from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';
import Link from "next/link";

interface HeaderProps {
  userName: string;
  userRole: string;
  onLogout?: () => void;
}

export default function Header({ userName, userRole, onLogout }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notificationCount = 3;

  const getRoleLabel = (role: string) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return 'Staff';
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6">
      
      {/* Notification Bell */}
      <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>

      {/* User Profile Section */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-sm text-gray-900">{userName}</div>
            <div className="text-xs text-gray-500">
              {getRoleLabel(userRole)}
            </div>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              
              <Link
                href="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                My Profile
              </Link>

              <Link
                href="/change-password"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Change Password
              </Link>

              <hr className="my-1 border-gray-200" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}