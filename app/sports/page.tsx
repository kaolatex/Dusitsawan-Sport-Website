'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useSports } from '@/hooks/useData';
import { Athlete } from '@/types';
import { Trophy, Target, Activity, Gamepad2, Zap, ChevronRight, User } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Trophy,
  Target,
  Activity,
  Gamepad2,
  Zap,
};

function getInitial(name: string): string {
  const cleanName = name.replace(/^(นาย|น\.ส\.|นาง|ด\.ช\.|ด\.ญ\.)\s*/g, '');
  return cleanName.charAt(0) || '?';
}

function AthleteCard({ athlete }: { athlete: Athlete }) {
  const [imgError, setImgError] = React.useState(false);
  const hasAvatar = !!athlete.avatarUrl && !imgError;

  return (
    <div className="bg-surface-card border border-border/40 rounded-2xl p-4 flex items-center gap-4 hover:border-primary/20 hover:shadow-xs transition-all group">
      <div className="w-11 h-11 rounded-full shrink-0 overflow-hidden border border-border/30 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20">
        {hasAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={athlete.avatarUrl}
            alt={athlete.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-primary font-bold text-sm select-none">
            {getInitial(athlete.name)}
          </span>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-text-primary text-xs truncate group-hover:text-primary transition-colors">
          {athlete.name}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
          {athlete.position && <span>{athlete.position}</span>}
          {athlete.number && (
            <span className="px-1.5 py-0 rounded bg-primary/5 text-primary font-bold">
              #{athlete.number}
            </span>
          )}
        </div>
        {athlete.team && (
          <span className="text-[9px] text-accent-gold font-medium mt-0.5 tracking-wide">
            {athlete.team}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3">
        <User size={20} className="text-primary/40" />
      </div>
      <p className="text-xs text-text-secondary">{message}</p>
    </div>
  );
}

function RulesList({ rules }: { rules: string[] }) {
  return (
    <ul className="space-y-3">
      {rules.map((rule, idx) => (
        <li key={idx} className="flex items-start gap-3 text-xs text-text-secondary">
          <span className="w-5 h-5 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            {idx + 1}
          </span>
          <span className="leading-relaxed">{rule}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SportsPage() {
  const { data: sports, loading, error } = useSports();
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [activeSubCatId, setActiveSubCatId] = useState<string | null>(null);

  React.useEffect(() => {
    if (sports && sports.length > 0 && !activeSport) {
      setActiveSport(sports[0].id);
    }
  }, [sports, activeSport]);

  const currentSport = useMemo(
    () => sports?.find(s => s.id === activeSport) ?? sports?.[0],
    [activeSport, sports]
  );

  React.useEffect(() => {
    if (!currentSport) return;
    if (currentSport.subCategories && currentSport.subCategories.length > 0) {
      setActiveSubCatId(currentSport.subCategories[0].id);
    } else {
      setActiveSubCatId(null);
    }
  }, [currentSport]);

  const activeSubCat = useMemo(() => {
    if (!activeSubCatId || !currentSport?.subCategories) return null;
    return currentSport.subCategories.find(sc => sc.id === activeSubCatId) || null;
  }, [activeSubCatId, currentSport]);

  const displayRules = activeSubCat?.rules || currentSport?.rules || [];
  const displayAthletes = activeSubCat?.athletes || currentSport?.athletes || [];
  const displayDescription = activeSubCat?.description || currentSport?.description || '';

  const renderIcon = (name?: string, size?: number) => {
    if (!name) return <Trophy className="w-5 h-5" />;
    const IconComponent = iconMap[name];
    if (!IconComponent) return <Trophy className="w-5 h-5" />;
    return <IconComponent className="w-5 h-5" size={size} />;
  };

  if (loading) {
    return (
      <Container className="py-12 md:py-16">
        <LoadingState />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12 md:py-16">
        <ErrorState message={error} />
      </Container>
    );
  }

  if (!currentSport) {
    return (
      <Container className="py-12 md:py-16">
        <ErrorState message="ยังไม่มีข้อมูลกีฬา" />
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle
          subtitle="ประเภทกีฬา"
          title="การแข่งขันกีฬาและกฎกติกา"
          highlightWord="กีฬา"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-2">
            {sports?.map(sport => {
              const isActive = sport.id === activeSport;
              return (
                <button
                  key={sport.id}
                  onClick={() => setActiveSport(sport.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'bg-primary/5 text-primary'
                    }`}>
                      {renderIcon(sport.iconName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{sport.name}</span>
                      {sport.subCategories && sport.subCategories.length > 0 && (
                        <span className={`text-[10px] mt-0.5 ${isActive ? 'text-white/60' : 'text-text-secondary'}`}>
                          {sport.subCategories.length} ประเภทย่อย
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${
                      isActive ? 'translate-x-0.5 text-white' : 'text-text-secondary group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-card border border-border/40 p-6 md:p-8 rounded-3xl shadow-xs">
              <div className="flex items-center gap-4 border-b border-border/40 pb-6">
                <div className="p-3.5 rounded-2xl bg-primary/5 text-primary">
                  {renderIcon(currentSport.iconName)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{currentSport.name}</h3>
                  <span className="text-xs text-accent-gold font-medium tracking-wide">
                    {activeSubCat ? activeSubCat.name : 'กติกาการแข่งขันอย่างเป็นทางการ'}
                  </span>
                </div>
              </div>

              {currentSport.subCategories && currentSport.subCategories.length > 0 && (
                <div className="flex gap-2 pt-6 pb-2 overflow-x-auto scrollbar-hide touch-pan-x md:flex-wrap md:overflow-visible">
                  {currentSport.subCategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCatId(sub.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer shrink-0 ${
                        activeSubCatId === sub.id
                          ? 'bg-primary border-primary text-white shadow-xs'
                          : 'bg-surface border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubCatId || currentSport.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 pt-4"
                >
                  {displayDescription && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-text-primary text-sm">รายละเอียดทั่วไป</h4>
                      <p className="text-text-secondary text-xs leading-relaxed">{displayDescription}</p>
                    </div>
                  )}

                  {displayRules.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-text-primary text-sm">กฎกติกาการแข่งขัน</h4>
                      <RulesList rules={displayRules} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-surface-card border border-border/40 p-6 md:p-8 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between pb-5 border-b border-border/40">
                <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                  <User size={15} className="text-primary" />
                  รายชื่อนักกีฬา
                  {activeSubCat && (
                    <span className="text-[10px] text-accent-gold font-medium ml-1">
                      ({activeSubCat.name})
                    </span>
                  )}
                </h4>
                {displayAthletes.length > 0 && (
                  <span className="text-[10px] text-text-secondary font-medium bg-surface px-2.5 py-0.5 rounded-full">
                    {displayAthletes.length} คน
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`athletes-${activeSubCatId || currentSport.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pt-5"
                >
                  {displayAthletes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayAthletes.map(athlete => (
                        <AthleteCard key={athlete.id} athlete={athlete} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="กำลังอัปเดตรายชื่อนักกีฬา — ข้อมูลจะถูกเพิ่มเร็วๆ นี้" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
