export const BookPreviewIframe = ({ bookPlanId }: { bookPlanId: string }) => (
    <iframe
      src={`/api/book/preview/${bookPlanId}`}
      className="w-full h-full border-0"
      title="Book Preview"
    />
  );