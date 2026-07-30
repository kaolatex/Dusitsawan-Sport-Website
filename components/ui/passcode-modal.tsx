'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasscodeModal({ isOpen, onClose }: PasscodeModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode === '2026') {
      sessionStorage.setItem('dev_auth', 'true');
      onClose();
      router.push('/dev');
    } else {
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 2000);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-mono">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm mx-4 bg-[#09090b] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-[#09090b]">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Authentication Required</span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full border ${error ? 'border-red-900/50 bg-red-900/20 text-red-500' : 'border-zinc-800 bg-zinc-900 text-zinc-400'}`}>
                  {error ? <AlertCircle className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 text-center">
                  <label htmlFor="passcode" className="text-xs text-zinc-500 uppercase tracking-wider">
                    Enter Passcode
                  </label>
                  <input
                    ref={inputRef}
                    type="password"
                    id="passcode"
                    value={passcode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setPasscode(val);
                      if (val.length === 4) {
                        // setTimeout to let React render the 4th dot before submitting
                        setTimeout(() => {
                          if (val === '2026') {
                            sessionStorage.setItem('dev_auth', 'true');
                            onClose();
                            router.push('/dev');
                          } else {
                            setError(true);
                            setPasscode('');
                            setTimeout(() => setError(false), 2000);
                          }
                        }, 50);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-zinc-900 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-600'} rounded-sm px-4 py-3 text-center text-2xl tracking-[1em] text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors`}
                    placeholder="••••"
                    maxLength={4}
                    autoComplete="off"
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-2"
                    >
                      ACCESS DENIED
                    </motion.p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
