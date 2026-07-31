'use client';

import React, { useState } from 'react';
import { Check, Phone } from 'lucide-react';

interface CopyContactButtonProps {
  type: 'ig' | 'phone';
  value: string;
  theme?: 'light' | 'hacker';
}

export default function CopyContactButton({ type, value, theme = 'light' }: CopyContactButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const isIg = type === 'ig';

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`group flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 border ${
        isCopied
          ? theme === 'hacker' 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-sm'
          : theme === 'hacker'
          ? 'bg-zinc-900/80 text-emerald-500 border-emerald-500/30 hover:bg-emerald-950/50 hover:text-emerald-400 hover:border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
          : isIg
          ? 'bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-pink-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 border-transparent dark:border-zinc-700 hover:border-pink-200 dark:hover:border-zinc-500'
          : 'bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 border-transparent dark:border-zinc-700 hover:border-blue-200 dark:hover:border-zinc-500'
      }`}
      aria-label={`Copy ${isIg ? 'Instagram' : 'Phone'}`}
    >
      {isCopied ? (
        <>
          <Check size={16} strokeWidth={2.5} />
          <span>คัดลอกแล้ว</span>
        </>
      ) : (
        <>
          {isIg ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${theme === 'hacker' ? 'text-emerald-500 group-hover:text-emerald-400' : 'text-pink-500 dark:text-pink-400'} group-hover:scale-110 transition-transform`}
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          ) : (
            <Phone size={16} className={`${theme === 'hacker' ? 'text-emerald-500 group-hover:text-emerald-400' : 'text-blue-500 dark:text-blue-400'} group-hover:scale-110 transition-transform`} />
          )}
          <span className={`${theme === 'hacker' ? 'font-mono tracking-wide' : 'font-mono'}`}>{value}</span>
        </>
      )}
    </button>
  );
}
