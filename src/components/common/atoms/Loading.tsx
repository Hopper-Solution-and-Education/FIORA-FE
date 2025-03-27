import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center w-full h-full bg-gray-900 bg-opacity-50 z-[9999]"
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
      <h2 className="text-2xl font-semibold text-white">Loading...</h2>
      <p className="text-gray-300 mt-2">Please wait while we prepare your content</p>
    </div>
  );
};

export default Loading;
