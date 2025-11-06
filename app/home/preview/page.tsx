// /home/preview/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const bookPlanId = searchParams.get('bookPlanId');

  if (!bookPlanId) return <p>Invalid book</p>;

  return (
    <div className="w-full h-screen">
      <iframe
        src={`/api/book/preview/${bookPlanId}`}
        className="w-full h-full border-0"
        title="Book Preview"
      />
    </div>
  );
}