// File: /setting/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const router = useRouter();

  // Redirect to /setting/partner when the page loads
  useEffect(() => {
    router.replace('/setting/partner');
  }, [router]);

  return <div>Redirecting to Partner Settings...</div>;
}
