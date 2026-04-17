"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu, X } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <span className="text-lg font-semibold text-blue-600">Vestra Pharmacy</span>
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
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}