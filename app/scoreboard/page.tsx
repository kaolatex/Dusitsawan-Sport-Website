'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useMedals } from '@/hooks/useData';
import { Trophy, Medal } from 'lucide-react';

export default function ScoreboardPage() {
  const { data: teams, loading, error } = useMedals();

  const computedTeams = (teams ?? []).map(team => {
    // Calculate total score from medals (Gold x 5, Silver x 3, Bronze x 1)
    const calculatedScore = (team.gold * 5) + (team.silver * 3) + (team.bronze * 1);
    // Add any extra base points from totalPoints if it's larger than the medal calculation, 
    // or just use the calculated score directly as requested to avoid 0 points issue.
    const finalScore = Math.max(calculatedScore, team.totalPoints);
    return { ...team, finalScore };
  });

  const sortedTeams = computedTeams.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    return b.bronze - a.bronze;
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Page Background Aura (Neutral) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-slate-100/50 via-slate-50/10 to-transparent dark:from-zinc-900/30 dark:via-zinc-900/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Container className="pt-28 md:pt-36 pb-16 relative z-10">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end mt-10">
              {/* 2nd Place */}
              {sortedTeams[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="bg-white/70 dark:bg-zinc-800/80 backdrop-blur-lg border border-black/5 dark:border-white/10 shadow-xl rounded-3xl p-6 text-center flex flex-col items-center order-2 md:order-1 relative overflow-hidden"
                >
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-zinc-300/40 dark:bg-zinc-400/20 rounded-full blur-3xl pointer-events-none" />
                  <span className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-lg mb-4 shadow-sm">2</span>
                  <div className="w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800 mb-3 shadow-md ring-2 ring-black/5 dark:ring-white/10" style={{ backgroundColor: sortedTeams[1].colorHex }} />
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-base truncate w-full tracking-wide">{sortedTeams[1].name || sortedTeams[1].colorName}</h3>
                  <p className="text-xl text-zinc-900 dark:text-white mt-1 font-black tracking-tight">{sortedTeams[1].finalScore} <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">คะแนน</span></p>
                  <div className="flex gap-4 mt-5 text-sm font-semibold bg-black/5 dark:bg-white/10 px-4 py-2 rounded-xl">
                    <span className="flex items-center gap-1.5"><Medal size={14} className="text-yellow-500 fill-yellow-500/20" /> <span className="text-zinc-700 dark:text-zinc-100">{sortedTeams[1].gold}</span></span>
                    <span className="flex items-center gap-1.5"><Medal size={14} className="text-zinc-400 fill-zinc-400/20" /> <span className="text-zinc-700 dark:text-zinc-100">{sortedTeams[1].silver}</span></span>
                    <span className="flex items-center gap-1.5"><Medal size={14} className="text-orange-500 fill-orange-500/20" /> <span className="text-zinc-700 dark:text-zinc-100">{sortedTeams[1].bronze}</span></span>
                  </div>
                </motion.div>
              )}

              {/* 1st Place */}
              {sortedTeams[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-lg border border-black/5 dark:border-white/10 shadow-2xl dark:shadow-amber-500/20 rounded-3xl p-8 text-center flex flex-col items-center order-1 md:order-2 md:-translate-y-6 relative overflow-hidden z-20"
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/30 dark:bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20 ring-4 ring-amber-500/20 relative">
                    <Trophy size={28} className="drop-shadow-sm text-white" />
                    <span className="absolute -bottom-2 bg-amber-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-amber-400">CHAMPION</span>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full border-[3px] border-white dark:border-zinc-800 mb-3 shadow-md ring-2 ring-black/5 dark:ring-white/10" style={{ backgroundColor: sortedTeams[0].colorHex }} />
                  <h3 className="font-black text-zinc-900 dark:text-white text-2xl truncate w-full tracking-wide">{sortedTeams[0].name || sortedTeams[0].colorName}</h3>
                  <p className="text-3xl mt-1 font-black tracking-tighter text-amber-500 drop-shadow-sm">
                    {sortedTeams[0].finalScore} <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tracking-normal">คะแนน</span>
                  </p>
                  
                  <div className="flex gap-5 mt-5 text-base font-bold bg-amber-500/5 dark:bg-white/5 border border-amber-500/10 dark:border-white/10 px-5 py-3 rounded-2xl w-full justify-center">
                    <span className="flex flex-col items-center gap-1"><span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">ทอง</span><span className="flex items-center gap-1"><Medal size={16} className="text-yellow-500 fill-yellow-500/20" /><span className="text-zinc-900 dark:text-white">{sortedTeams[0].gold}</span></span></span>
                    <span className="flex flex-col items-center gap-1"><span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">เงิน</span><span className="flex items-center gap-1"><Medal size={16} className="text-zinc-400 fill-zinc-400/20" /><span className="text-zinc-900 dark:text-white">{sortedTeams[0].silver}</span></span></span>
                    <span className="flex flex-col items-center gap-1"><span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">ทองแดง</span><span className="flex items-center gap-1"><Medal size={16} className="text-orange-500 fill-orange-500/20" /><span className="text-zinc-900 dark:text-white">{sortedTeams[0].bronze}</span></span></span>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {sortedTeams[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="bg-white/70 dark:bg-zinc-800/80 backdrop-blur-lg border border-black/5 dark:border-white/10 shadow-xl rounded-3xl p-6 text-center flex flex-col items-center order-3 relative overflow-hidden"
                >
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-400/20 dark:bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />
                  <span className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 border border-orange-200 dark:border-orange-700/50 text-orange-700 dark:text-orange-400 flex items-center justify-center font-bold text-lg mb-4 shadow-sm">3</span>
                  <div className="w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800 mb-3 shadow-md ring-2 ring-black/5 dark:ring-white/10" style={{ backgroundColor: sortedTeams[2].colorHex }} />
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-base truncate w-full tracking-wide">{sortedTeams[2].name || sortedTeams[2].colorName}</h3>
                  <p className="text-xl text-zinc-900 dark:text-white mt-1 font-black tracking-tight">{sortedTeams[2].finalScore} <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">คะแนน</span></p>
                  <div className="flex gap-4 mt-5 text-sm font-semibold bg-black/5 dark:bg-white/10 px-4 py-2 rounded-xl">
                    <span className="flex items-center gap-1.5"><Medal size={14} className="text-yellow-500 fill-yellow-500/20" /> <span className="text-zinc-700 dark:text-zinc-100">{sortedTeams[2].gold}</span></span>
                    <span className="flex items-center gap-1.5"><Medal size={14} className="text-zinc-400 fill-zinc-400/20" /> <span className="text-zinc-700 dark:text-zinc-100">{sortedTeams[2].silver}</span></span>
                    <span className="flex items-center gap-1.5"><Medal size={14} className="text-orange-500 fill-orange-500/20" /> <span className="text-zinc-700 dark:text-zinc-100">{sortedTeams[2].bronze}</span></span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Scoreboard Table */}
            <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs uppercase font-extrabold tracking-widest border-b border-black/5 dark:border-white/10">
                      <th className="py-5 px-6 text-center w-24">อันดับ</th>
                      <th className="py-5 px-6">คณะสี</th>
                      <th className="py-5 px-6 text-center w-32">
                        <div className="flex items-center justify-center gap-2"><Medal size={16} className="text-yellow-500 fill-yellow-500/20" /> <span className="text-zinc-900 dark:text-zinc-200">ทอง</span></div>
                      </th>
                      <th className="py-5 px-6 text-center w-32">
                        <div className="flex items-center justify-center gap-2"><Medal size={16} className="text-zinc-500 dark:text-zinc-300 fill-zinc-400/20" /> <span className="text-zinc-900 dark:text-zinc-200">เงิน</span></div>
                      </th>
                      <th className="py-5 px-6 text-center w-32">
                        <div className="flex items-center justify-center gap-2"><Medal size={16} className="text-orange-500 fill-orange-500/20" /> <span className="text-zinc-900 dark:text-zinc-200">ทองแดง</span></div>
                      </th>
                      <th className="py-5 px-6 text-center w-40">คะแนนรวม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {sortedTeams.map((team, index) => (
                      <motion.tr 
                        key={team.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                      >
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm shadow-sm ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white ring-2 ring-amber-200 dark:ring-amber-700' : 
                            index === 1 ? 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-800 ring-2 ring-zinc-200 dark:ring-zinc-600' : 
                            index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-orange-900 ring-2 ring-orange-200 dark:ring-orange-800' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 transition-colors'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 shadow-sm shrink-0" style={{ backgroundColor: team.colorHex }} />
                            <span className="font-extrabold text-zinc-900 dark:text-white text-base tracking-wide transition-colors">{team.name || team.colorName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-zinc-900 dark:text-white text-base">{team.gold}</td>
                        <td className="py-4 px-6 text-center font-bold text-zinc-900 dark:text-white text-base">{team.silver}</td>
                        <td className="py-4 px-6 text-center font-bold text-zinc-900 dark:text-white text-base">{team.bronze}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-black text-zinc-900 dark:text-white text-lg tracking-tight bg-black/5 dark:bg-white/10 px-4 py-1.5 rounded-xl border border-black/10 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:shadow-md transition-all">
                            {team.finalScore}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </motion.div>
      </Container>
    </div>
  );
}
