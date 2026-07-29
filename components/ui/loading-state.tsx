'use client';

import React from 'react';
// Removed RefreshCw import

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'กำลังโหลดข้อมูล...' }: LoadingStateProps) {
  return (
    <div className="w-full space-y-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-surface-card/60 border border-border/20 rounded-2xl p-4 md:p-5 w-full flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex flex-col gap-2.5 w-full md:w-1/3">
            <div className="h-2.5 bg-primary/10 rounded-full w-16"></div>
            <div className="h-4 bg-border/50 rounded-md w-3/4"></div>
            <div className="h-3 bg-border/40 rounded-md w-1/2"></div>
          </div>
          <div className="h-16 bg-surface/50 border border-border/30 rounded-xl w-full md:w-2/5 shrink-0"></div>
        </div>
      ))}
      <div className="flex justify-center pt-2">
        <p className="text-[10px] font-medium text-text-secondary animate-pulse tracking-wide">{message}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="text-center py-12 bg-surface-card border border-red-200 rounded-2xl text-red-500 text-xs">
      {message}
    </div>
  );
}
