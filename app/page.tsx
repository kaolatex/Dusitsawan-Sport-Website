'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import Container from '@/components/ui/container';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useMatches, useMedals, useNews } from '@/hooks/useData';
import { Trophy, Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  const { data: medals, loading: medalsLoading, error: medalsError } = useMedals();
  const { data: matches, loading: matchesLoading, error: matchesError } = useMatches();
  const { data: news, loading: newsLoading, error: newsError } = useNews();

  const topTeams = [...(medals ?? [])].sort((a, b) => b.totalPoints - a.totalPoints);
  const featuredMatches = (matches ?? []).slice(0, 3);
  const latestNews = (news ?? []).slice(0, 3);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const isLoading = medalsLoading || matchesLoading || newsLoading;
  const hasError = medalsError || matchesError || newsError;

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-gold/3 rounded-full blur-3xl -z-10 -translate-x-1/2" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-12 md:pt-20 md:pb-16">
        <Container className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary tracking-wide mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            คณะ 2 สีชมพู • ดุสิตสวรรค์ธัญมหาปราสาท
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1] max-w-4xl mx-auto"
          >
            ความสง่างามแห่งวิมาน <br />
            <span className="text-gradient-primary">ดุสิตสวรรค์ร่วมสมัย</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            นวัตกรรมระบบจัดการข้อมูล ผลการแข่งขัน สรุปเหรียญรางวัล และแกลเลอรีภาพกีฬาสี
            สะท้อนอัตลักษณ์ของสถาปัตยกรรมไทยผ่านดีไซน์ดิจิทัลพรีเมียม เรียบหรู และทันสมัย
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-3.5 pt-4"
          >
            <Link
              href="/schedule"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wide px-6 py-3 rounded-full shadow-xs transition-colors cursor-pointer"
            >
              ตารางแข่งขันล่าสุด
            </Link>
            <Link
              href="/about"
              className="bg-surface-card hover:bg-surface border border-border text-text-primary text-xs font-bold tracking-wide px-6 py-3 rounded-full transition-all flex items-center gap-1 group cursor-pointer"
            >
              ทำความรู้จักเรา
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </Container>
      </section>

      <section className="py-12 md:py-16 relative">
        <Container>
          {isLoading ? (
            <LoadingState />
          ) : hasError ? (
            <ErrorState message={medalsError || matchesError || newsError || 'เกิดข้อผิดพลาด'} />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="space-y-14"
            >
              {/* Matches + Scoreboard Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <Calendar size={18} className="text-primary" />
                      การแข่งขันนัดสำคัญ
                    </h2>
                    <Link href="/schedule" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                      ทั้งหมด <ArrowUpRight size={13} />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {featuredMatches.length === 0 ? (
                      <p className="text-xs text-text-secondary text-center py-6">ยังไม่มีการแข่งขัน</p>
                    ) : (
                      featuredMatches.map(match => (
                        <div
                          key={match.id}
                          className="bg-surface-card border border-border/40 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/10 transition-colors shadow-xs"
                        >
                          <div className="flex flex-col gap-1 shrink-0">
                            <span className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">{match.sportName}</span>
                            <h4 className="font-bold text-text-primary text-xs sm:text-sm">{match.stage}</h4>
                            <span className="text-[10px] text-text-secondary">{match.time} น. @ {match.location}</span>
                          </div>

                          <div className="flex items-center gap-4 sm:gap-6 bg-surface/50 border border-border/20 px-4 py-2.5 rounded-xl shrink-0">
                            <div className="flex items-center gap-1.5 text-right w-20 justify-end">
                              <span className="text-[11px] font-bold text-text-primary truncate">{match.teamA.name.split(' ').pop()}</span>
                              <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: match.teamA.colorHex }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-text-secondary shrink-0 min-w-[36px] text-center">
                              {match.status === 'completed' ? (
                                <span className="text-primary">{match.teamA.score} - {match.teamB.score}</span>
                              ) : (
                                <span className="text-[10px] tracking-widest">VS</span>
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 text-left w-20 justify-start">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: match.teamB.colorHex }} />
                              <span className="text-[11px] font-bold text-text-primary truncate">{match.teamB.name.split(' ').pop()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-4">
                  <div className="bg-surface-card border border-border/40 rounded-3xl p-6 shadow-xs space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/3 rounded-full translate-x-12 -translate-y-12" />
                    <div className="border-b border-border/40 pb-4 flex items-center justify-between">
                      <h3 className="font-extrabold text-text-primary text-sm flex items-center gap-2">
                        <Trophy size={16} className="text-primary" />
                        สรุปอันดับคะแนนรวม
                      </h3>
                      <Link href="/scoreboard" className="text-[10px] font-bold text-primary hover:underline">
                        ดูแบบละเอียด
                      </Link>
                    </div>
                    <div className="space-y-3.5">
                      {topTeams.map((team, idx) => (
                        <div
                          key={team.id}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                            team.id === 'team-pink'
                              ? 'bg-primary/5 border-primary/20 shadow-2xs'
                              : 'bg-transparent border-border/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              idx === 0 ? 'bg-accent-gold text-white' : 'bg-surface text-text-secondary'
                            }`}>
                              {idx + 1}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-bold text-text-primary text-xs">{team.name.split(' (')[0]}</span>
                              <div className="flex items-center gap-2 text-[9px] text-text-secondary mt-0.5">
                                <span>🥇 {team.gold}</span>
                                <span>🥈 {team.silver}</span>
                                <span>🥉 {team.bronze}</span>
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-primary text-xs bg-surface-card border border-border/40 px-2.5 py-1 rounded-lg">
                            {team.totalPoints}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* News Section - Full Width 3 Columns */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Trophy size={18} className="text-primary" />
                    ข่าวสารและเหตุการณ์สำคัญ
                  </h2>
                  <Link href="/news" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                    ข่าวทั้งหมด <ArrowUpRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestNews.length === 0 ? (
                    <p className="text-xs text-text-secondary col-span-full text-center py-6">ยังไม่มีข่าวสาร</p>
                  ) : (
                    latestNews.map(item => (
                      <Link
                        key={item.id}
                        href="/news"
                        className="bg-surface-card border border-border/40 rounded-2xl overflow-hidden shadow-xs hover:border-primary/20 hover:-translate-y-0.5 transition-all flex flex-col group"
                      >
                        {item.imageUrl && (
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.title}
                            containerClassName="h-52 md:h-56 rounded-2xl"
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="p-4 flex flex-col gap-2 flex-grow">
                          <span className="text-[9px] font-bold text-accent-gold uppercase tracking-wider">{item.date}</span>
                          <h3 className="font-bold text-text-primary text-xs line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                            {item.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </Container>
      </section>
    </div>
  );
}
