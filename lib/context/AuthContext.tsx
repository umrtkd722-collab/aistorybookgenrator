// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiHandler } from '@/lib/api'; // jo tumhara apiHandler hai
import { User } from '../type';
import Cookies from 'js-cookie';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
  signout:()=> void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await apiHandler<User>({
        url: '/me',
        method: 'GET',
  
    },
{
    successMessage:"Welcome back",
    showError:true,
    showSuccess:true,
}    
    );
    console.log(data)
      setUser(data as User || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
const logout = () => {
    Cookies.remove('accessToken');
    setUser(null);
    window.location.href = '/home/authPage'; // redirect
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user,  loading, refetch: fetchUser ,signout: logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};