// File: /setting/page.tsx
'use client';

import { Session, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    if (session?.user?.role !== 'Admin') {
      redirect('/');
    }
  }, [session]);

  return <div>Global Settings</div>;
}
