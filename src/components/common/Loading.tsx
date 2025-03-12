import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
      <h2 className="text-2xl font-semibold">Loading...</h2>
      <p className="text-muted-foreground mt-2">Please wait while we prepare your content</p>
    </div>
  );
}
