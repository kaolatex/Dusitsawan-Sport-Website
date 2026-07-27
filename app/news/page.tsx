'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useNews } from '@/hooks/useData';
import { Calendar } from 'lucide-react';

export default function NewsPage() {
  const [filter, setFilter] = useState<'all' | 'sports' | 'announcement' | 'activity'>('all');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const { data: newsList, loading, error } = useNews();

  const news = newsList ?? [];

  const filteredNews = filter === 'all'
    ? news
    : news.filter(item => item.category === filter);

  const activeNews = news.find(item => item.id === selectedNewsId);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sports': return 'ข่าวกีฬา';
      case 'announcement': return 'ประกาศ';
      case 'activity': return 'กิจกรรมคณะ';
      default: return 'ทั่วไป';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sports': return 'bg-primary/10 text-primary';
      case 'announcement': return 'bg-accent-gold/10 text-accent-gold';
      case 'activity': return 'bg-blue-600/10 text-blue-600';
      default: return 'bg-surface text-text-secondary';
    }
  };

  return (
    <Container className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle
          subtitle="ข่าวประชาสัมพันธ์"
          title="ข่าวสารและกิจกรรมล่าสุด"
          highlightWord="ข่าวสาร"
        />

        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'sports', label: 'ข่าวกีฬา' },
            { id: 'announcement', label: 'ประกาศ' },
            { id: 'activity', label: 'กิจกรรม' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => {
                setFilter(btn.id as typeof filter);
                setSelectedNewsId(null);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                filter === btn.id
                  ? 'bg-primary border-primary text-white shadow-xs'
                  : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredNews.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedNewsId(item.id)}
                className="bg-surface-card border border-border/40 rounded-2xl overflow-hidden shadow-xs hover:border-primary/20 hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer group"
              >
                {item.imageUrl && (
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.title}
                    containerClassName="aspect-video w-full"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="p-5 flex flex-col flex-grow gap-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className="text-text-secondary flex items-center gap-1">
                      <Calendar size={11} />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto pt-2 text-[11px] font-semibold text-primary group-hover:underline">
                    อ่านเพิ่มเติม...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-surface-card border border-border rounded-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-xl"
            >
              <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(activeNews.category)}`}>
                    {getCategoryLabel(activeNews.category)}
                  </span>
                  <button
                    onClick={() => setSelectedNewsId(null)}
                    className="px-3 py-1 rounded-full bg-surface text-text-secondary hover:text-text-primary hover:bg-border/30 text-xs transition-colors cursor-pointer"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-text-primary leading-tight">
                  {activeNews.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-text-secondary border-b border-border/40 pb-4">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {activeNews.date}</span>
                  <span>•</span>
                  <span>ฝ่ายสื่อสารมวลชน คณะ 2</span>
                </div>

                {activeNews.imageUrl && (
                  <ImageWithFallback
                    src={activeNews.imageUrl}
                    alt={activeNews.title}
                    containerClassName="aspect-video w-full rounded-2xl"
                    className="object-cover w-full h-full"
                  />
                )}

                <div className="text-xs md:text-sm text-text-secondary leading-relaxed space-y-4">
                  {activeNews.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </Container>
  );
}
