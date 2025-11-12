'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiHandler } from '@/lib/api';
import { Edit, FileText, Printer, Eye } from 'lucide-react';
import { useData } from '@/lib/context/DataContext';
import Image from 'next/image';

type Tab = 'books' | 'orders' | 'analytics';

export default function Dashboard() {
  const router = useRouter();
  const { refetch, books } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('books');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(books , "books")

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiHandler<{ orders: any[] }>({
        url: '/api/order/list',
        method: 'GET',
      });
      setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'books') refetch().then(() => setLoading(false));
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  // --------------------------
  // Action handlers
  // --------------------------
  const handleEdit = (bookId: string) => router.push(`/home/edit-book/${bookId}`);
  const handleOrder = async (bookId: string) => {
    const address = prompt("Enter shipping address:");
    if (!address) return;
    try {
      await apiHandler({
        url: '/api/order/create',
        method: 'POST',
        data: { bookPlanId: bookId, shippingAddress: address },
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };
  const handlePreview = (bookId: string) => router.push(`/home/preview?bookPlanId=${bookId}`);

  // --------------------------
  // Loading state
  // --------------------------
  if (loading) return <div>Loading...</div>;

  // --------------------------
  // Render tab content
  // --------------------------
  const renderBooksTab = () => (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {books?.map((book :any) => (
    <div key={book._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      
      {/* Cover */}
      {book.coverUrl ? (
        <img  src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-4" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-4">
          <span className="text-gray-400">No Cover</span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold mb-2">{book.title}</h3>

      {/* Description */}
      {book.description && (
        <p className="text-gray-600 mb-4">{book.description.substring(0, 100)}{book.description.length > 100 ? '...' : ''}</p>
      )}

      {/* Status & story count */}
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          book.storyIds.length === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {book.storyIds.length === 0 ? 'IN PROGRESS' : 'COMPLETED'}
        </span>
        <span className="text-sm text-gray-500">{book.storyIds.length} stories</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
  <button onClick={() => handlePreview(book._id)} className="flex-1 p-2 border rounded-lg hover:bg-gray-50">
    <Eye size={16} /> Preview
  </button>

  {/* EDIT BUTTON: Hamesha dikhao */}
  <button onClick={() => handleEdit(book._id)} className="p-2 border rounded-lg hover:bg-blue-50">
    <Edit size={16} />
  </button>

  {/* ORDER BUTTON: Sirf agar status "draft" hai */}
  {book.status === "draft" && (
    <button onClick={() => handleOrder(book._id)} className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
      <Printer size={16} />
    </button>
  )}
</div>
    </div>
  ))}

  {/* No books state */}
  {books?.length === 0 && (
    <div className="text-center py-12 col-span-full">
      <FileText size={64} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No books yet</h3>
      <p>Create your first personalized storybook!</p>
      <button onClick={() => router.push('/home/howitswork')} className="mt-4 px-6 py-2 bg-[#F38DA0] text-white rounded-full">
        Start Creating
      </button>
    </div>
  )}
</div>

  );

  const renderOrdersTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 && <p>No orders yet</p>}
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="p-4 border-b flex justify-between">
            <span>{order.bookTitle}</span>
            <span>{order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <p>Total Books: {books?.length}</p>
      {/* <p>Drafts: {books?.filter(b => b.status === 'draft').length}</p>
      <p>Completed: {books?.filter(b => b.status !== 'draft').length}</p> */}
      <p>Total Orders: {orders.length}</p>
    </div>
  );

  // --------------------------
  // Render main dashboard
  // --------------------------
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('books')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'books' ? 'bg-white border-t border-l border-r' : 'bg-gray-200'}`}>
          Books
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'orders' ? 'bg-white border-t border-l border-r' : 'bg-gray-200'}`}>
          Orders
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'analytics' ? 'bg-white border-t border-l border-r' : 'bg-gray-200'}`}>
          Analytics
        </button>
      </div>

      <div className="bg-white p-6 rounded-b-xl shadow-md">
        {activeTab === 'books' && renderBooksTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
}
