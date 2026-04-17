'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "./AuthContext";
import { Menu, X } from "lucide-react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = ["/login", "/signup"].includes(pathname.toLowerCase());

  // If user is not logged in and tries to visit a protected page, redirect to login
  useEffect(() => {
    if (!isLoggedIn && !isAuthPage) {
      router.push("/login");
    }
  }, [isLoggedIn, isAuthPage, router]);

  // If user is logged in and visits login/signup, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn && isAuthPage) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, isAuthPage, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Auth pages (login/signup): no sidebar or header
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Protected pages: show sidebar + header + content
  return (
    <>
      {/* Mobile Top Navigation */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold text-blue-600">DawaAI</span>
        <div className="w-10" />
      </header>

      <div className="flex h-screen pt-16 md:pt-0">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Off-canvas on mobile, static on desktop */}
        <div
          className={`fixed inset-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:static md:inset-auto md:w-64 md:z-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
        </div>

        {/* Close button for mobile sidebar */}
        {mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            userName={user?.name ?? 'User'}
            userRole={user?.role ?? 'staff'}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}