'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiHandler } from '@/lib/api';
import { IBookPlan } from '../modals/Book';
// import type { IBookPlan } from '@/models/BookPlan';

/* =========================
   📘 Data Service Class
========================= */
class DataService {
  async fetchBooks(): Promise<IBookPlan[]> {
    const res = await apiHandler<{ books: IBookPlan[] }>({
      url: '/book',
      method: 'GET',
    });
    return res.books;
  }

  // ✅ Future expansion example
  // async createBook(payload: Partial<IBookPlan>) { ... }
  // async deleteBook(id: string) { ... }
  // async updateBook(id: string, data: Partial<IBookPlan>) { ... }
}

/* =========================
   🧩 Context + Provider
========================= */
interface DataContextType {
  books: IBookPlan[] | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const dataService = new DataService();

export function DataProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<IBookPlan[] | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    try {
      const fetchedBooks = await dataService.fetchBooks();
      setBooks(fetchedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <DataContext.Provider value={{ books, loading, refetch }}>
      {children}
    </DataContext.Provider>
  );
}

/* =========================
   🪄 Custom Hook
========================= */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
