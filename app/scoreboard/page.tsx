'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useMedals } from '@/hooks/useData';
import { Trophy } from 'lucide-react';

export default function ScoreboardPage() {
  const { data: teams, loading, error } = useMedals();

  const sortedTeams = [...(teams ?? [])].sort((a, b) => {
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    if (b.bronze !== a.bronze) return b.bronze - a.bronze;
    return b.totalPoints - a.totalPoints;
  });

  return (
    <Container className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle
          subtitle="สรุปเหรียญรางวัล"
          title="ตารางคะแนนรวมและเหรียญรางวัล"
          highlightWord="คะแนนรวม"
        />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
              {sortedTeams[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-surface-card border border-border/40 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center order-2 md:order-1"
                >
                  <span className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm mb-4">2</span>
                  <div className="w-4 h-4 rounded-full border border-black/10 mb-2" style={{ backgroundColor: sortedTeams[1].colorHex }} />
                  <h3 className="font-bold text-text-primary text-sm truncate w-full">{sortedTeams[1].name}</h3>
                  <p className="text-[11px] text-text-secondary mt-1">คะแนนรวม: {sortedTeams[1].totalPoints} คะแนน</p>
                  <div className="flex gap-4 mt-4 text-xs font-semibold text-text-primary">
                    <span>🥇 {sortedTeams[1].gold}</span>
                    <span>🥈 {sortedTeams[1].silver}</span>
                    <span>🥉 {sortedTeams[1].bronze}</span>
                  </div>
                </motion.div>
              )}

              {sortedTeams[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-b from-accent-gold/10 to-surface-card border border-accent-gold/30 rounded-3xl p-8 text-center shadow-md flex flex-col items-center order-1 md:order-2 scale-102 md:translate-y-[-10px] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 rounded-full translate-x-8 -translate-y-8" />
                  <div className="w-12 h-12 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold text-base mb-4 shadow-xs animate-bounce">
                    <Trophy size={20} />
                  </div>
                  <div className="w-5 h-5 rounded-full border border-black/10 mb-3" style={{ backgroundColor: sortedTeams[0].colorHex }} />
                  <h3 className="font-extrabold text-text-primary text-base truncate w-full">{sortedTeams[0].name}</h3>
                  <p className="text-xs text-text-secondary mt-1 font-semibold">คะแนนรวม: {sortedTeams[0].totalPoints} คะแนน</p>
                  <div className="flex gap-5 mt-5 text-sm font-bold text-text-primary">
                    <span>🥇 {sortedTeams[0].gold}</span>
                    <span>🥈 {sortedTeams[0].silver}</span>
                    <span>🥉 {sortedTeams[0].bronze}</span>
                  </div>
                </motion.div>
              )}

              {sortedTeams[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-surface-card border border-border/40 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center order-3"
                >
                  <span className="w-10 h-10 rounded-full bg-amber-700/10 text-amber-800 flex items-center justify-center font-bold text-sm mb-4">3</span>
                  <div className="w-4 h-4 rounded-full border border-black/10 mb-2" style={{ backgroundColor: sortedTeams[2].colorHex }} />
                  <h3 className="font-bold text-text-primary text-sm truncate w-full">{sortedTeams[2].name}</h3>
                  <p className="text-[11px] text-text-secondary mt-1">คะแนนรวม: {sortedTeams[2].totalPoints} คะแนน</p>
                  <div className="flex gap-4 mt-4 text-xs font-semibold text-text-primary">
                    <span>🥇 {sortedTeams[2].gold}</span>
                    <span>🥈 {sortedTeams[2].silver}</span>
                    <span>🥉 {sortedTeams[2].bronze}</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-surface-card border border-border/40 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-surface/50 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                      <th className="py-4 px-6 text-center w-16">อันดับ</th>
                      <th className="py-4 px-6">คณะสี</th>
                      <th className="py-4 px-6 text-center w-24">🥇 ทอง</th>
                      <th className="py-4 px-6 text-center w-24">🥈 เงิน</th>
                      <th className="py-4 px-6 text-center w-24">🥉 ทองแดง</th>
                      <th className="py-4 px-6 text-center w-28">คะแนนรวม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {sortedTeams.map((team, index) => (
                      <tr key={team.id} className="hover:bg-surface/30 transition-colors">
                        <td className="py-4 px-6 text-center font-bold text-text-secondary">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: team.colorHex }} />
                            <span className="font-bold text-text-primary">{team.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-text-primary">{team.gold}</td>
                        <td className="py-4 px-6 text-center font-semibold text-text-primary">{team.silver}</td>
                        <td className="py-4 px-6 text-center font-semibold text-text-primary">{team.bronze}</td>
                        <td className="py-4 px-6 text-center font-bold text-primary font-mono text-sm">{team.totalPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </Container>
  );
}
