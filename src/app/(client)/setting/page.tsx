// File: /setting/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const router = useRouter();

  // Redirect to /setting/account when the page loads
  useEffect(() => {
    router.replace('/setting/account');
  }, [router]);

  return <div>Redirecting to Account Settings...</div>;
}
