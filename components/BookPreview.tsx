import { useSearchParams } from "next/navigation";

export const BookPreviewIframe = () => 
 {
const searchParams = useSearchParams();
  const bookPlanId = searchParams.get('bookPlanId');

  if (!bookPlanId) return <p>Invalid book</p>;
  return (

  <iframe
  src={`/api/book/preview/${bookPlanId}`}
  className="w-full h-full border-0"
  title="Book Preview"
  />
)
 }   

  