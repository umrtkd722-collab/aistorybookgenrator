// app/home/edit-book/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiHandler } from '@/lib/api';

export default function EditBook() {
  const params = useParams();
  const router = useRouter();
  const bookId =   params.id as string;
  const [book, setBook] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    const res = await apiHandler({
      url: `/book/${bookId}`,
      method: 'GET',
    });
    setBook(res);
    setTitle(res.title);
    setDescription(res.description || '');
  };

  const saveChanges = async () => {
    await apiHandler({
      url: `/book/${bookId}`,
      method: 'PATCH',
      data: { title, description },
    });
    router.back();
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Book</h1>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book Title"
          className="w-full p-3 border rounded-lg mb-4"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 border rounded-lg mb-4 h-32"
        />
        <button onClick={saveChanges} className="px-6 py-2 bg-[#F38DA0] text-white rounded-full">
          Save Changes
        </button>
        <button onClick={() => router.back()} className="ml-4 px-6 py-2 border rounded-full">
          Cancel
        </button>
      </div>
    </div>
  );
}