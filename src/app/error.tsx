'use client';

import { Icons } from '@/components/Icon';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Icons.alertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Oops! Something went wrong
          </h1>

          <p className="mt-4 text-muted-foreground sm:text-lg">
            An unexpected error occurred. Please try again or return to the homepage.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button variant="default" size="lg" onClick={() => reset()}>
              Try Again
            </Button>

            <Button asChild variant="secondary" size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Icons.moveLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>

          {error?.message && (
            <p className="mt-6 text-sm text-muted-foreground">
              <span className="font-semibold">Error:</span> {error.message}
            </p>
          )}
        </div>

        <div className="absolute bottom-8 text-center text-sm text-muted-foreground">
          <p>Copyright &copy; FIORA.live</p>
        </div>
      </div>
    </ThemeProvider>
  );
}
