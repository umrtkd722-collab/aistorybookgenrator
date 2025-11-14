"use client"
// /home/preview/page.tsx

import { BookPreviewIframe } from '@/components/BookPreview';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const bookPlanId = searchParams.get('bookPlanId');

  if (!bookPlanId) return <p>Invalid book</p>;


  return (
    <div className="w-full h-screen">
      <Suspense fallback={<p>Loading preview...</p>}>
        <BookPreviewIframe bookPlanId={bookPlanId} />
      </Suspense>
    </div>
  );
}
  