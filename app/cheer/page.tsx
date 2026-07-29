'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { fetchCheerMessages, submitCheerMessage } from '@/lib/supabase/services';
import type { Tables } from '@/lib/supabase/database.types';
import { Heart, Send, Sparkles, UserX, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';

const STICKERS = [
  { id: 'trophy', emoji: '🏆', label: 'ถ้วยรางวัล' },
  { id: 'heart', emoji: '💖', label: 'หัวใจชมพู' },
  { id: 'runner', emoji: '🏃', label: 'นักวิ่ง' },
  { id: 'fire', emoji: '🔥', label: 'สู้ๆ' },
  { id: 'party', emoji: '🎉', label: 'ฉลอง' },
  { id: 'cheer', emoji: '📣', label: 'เชียร์สุดใจ' },
  { id: 'medal', emoji: '🥇', label: 'เหรียญทอง' },
  { id: 'football', emoji: '⚽', label: 'ฟุตบอล' },
];

const MOCK_CHEER_MESSAGES: Tables<'cheer_wall'>[] = [
  {
    id: 'cheer-1',
    author_name: 'ศิษย์เก่ารุ่น 24',
    message: 'ขอให้กองเชียร์และทัพนักกีฬา คณะ 2 สีชมพู สู้เต็มที่ คว้าชัยชนะดุสิตสวรรค์มาให้ได้!',
    sticker_id: 'trophy',
    is_anonymous: false,
    status: 'approved',
    is_pinned: false,
    pinned_order: 0,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'cheer-2',
    author_name: 'กองเชียร์นิรนาม',
    message: 'ส่งใจไปสแตนด์เชียร์! สู้ๆ นะทุกคน เสียงเชียร์สีชมพูดังกระหึ่มแน่นอน 💖',
    sticker_id: 'heart',
    is_anonymous: true,
    status: 'approved',
    is_pinned: false,
    pinned_order: 0,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cheer-3',
    author_name: 'ทีมขบวนพาเหรด',
    message: 'พร้อมอวดความสง่างามแห่งดุสิตสวรรค์ธัญมหาปราสาทแล้วพรุ่งนี้!',
    sticker_id: 'party',
    is_anonymous: false,
    status: 'approved',
    is_pinned: false,
    pinned_order: 0,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

function formatThaiDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const day = date.getDate();
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} • ${hours}:${minutes} น.`;
  } catch {
    return 'เมื่อเร็วๆ นี้';
  }
}

export default function CheerPage() {
  const cheerFetcher = useCallback(() => fetchCheerMessages(), []);
  const { data: dbCheers, refetch: refetchCheer } = useSupabaseData('cheer_wall', cheerFetcher, true);

  const cheerList = useMemo(() => {
    const list = (dbCheers && dbCheers.length > 0) ? dbCheers : MOCK_CHEER_MESSAGES;
    return list.filter(m => m.status !== 'flagged');
  }, [dbCheers]);

  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState('heart');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      await submitCheerMessage({
        author_name: isAnonymous ? 'กองเชียร์นิรนาม' : (authorName.trim() || 'กองเชียร์สีชมพู'),
        message: message.trim(),
        sticker_id: selectedSticker,
        is_anonymous: isAnonymous,
        status: 'approved',
      });

      setMessage('');
      setAuthorName('');
      setSuccessMsg('ส่งข้อความกำลังใจสำเร็จเรียบร้อย!');
      refetchCheer();

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setSuccessMsg('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-12 md:py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <SectionTitle
          subtitle="Cheer Wall"
          title="กำแพงส่งกำลังใจ ดุสิตสวรรค์"
          highlightWord="ส่งกำลังใจ"
        />

        {/* Cheer Wall Feed (Maximized) */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              ข้อความเชียร์ล่าสุด ({cheerList.length})
            </h4>
            <span className="text-[10px] text-text-secondary font-mono">Real-time Feed</span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 pb-24 scrollbar-hide">
            {cheerList.map((msg) => {
              const sticker = STICKERS.find((s) => s.id === msg.sticker_id) || STICKERS[1];
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface-card rounded-3xl p-6 shadow-sm hover:shadow-md border border-border/20 transition-all flex gap-5 relative overflow-hidden group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {sticker.emoji}
                  </div>

                  <div className="flex flex-col flex-grow min-w-0 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-extrabold text-text-primary text-sm truncate">
                        {msg.author_name}
                      </span>
                      <span className="text-[10px] text-text-secondary flex items-center gap-1.5 font-mono shrink-0 bg-surface px-2.5 py-1 rounded-full border border-border/30">
                        <Clock size={12} className="text-primary" />
                        {formatThaiDate(msg.created_at)}
                      </span>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed pt-1">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-30 flex items-center gap-2 px-5 py-3.5 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer border border-white/20"
      >
        <Sparkles size={18} className="animate-pulse" />
        <span className="font-bold text-xs">ส่งข้อความเชียร์</span>
      </button>

      {/* BottomSheet Form */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card rounded-t-[2.5rem] p-6 md:p-8 max-h-[90vh] overflow-y-auto border-t border-border/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-w-2xl mx-auto"
            >
              <div className="w-12 h-1.5 bg-border/50 rounded-full mx-auto mb-6 cursor-grab" onClick={() => setIsFormOpen(false)} />
              
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-text-primary flex items-center justify-center gap-2">
                    <Sparkles size={20} className="text-primary" />
                    ฝากข้อความเชียร์
                  </h3>
                  <p className="text-xs text-text-secondary">
                    ร่วมส่งแรงใจให้ทัพนักกีฬาและกองเชียร์ คณะ 2 สีชมพู
                  </p>
                </div>

                {successMsg && (
                  <div className="p-3.5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Sticker Selector */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-wider block text-center">
                      เลือกสติกเกอร์ส่งกำลังใจ
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {STICKERS.map((stk) => (
                        <button
                          key={stk.id}
                          type="button"
                          onClick={() => setSelectedSticker(stk.id)}
                          className={`p-3 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                            selectedSticker === stk.id
                              ? 'bg-primary/10 border-2 border-primary shadow-xs scale-105'
                              : 'bg-surface border border-border/30 hover:border-primary/30'
                          }`}
                          title={stk.label}
                        >
                          {stk.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Author Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">
                      ชื่อผู้ส่ง
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={isAnonymous ? 'กองเชียร์นิรนาม' : authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="เช่น พี่เมธา รุ่น 24, น้องฟ้า ม.5"
                      className="w-full px-5 py-3.5 rounded-xl bg-surface border border-border/40 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 transition-all"
                    />
                  </div>

                  {/* Anonymous Checkbox */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <UserX size={14} className="text-primary" />
                      ส่งแบบไม่ระบุตัวตน (กองเชียร์นิรนาม)
                    </span>
                  </label>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-wider">
                      ข้อความส่งกำลังใจ
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความเชียร์ของคุณที่นี่..."
                      className="w-full px-5 py-3.5 rounded-xl bg-surface border border-border/40 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="w-full py-4 px-6 rounded-full bg-primary hover:bg-primary-hover disabled:bg-primary/40 text-white font-bold text-sm tracking-wide shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    {submitting ? 'กำลังส่งข้อความ...' : 'ส่งข้อความขึ้นกำแพง'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
}
