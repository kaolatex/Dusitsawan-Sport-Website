'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useMatches } from '@/hooks/useData';
import { MatchStatus } from '@/types';
import { Calendar, Clock, MapPin, Play } from 'lucide-react';

export default function SchedulePage() {
  const [statusFilter, setStatusFilter] = useState<'all' | MatchStatus>('all');
  const { data: schedule, loading, error } = useMatches();

  const filteredMatches = statusFilter === 'all'
    ? (schedule ?? [])
    : (schedule ?? []).filter(match => match.status === statusFilter);

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold tracking-wider uppercase animate-pulse">
            <Play size={10} className="fill-red-500" />
            กำลังแข่งขัน
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold tracking-wider">
            เร็วๆ นี้
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-text-secondary/10 text-text-secondary text-[10px] font-bold tracking-wider">
            แข่งขันเสร็จสิ้น
          </span>
        );
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
          subtitle="โปรแกรมและผลการแข่งขัน"
          title="ตารางแข่งขันและผลการแข่งขันกีฬาสี"
          highlightWord="ตารางแข่งขัน"
        />

        {/* Tab Filters - Horizontal scroll on mobile */}
        <div className="flex gap-2 mb-10 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'live', label: 'กำลังแข่ง' },
            { id: 'upcoming', label: 'เร็วๆ นี้' },
            { id: 'completed', label: 'แข่งเสร็จแล้ว' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-primary border-primary text-white shadow-xs'
                  : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="space-y-4">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 bg-surface-card border border-border/40 rounded-2xl text-text-secondary text-xs">
                ไม่พบการแข่งขันตามสถานะที่เลือก
              </div>
            ) : (
              filteredMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-surface-card border border-border/40 rounded-2xl p-5 md:p-6 shadow-xs hover:border-primary/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(match.status)}
                      <span className="text-xs font-bold text-gradient-gold uppercase tracking-wider">{match.sportName}</span>
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm">{match.stage}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-text-secondary">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {match.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {match.time} น.</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {match.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-surface/50 border border-border/30 rounded-2xl p-4 md:px-8 md:py-4.5 w-full md:w-[460px] shrink-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 w-[42%] text-right justify-end">
                        <span className="font-bold text-text-primary text-xs sm:text-sm truncate">{match.teamA.name}</span>
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: match.teamA.colorHex }}
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center px-4 shrink-0">
                        {match.status === 'completed' ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-base md:text-xl font-bold font-mono ${match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamA.score > match.teamB.score ? 'text-primary' : 'text-text-secondary'}`}>
                              {match.teamA.score}
                            </span>
                            <span className="text-border text-xs">-</span>
                            <span className={`text-base md:text-xl font-bold font-mono ${match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamB.score > match.teamA.score ? 'text-primary' : 'text-text-secondary'}`}>
                              {match.teamB.score}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-text-secondary tracking-widest px-2.5 py-0.5 bg-surface border border-border/40 rounded-md">VS</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-[42%] text-left justify-start">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: match.teamB.colorHex }}
                        />
                        <span className="font-bold text-text-primary text-xs sm:text-sm truncate">{match.teamB.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </Container>
  );
}
