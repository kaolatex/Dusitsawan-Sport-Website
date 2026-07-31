'use client';

import React, { useState } from 'react';
import { Instagram, Check } from 'lucide-react';

interface CopyIgButtonProps {
  igHandle: string;
}

export default function CopyIgButton({ igHandle }: CopyIgButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(igHandle);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 active:scale-95 ${
        isCopied
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm'
          : 'bg-zinc-100/80 hover:bg-zinc-200 text-zinc-600 border border-transparent'
      }`}
      aria-label="Copy Instagram Handle"
    >
      {isCopied ? (
        <>
          <Check size={14} strokeWidth={2.5} />
          <span>คัดลอกแล้ว</span>
        </>
      ) : (
        <>
          <Instagram size={14} className="text-pink-500 group-hover:scale-110 transition-transform" />
          <span>{igHandle}</span>
        </>
      )}
    </button>
  );
}
