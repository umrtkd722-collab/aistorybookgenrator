"use client"
// /home/preview/page.tsx

import { BookPreviewIframe } from '@/components/BookPreview';
import { Suspense } from 'react';

export default function PreviewPage() {
  


  return (
    <div className="w-full h-screen">
      <Suspense fallback={<p>Loading preview...</p>}>
        <BookPreviewIframe  />
      </Suspense>
    </div>
  );
}
  