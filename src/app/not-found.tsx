import { Icons } from '@/components/Icon';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Icons.alertCircle className="h-10 w-10 text-primary" aria-hidden="true" />
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">404</h1>
          <h2 className="mt-3 text-xl font-semibold sm:text-2xl">Page Not Found</h2>

          <p className="mt-4 text-muted-foreground sm:text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been
            moved, deleted, or never existed.
          </p>

          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Icons.moveLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 text-center text-sm text-muted-foreground">
          <p>Copyright &copy; FIORA.live</p>
        </div>
      </div>
    </ThemeProvider>
  );
}
