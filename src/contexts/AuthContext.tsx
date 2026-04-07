/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'user';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin' | 'user';
  createdAt: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('portfolio_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const adminEmail = 'helal.design7@gmail.com';

    const applySession = (session: Session | null) => {
      const sbUser = session?.user;

      if (sbUser?.email?.toLowerCase() === adminEmail) {
        const adminUser: User = {
          id: sbUser.id,
          email: adminEmail,
          role: 'super_admin',
          name: sbUser.user_metadata?.full_name || 'Ahmed Helal'
        };
        setUser(adminUser);
        localStorage.setItem('portfolio_session', JSON.stringify(adminUser));
        return;
      }

      const localStr = localStorage.getItem('portfolio_session');
      if (localStr) {
        try {
          const localUser = JSON.parse(localStr);
          if (localUser?.role === 'admin' || localUser?.role === 'super_admin') {
             if (!sbUser || sbUser.email?.toLowerCase() !== adminEmail) {
                setUser(null);
                localStorage.removeItem('portfolio_session');
             }
          }
        } catch {
          // ignore parse errors
        }
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const clearChats = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('portfolio_chat_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email?.trim().toLowerCase() || '';
    
    // 1. Sync with Supabase Auth for RLS / Backend Security
    // This provides the JWT needed for the backend to recognize the user as authenticated
    const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password
    });

    // 2. Check Admin Credentials (Verify via Supabase User Email)
    const adminEmail = 'helal.design7@gmail.com';
    
    if (sbData.user && sbData.user.email?.toLowerCase() === adminEmail) {
      const adminUser: User = {
        id: sbData.user.id,
        email: adminEmail,
        role: 'super_admin',
        name: sbData.user.user_metadata?.full_name || 'Ahmed Helal'
      };
      setUser(adminUser);
      localStorage.setItem('portfolio_session', JSON.stringify(adminUser));
      clearChats();
      return true;
    }

    if (sbError || !sbData.user) {
      console.error("Authentication Failure:", sbError?.message || "Invalid credentials");
      return false;
    }

    // 3. Check Local Users (Persistent Mock Database)
    const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    const matchedUser = storedUsers.find((u) => u.email?.toLowerCase() === trimmedEmail && u.password === password);

    if (matchedUser) {
      const sessionUser: User = {
        id: matchedUser.id,
        email: matchedUser.email,
        role: 'user',
        name: matchedUser.name
      };
      setUser(sessionUser);
      localStorage.setItem('portfolio_session', JSON.stringify(sessionUser));
      clearChats();
      return true;
    }

    return false;
  };

  const signup = (name: string, email: string, password: string) => {
    const trimmedEmail = email?.trim().toLowerCase() || '';
    const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('portfolio_users') || '[]');

    // Check if user already exists
    if (storedUsers.some((u) => u.email?.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'Email already registered.' };
    }

    // Create new user
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email: trimmedEmail,
      password, // In a real app, this MUST be hashed!
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Save to "Database"
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('portfolio_users', JSON.stringify(updatedUsers));

    // Log in automatically
    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      role: 'user',
      name: newUser.name
    };
    setUser(sessionUser);
    localStorage.setItem('portfolio_session', JSON.stringify(sessionUser));
    clearChats();
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portfolio_session');
    clearChats();
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
