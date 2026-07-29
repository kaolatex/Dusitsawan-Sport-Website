'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  onSignIn: (email: string, password: string) => Promise<void>;
}

export default function AdminLoginModal({ onSignIn }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-card border border-border rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-text-primary text-base">เข้าสู่ระบบ Admin</h2>
            <p className="text-[11px] text-text-secondary">กรุณา Login ด้วยบัญชี Supabase Auth</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-text-secondary">อีเมล</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-surface border border-border/60 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-text-secondary">รหัสผ่าน</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border/60 rounded-xl pl-10 pr-10 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
