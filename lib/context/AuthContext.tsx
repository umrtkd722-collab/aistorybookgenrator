// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiHandler } from '@/lib/api'; // jo tumhara apiHandler hai
import { User } from '../type';
import Cookies from 'js-cookie';
import { redirect, useRouter } from 'next/navigation';


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
 const router = useRouter();
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await apiHandler<User>({
        url: '/me',
        method: 'GET',
  
    },
{
    successMessage:"Welcome back",
    showError:false,
    showSuccess:true
    
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
const logout = async () => {
 

  try {
    await fetch("/api/auth/signout", {
      method: "POST",
    });

    setUser(null);
    router.push("/home/authPage"); // ✅ redirect from client side
  } catch (error) {
    console.error("Logout failed:", error);
  }
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