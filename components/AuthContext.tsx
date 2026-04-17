'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// =========================
// TYPES
// =========================
interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (role: string, email: string) => void;
  signUp: (role: string, fullName: string, email: string) => void;
  logout: () => void;
  updateName: (newName: string) => void;
}

// =========================
// CONTEXT
// =========================
const AuthContext = createContext<AuthContextType | null>(null);

// =========================
// PROVIDER
// =========================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Login: derive username from email (everything before @)
  const login = (role: string, email: string) => {
    const derivedName = email.split('@')[0];
    setUser({ name: derivedName, email, role });
  };

  // SignUp: use the full name the user typed
  const signUp = (role: string, fullName: string, email: string) => {
    setUser({ name: fullName, email, role });
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
  };

  // Profile edit: update name globally
  const updateName = (newName: string) => {
    setUser((prev) => prev ? { ...prev, name: newName } : prev);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      login,
      signUp,
      logout,
      updateName,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// HOOK (use this in any component)
// =========================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}