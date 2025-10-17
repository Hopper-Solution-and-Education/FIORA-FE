'use client';

// import DecorativeElements from '@/components/decorative-elements';
import { CommingSoonIllustration, DecorativeElements } from '@/shared/assets/illustration';

export default function ComingSoonPage() {
  return (
    <main className="bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Decorative elements */}
      <DecorativeElements />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Illustration */}
        <div className="mb-12 flex justify-center">
          <CommingSoonIllustration />
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
          Launching Soon!
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
          We are going to launch this page very soon. Stay tuned.
        </p>
      </div>
    </main>
  );
}
