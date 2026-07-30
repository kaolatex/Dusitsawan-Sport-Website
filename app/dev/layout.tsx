'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('dev_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Wait a bit to show access denied, then redirect
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#09090b] flex items-center justify-center font-mono text-zinc-500">
        <p>INITIALIZING TERMINAL...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#09090b] flex flex-col items-center justify-center font-mono text-red-500">
        <p className="text-xl mb-2">ACCESS DENIED</p>
        <p className="text-sm text-zinc-500">REDIRECTING...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#09090b] text-[#e4e4e7] font-mono overflow-auto">
      {children}
    </div>
  );
}
