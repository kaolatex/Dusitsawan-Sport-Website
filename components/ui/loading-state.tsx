'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'กำลังโหลดข้อมูล...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <RefreshCw size={20} className="text-primary animate-spin" />
      <p className="text-xs text-text-secondary">{message}</p>
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
