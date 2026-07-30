'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import Container from '@/components/ui/container';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useMatches, useMedals, useNews, useSports, useGallery, useAthletes, useStaff, useCheerMessages, useSiteSettings } from '@/hooks/useData';
import { Trophy, Calendar, ArrowRight, ArrowUpRight, Newspaper, Image as ImageIcon, Users, MessageSquare, Pin, UserCheck } from 'lucide-react';
import CountdownSplash, { FloatingCountdownTrigger } from '@/components/ui/countdown-splash';
export default function HomePage() {
  const [isSplashOpen, setIsSplashOpen] = React.useState(false);
  
  React.useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      setIsSplashOpen(true);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  const { data: medals, loading: medalsLoading, error: medalsError } = useMedals();
  const { data: matches, loading: matchesLoading, error: matchesError } = useMatches();
  const { data: news, loading: newsLoading, error: newsError } = useNews();
  const { data: sports, loading: sportsLoading, error: sportsError } = useSports();
  const { data: gallery, loading: galleryLoading, error: galleryError } = useGallery();
  const { data: athletes, loading: athletesLoading, error: athletesError } = useAthletes();
  const { data: staff, loading: staffLoading, error: staffError } = useStaff();
  const { data: cheer, loading: cheerLoading, error: cheerError } = useCheerMessages();
  const { data: settings, loading: settingsLoading } = useSiteSettings();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 22,
        mass: 0.75,
      },
    },
  };

  const isLoading = medalsLoading || matchesLoading || newsLoading || sportsLoading || galleryLoading || athletesLoading || staffLoading || cheerLoading || settingsLoading;
  const hasError = medalsError || matchesError || newsError || sportsError || galleryError || athletesError || staffError || cheerError;

  const topTeams = [...(medals ?? [])].sort((a, b) => b.totalPoints - a.totalPoints);

  const pinnedItems = [
    ...(sports?.filter(s => s.isPinned).map(s => ({ type: 'sport', order: s.pinnedOrder || 0, data: s, id: s.id })) || []),
    ...(matches?.filter(m => m.isPinned).map(m => ({ type: 'match', order: m.pinnedOrder || 0, data: m, id: m.id })) || []),
    ...(news?.filter(n => n.isPinned).map(n => ({ type: 'news', order: n.pinnedOrder || 0, data: n, id: n.id })) || []),
    ...(gallery?.filter(g => g.isPinned).map(g => ({ type: 'gallery', order: g.pinnedOrder || 0, data: g, id: g.id })) || []),
    ...(athletes?.filter(a => a.is_pinned).map(a => ({ type: 'athlete', order: a.pinned_order || 0, data: a, id: a.id })) || []),
    ...(staff?.filter(s => s.is_pinned).map(s => ({ type: 'staff', order: s.pinned_order || 0, data: s, id: s.id })) || []),
    ...(cheer?.filter(c => c.is_pinned).map(c => ({ type: 'cheer', order: c.pinned_order || 0, data: c, id: c.id })) || []),
  ].sort((a, b) => a.order - b.order);

  const hasAnyPinnedContent = pinnedItems.length > 0 || settings?.show_medals_on_home;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {settings?.is_countdown_active && settings.event_date && (
        <>
          <CountdownSplash 
            isOpen={isSplashOpen} 
            onClose={() => setIsSplashOpen(false)} 
          />
          {!isSplashOpen && (
            <FloatingCountdownTrigger onClick={() => setIsSplashOpen(true)} />
          )}
        </>
      )}

      {/* Floating Animated Ambient Glows */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"
      />
      <motion.div
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none -translate-x-1/2"
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-12 md:pt-20 md:pb-16">
        <Container className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-xs font-semibold text-primary tracking-wide mb-4 shadow-2xs backdrop-blur-xs cursor-pointer select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            คณะ 2 สีชมพู • ดุสิตสวรรค์ธัญมหาปราสาท
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1] max-w-4xl mx-auto"
          >
            ความสง่างามแห่งวิมาน <br />
            <span className="text-gradient-primary">ดุสิตสวรรค์ร่วมสมัย</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            นวัตกรรมระบบจัดการข้อมูล ผลการแข่งขัน สรุปเหรียญรางวัล และแกลเลอรีภาพกีฬาสี
            สะท้อนอัตลักษณ์ของสถาปัตยกรรมไทยผ่านดีไซน์ดิจิทัลพรีเมียม เรียบหรู และทันสมัย
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-4"
          >
            {/* Primary Action */}
            <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href="/schedule"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white text-xs font-bold tracking-wide px-5.5 py-3 rounded-full shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all cursor-pointer"
              >
                <Calendar size={14} className="group-hover:scale-110 transition-transform" />
                ตารางแข่งขันล่าสุด
              </Link>
            </motion.div>
            
            {/* Secondary Options (Uniform Outlined Style) */}
            <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href="/sports"
                className="group flex items-center justify-center gap-2 bg-surface-card border border-border/80 hover:border-primary/40 text-text-primary hover:text-primary text-xs font-bold tracking-wide px-5 py-3 rounded-full shadow-2xs hover:shadow-sm transition-all cursor-pointer"
              >
                <Users size={14} className="text-primary group-hover:scale-110 transition-transform" />
                รายชื่อนักกีฬา
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href="/cheer"
                className="group flex items-center justify-center gap-2 bg-surface-card border border-border/80 hover:border-primary/40 text-text-primary hover:text-primary text-xs font-bold tracking-wide px-5 py-3 rounded-full shadow-2xs hover:shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare size={14} className="text-primary group-hover:scale-110 transition-transform" />
                ให้กำลังใจนักกีฬา
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href="/about"
                className="group flex items-center justify-center gap-2 bg-surface-card border border-border/80 hover:border-primary/40 text-text-primary hover:text-primary text-xs font-bold tracking-wide px-5 py-3 rounded-full shadow-2xs hover:shadow-sm transition-all cursor-pointer"
              >
                ทำความรู้จักเรา
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-text-secondary group-hover:text-primary" />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Dynamic Pinned & Clean Slate Section */}
      <section className="py-8 md:py-14 relative">
        <Container>
          {isLoading ? (
            <LoadingState message="กำลังโหลดข้อมูลไฮไลท์..." />
          ) : hasError ? (
            <ErrorState message="เกิดข้อผิดพลาดในการโหลดข้อมูล" />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="space-y-12"
            >
              {/* Clean Slate Empty Banner */}
              {!hasAnyPinnedContent && (
                <div className="bg-surface-card border border-border/30 rounded-3xl p-10 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <Pin size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">
                    ยังไม่มีรายการปักหมุดบนหน้าแรก
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
                    หน้าแรกถูกกำหนดเป็น Clean Slate เพื่อรอรับข้อมูลแมตช์สำคัญ ข่าวสาร หรือตารางคะแนนที่แอดมินปักหมุดผ่านศูนย์ควบคุม (Admin Panel)
                  </p>
                </div>
              )}

              {settings?.show_medals_on_home && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <Trophy size={18} className="text-accent-gold" />
                      สรุปเหรียญรางวัล
                    </h2>
                    <Link href="/scoreboard" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                      ดูคะแนนเต็ม <ArrowUpRight size={13} />
                    </Link>
                  </div>
                  <div className="bg-surface-card border border-border/40 rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-4 px-2">
                      <div>คณะสี</div>
                      <div className="w-8 sm:w-12 text-center text-accent-gold">🥇</div>
                      <div className="w-8 sm:w-12 text-center text-[#C0C0C0]">🥈</div>
                      <div className="w-8 sm:w-12 text-center text-[#CD7F32]">🥉</div>
                      <div className="w-10 sm:w-14 text-center">รวม</div>
                    </div>
                    <div className="space-y-2">
                      {topTeams.map((team, index) => (
                        <div
                          key={team.id}
                          className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-6 items-center p-3 sm:p-4 rounded-2xl border transition-all ${
                            index === 0
                              ? 'bg-accent-gold/5 border-accent-gold/20'
                              : 'bg-surface border-border/30 hover:border-border/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold w-4 ${index === 0 ? 'text-accent-gold' : 'text-text-secondary'}`}>
                              {index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.colorHex }} />
                              <span className="font-bold text-text-primary text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{team.name}</span>
                            </div>
                          </div>
                          <div className="w-8 sm:w-12 text-center font-bold text-text-primary text-xs sm:text-sm">{team.gold}</div>
                          <div className="w-8 sm:w-12 text-center font-bold text-text-primary text-xs sm:text-sm">{team.silver}</div>
                          <div className="w-8 sm:w-12 text-center font-bold text-text-primary text-xs sm:text-sm">{team.bronze}</div>
                          <div className="w-10 sm:w-14 text-center font-extrabold text-primary text-xs sm:text-sm">{team.totalPoints}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {pinnedItems.map((item) => (
                <motion.div key={`${item.type}-${item.id}`} variants={itemVariants} className="space-y-6">
                  {item.type === 'match' && (
                    <div className="bg-surface-card border border-border/40 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/10 transition-colors shadow-xs">
                      <div className="flex flex-col gap-1 shrink-0">
                        <span className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">{(item.data as any).sportName}</span>
                        <h4 className="font-bold text-text-primary text-xs sm:text-sm">{(item.data as any).stage}</h4>
                        <span className="text-[10px] text-text-secondary">{(item.data as any).time} น. @ {(item.data as any).location}</span>
                      </div>
                      <div className={`flex items-center justify-center bg-surface/50 border border-border/20 rounded-xl shrink-0 ${
                        (item.data as any).matchType === 'track' ? 'p-3 w-full sm:w-[320px]' : 'px-4 py-2.5 gap-4 sm:gap-6'
                      }`}>
                        {(item.data as any).matchType === 'track' && (item.data as any).competitors ? (
                          <div className="w-full flex flex-col gap-1.5">
                            {[...(item.data as any).competitors].sort((a, b) => {
                              if ((item.data as any).status === 'completed') {
                                return (a.place || 99) - (b.place || 99);
                              }
                              return a.lane - b.lane;
                            }).map((comp: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] py-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[9px] text-text-secondary w-4 text-center bg-surface border border-border/40 rounded-sm">L{comp.lane}</span>
                                  <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: comp.colorHex }} />
                                  <span className="font-bold text-text-primary truncate max-w-[100px] sm:max-w-[140px]">{comp.name}</span>
                                </div>
                                {(item.data as any).status === 'completed' ? (
                                  <div className="flex items-center gap-2 font-mono">
                                    <span className="font-bold text-primary">{comp.score ?? '-'}</span>
                                    {comp.place && (
                                      <span className={`text-[9px] px-1 py-0.5 rounded-sm font-bold ${
                                        comp.place === 1 ? 'bg-accent-gold/20 text-accent-gold' :
                                        comp.place === 2 ? 'bg-slate-300/20 text-slate-500' :
                                        comp.place === 3 ? 'bg-amber-700/20 text-amber-700' :
                                        'bg-surface text-text-secondary'
                                      }`}>
                                        #{comp.place}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-text-secondary">-</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 sm:gap-6 w-full justify-between">
                            <div className="flex items-center gap-1.5 text-right w-20 justify-end">
                              <span className="text-[11px] font-bold text-text-primary truncate">{(item.data as any).teamA?.name}</span>
                              <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: (item.data as any).teamA?.colorHex || '#ccc' }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-text-secondary shrink-0 min-w-[36px] text-center">
                              {(item.data as any).status === 'completed' ? (
                                <span className="text-primary">{(item.data as any).teamA?.score ?? '-'} - {(item.data as any).teamB?.score ?? '-'}</span>
                              ) : (
                                <span className="text-[10px] tracking-widest">VS</span>
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 text-left w-20">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: (item.data as any).teamB?.colorHex || '#ccc' }} />
                              <span className="text-[11px] font-bold text-text-primary truncate">{(item.data as any).teamB?.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {item.type === 'news' && (
                    <Link href={`/news`} className="block group">
                      <div className="bg-surface-card rounded-3xl overflow-hidden border border-border/40 hover:border-primary/30 transition-all shadow-xs flex flex-col sm:flex-row items-stretch">
                        <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden">
                          {(item.data as any).imageUrl ? (
                            <ImageWithFallback src={(item.data as any).imageUrl} alt={(item.data as any).title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-surface flex items-center justify-center text-primary/20"><Newspaper size={32} /></div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">{(item.data as any).category}</span>
                          <h3 className="font-extrabold text-text-primary text-sm sm:text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {(item.data as any).title}
                          </h3>
                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                            {(item.data as any).excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}

                  {item.type === 'gallery' && (
                    <div className="bg-surface border border-border/40 p-2 rounded-3xl shadow-sm relative group overflow-hidden">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                        <ImageWithFallback src={(item.data as any).imageUrl} alt={(item.data as any).title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-surface-card/80 backdrop-blur-md border border-white/10 shadow-lg">
                        <h4 className="font-bold text-text-primary text-xs">{(item.data as any).title}</h4>
                        <p className="text-[10px] text-text-secondary mt-0.5">{(item.data as any).date}</p>
                      </div>
                    </div>
                  )}

                  {item.type === 'athlete' && (
                    <div className="bg-surface border border-border/40 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface shrink-0 border-2 border-primary/20">
                         {(item.data as any).avatar_url ? (
                           <img src={(item.data as any).avatar_url} alt={(item.data as any).name} className="w-full h-full object-cover" />
                         ) : (
                           <Users className="w-6 h-6 m-auto text-primary" />
                         )}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{(item.data as any).name}</h4>
                        <p className="text-xs text-primary font-medium">{(item.data as any).team} • {(item.data as any).position}</p>
                      </div>
                    </div>
                  )}

                  {item.type === 'staff' && (
                    <div className="bg-surface border border-border/40 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface shrink-0 border-2 border-primary/20">
                         {(item.data as any).image_url ? (
                           <img src={(item.data as any).image_url} alt={(item.data as any).name} className="w-full h-full object-cover" />
                         ) : (
                           <UserCheck className="w-6 h-6 m-auto text-primary" />
                         )}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{(item.data as any).name}</h4>
                        <p className="text-xs text-text-secondary">{(item.data as any).position} • {(item.data as any).department}</p>
                      </div>
                    </div>
                  )}

                  {item.type === 'cheer' && (
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-xs relative">
                       <MessageSquare className="absolute top-4 right-4 text-primary/10" size={48} />
                       <p className="font-medium text-text-primary text-sm italic mb-4 relative z-10">"{(item.data as any).message}"</p>
                       <p className="text-xs text-text-secondary font-bold">- {(item.data as any).author_name}</p>
                    </div>
                  )}

                  {item.type === 'sport' && (
                    <div className="bg-surface-card border border-border/40 rounded-3xl p-6 shadow-xs flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <Trophy size={20} />
                       </div>
                       <div>
                         <h4 className="font-bold text-text-primary text-sm">{(item.data as any).name}</h4>
                         <p className="text-xs text-text-secondary line-clamp-1">{(item.data as any).description}</p>
                       </div>
                    </div>
                  )}
                </motion.div>
              ))}

            </motion.div>
          )}
        </Container>
      </section>
    </div>
  );
}
