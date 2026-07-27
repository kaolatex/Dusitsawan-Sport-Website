'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/loading-state';
import AdminLoginModal from '@/components/admin/admin-login-modal';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import {
  fetchAthletes,
  fetchMatches,
  fetchMedals,
  fetchNews,
  fetchGallery,
  fetchSportOptions,
  fetchSports,
  fetchSubcategories,
  deleteAthlete,
  deleteGallery,
  deleteMatch,
  deleteMedal,
  deleteNews,
  deleteSport,
  deleteSubcategory,
  upsertAthlete,
  upsertGallery,
  upsertMatch,
  upsertMedal,
  upsertNews,
  upsertSport,
  upsertSubcategory,
  updateMatch,
} from '@/lib/supabase/services';
import type { Tables } from '@/lib/supabase/database.types';
import type { MatchStatus } from '@/types';
import {
  Database,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  LogOut,
  Award,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Trophy,
  Users,
  Dumbbell,
} from 'lucide-react';

type AdminTab = 'sports' | 'matches' | 'news' | 'gallery' | 'athletes' | 'medals';

const inputClass =
  'bg-surface border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary w-full';
const labelClass = 'text-[10px] font-bold uppercase text-text-secondary';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, signIn, signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('matches');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sportsFetcher = useCallback(() => fetchSports(), []);
  const matchesFetcher = useCallback(() => fetchMatches(), []);
  const newsFetcher = useCallback(() => fetchNews(), []);
  const galleryFetcher = useCallback(() => fetchGallery(), []);
  const medalsFetcher = useCallback(() => fetchMedals(), []);
  const athletesFetcher = useCallback(() => fetchAthletes(), []);

  const { data: sports, refetch: refetchSports } = useSupabaseData('sports', sportsFetcher);
  const { data: matches, refetch: refetchMatches } = useSupabaseData('matches', matchesFetcher);
  const { data: news, refetch: refetchNews } = useSupabaseData('news', newsFetcher);
  const { data: gallery, refetch: refetchGallery } = useSupabaseData('gallery', galleryFetcher);
  const { data: medals, refetch: refetchMedals } = useSupabaseData('medals', medalsFetcher);
  const { data: athletes, refetch: refetchAthletes } = useSupabaseData('athletes', athletesFetcher);

  const [sportOptions, setSportOptions] = useState<{ id: string; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<Tables<'sport_subcategories'>[]>([]);

  useEffect(() => {
    fetchSportOptions().then(setSportOptions).catch(() => {});
  }, [sports]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAction = async (action: () => Promise<void>) => {
    setSaving(true);
    try {
      await action();
      showMessage('success', 'บันทึกข้อมูลสำเร็จ');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  // --- Sport Form State ---
  const [sportForm, setSportForm] = useState({
    id: '',
    name: '',
    description: '',
    icon_name: 'Trophy',
    rules: '',
  });

  const [subForm, setSubForm] = useState({
    id: '',
    sport_id: '',
    name: '',
    description: '',
    rules: '',
  });

  // --- Match Form State ---
  const [matchForm, setMatchForm] = useState({
    id: '',
    sport_id: '',
    sport_name: '',
    stage: '',
    team_a_name: '',
    team_a_color_hex: '#E6007E',
    team_a_score: '',
    team_b_name: '',
    team_b_color_hex: '#1E40AF',
    team_b_score: '',
    status: 'upcoming' as MatchStatus,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
  });

  // --- News Form State ---
  const [newsForm, setNewsForm] = useState({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: 'sports' as 'sports' | 'announcement' | 'activity',
    image_url: '',
  });

  // --- Gallery Form State ---
  const [galleryForm, setGalleryForm] = useState({
    id: '',
    title: '',
    sport_name: '',
    image_url: '',
    date: new Date().toISOString().split('T')[0],
  });

  // --- Athlete Form State ---
  const [athleteForm, setAthleteForm] = useState({
    id: '',
    sport_id: '',
    sub_category_id: '',
    name: '',
    position: '',
    team: '',
    number: '',
    avatar_url: '',
  });

  // --- Medal Form State ---
  const [medalForm, setMedalForm] = useState({
    id: '',
    name: '',
    color_name: '',
    color_hex: '#E6007E',
    gold: 0,
    silver: 0,
    bronze: 0,
    total_points: 0,
  });

  useEffect(() => {
    if (athleteForm.sport_id) {
      fetchSubcategories(athleteForm.sport_id).then(setSubcategories).catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
  }, [athleteForm.sport_id]);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'sports', label: 'จัดการกีฬา', icon: <Dumbbell size={14} /> },
    { id: 'matches', label: 'แมตช์ & คะแนน', icon: <Calendar size={14} /> },
    { id: 'news', label: 'ข่าวสาร', icon: <Newspaper size={14} /> },
    { id: 'gallery', label: 'แกลเลอรี', icon: <ImageIcon size={14} /> },
    { id: 'athletes', label: 'นักกีฬา', icon: <Users size={14} /> },
    { id: 'medals', label: 'เหรียญรางวัล', icon: <Award size={14} /> },
  ];

  if (authLoading) {
    return (
      <Container className="py-16 md:py-24">
        <LoadingState message="กำลังตรวจสอบสิทธิ์..." />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginModal onSignIn={signIn} />;
  }

  return (
    <Container className="py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border/40 pb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-primary/10 text-primary rounded-full mb-2 inline-block">
              Production System
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              แผงควบคุมระบบจัดการข้อมูล
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border/40 rounded-full font-medium">
              <Database size={12} className="text-primary" />
              Supabase Live
            </span>
            <span className="text-[10px] text-text-secondary hidden sm:inline">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold border border-border/40 hover:border-red-200 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              ออกจากระบบ
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-xs font-medium border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 border-b lg:border-b-0 border-border/40 pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary/5 text-primary border border-primary/10'
                    : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 space-y-6">
            {/* SPORTS TAB */}
            {activeTab === 'sports' && (
              <>
                <Panel title="+ เพิ่มชนิดกีฬาใหม่">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        const id = sportForm.id || `sport-${Date.now()}`;
                        await upsertSport({
                          id,
                          name: sportForm.name,
                          description: sportForm.description || null,
                          icon_name: sportForm.icon_name,
                          rules: sportForm.rules.split('\n').filter(Boolean),
                        });
                        setSportForm({ id: '', name: '', description: '', icon_name: 'Trophy', rules: '' });
                        refetchSports();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="ชื่อกีฬา">
                        <input required className={inputClass} value={sportForm.name} onChange={e => setSportForm(f => ({ ...f, name: e.target.value }))} />
                      </FormField>
                      <FormField label="Icon Name">
                        <select className={inputClass} value={sportForm.icon_name} onChange={e => setSportForm(f => ({ ...f, icon_name: e.target.value }))}>
                          {['Trophy', 'Target', 'Activity', 'Gamepad2', 'Zap'].map(i => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="รายละเอียด">
                        <textarea className={inputClass} rows={2} value={sportForm.description} onChange={e => setSportForm(f => ({ ...f, description: e.target.value }))} />
                      </FormField>
                      <FormField label="กฎกติกา (บรรทัดละ 1 ข้อ)">
                        <textarea className={inputClass} rows={2} value={sportForm.rules} onChange={e => setSportForm(f => ({ ...f, rules: e.target.value }))} />
                      </FormField>
                    </div>
                    <SubmitButton saving={saving} label="เพิ่มกีฬา" />
                  </form>
                </Panel>

                <Panel title="ประเภทย่อย">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        const id = subForm.id || `sub-${Date.now()}`;
                        await upsertSubcategory({
                          id,
                          sport_id: subForm.sport_id,
                          name: subForm.name,
                          description: subForm.description || null,
                          rules: subForm.rules.split('\n').filter(Boolean),
                        });
                        setSubForm({ id: '', sport_id: '', name: '', description: '', rules: '' });
                        refetchSports();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="กีฬาหลัก">
                        <select required className={inputClass} value={subForm.sport_id} onChange={e => setSubForm(f => ({ ...f, sport_id: e.target.value }))}>
                          <option value="">-- เลือก --</option>
                          {(sports ?? []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </FormField>
                      <FormField label="ชื่อประเภทย่อย">
                        <input required className={inputClass} value={subForm.name} onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))} />
                      </FormField>
                      <FormField label="รายละเอียด">
                        <input className={inputClass} value={subForm.description} onChange={e => setSubForm(f => ({ ...f, description: e.target.value }))} />
                      </FormField>
                      <FormField label="กฎกติกา">
                        <textarea className={inputClass} rows={2} value={subForm.rules} onChange={e => setSubForm(f => ({ ...f, rules: e.target.value }))} />
                      </FormField>
                    </div>
                    <SubmitButton saving={saving} label="เพิ่มประเภทย่อย" />
                  </form>

                  <div className="mt-6 space-y-2">
                    {(sports ?? []).flatMap(s =>
                      (s.subCategories ?? []).map(sc => (
                        <div key={sc.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/30 text-xs">
                          <span><strong>{s.name}</strong> → {sc.name}</span>
                          <button
                            type="button"
                            onClick={() => handleAction(async () => { await deleteSubcategory(sc.id); refetchSports(); })}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </Panel>

                <Panel title="รายการกีฬาทั้งหมด">
                  <div className="space-y-2">
                    {(sports ?? []).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/30 text-xs">
                        <span className="font-semibold">{s.name}</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setSportForm({ id: s.id, name: s.name, description: s.description ?? '', icon_name: s.iconName ?? 'Trophy', rules: (s.rules ?? []).join('\n') })} className="text-primary cursor-pointer">แก้ไข</button>
                          <button type="button" onClick={() => handleAction(async () => { await deleteSport(s.id); refetchSports(); })} className="text-red-500 cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {/* MATCHES TAB */}
            {activeTab === 'matches' && (
              <>
                <Panel title="จัดการแมตช์ & คะแนนสด">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        const selectedSport = sportOptions.find(s => s.id === matchForm.sport_id);
                        const payload = {
                          sport_id: matchForm.sport_id || null,
                          sport_name: selectedSport?.name ?? matchForm.sport_name,
                          stage: matchForm.stage,
                          team_a_name: matchForm.team_a_name,
                          team_a_color_hex: matchForm.team_a_color_hex,
                          team_a_score: matchForm.team_a_score ? parseInt(matchForm.team_a_score) : null,
                          team_b_name: matchForm.team_b_name,
                          team_b_color_hex: matchForm.team_b_color_hex,
                          team_b_score: matchForm.team_b_score ? parseInt(matchForm.team_b_score) : null,
                          status: matchForm.status,
                          date: matchForm.date,
                          time: matchForm.time,
                          location: matchForm.location,
                        };
                        if (matchForm.id) {
                          await updateMatch(matchForm.id, payload);
                        } else {
                          await upsertMatch(payload);
                        }
                        setMatchForm(f => ({ ...f, id: '', stage: '', team_a_score: '', team_b_score: '' }));
                        refetchMatches();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="ประเภทกีฬา">
                        <select required className={inputClass} value={matchForm.sport_id} onChange={e => setMatchForm(f => ({ ...f, sport_id: e.target.value }))}>
                          <option value="">-- เลือก --</option>
                          {sportOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </FormField>
                      <FormField label="สถานะแมตช์">
                        <select className={inputClass} value={matchForm.status} onChange={e => setMatchForm(f => ({ ...f, status: e.target.value as MatchStatus }))}>
                          <option value="live">กำลังแข่ง (live)</option>
                          <option value="upcoming">เร็วๆ นี้ (upcoming)</option>
                          <option value="completed">แข่งเสร็จแล้ว (completed)</option>
                        </select>
                      </FormField>
                      <FormField label="รอบการแข่งขัน">
                        <input required className={inputClass} value={matchForm.stage} onChange={e => setMatchForm(f => ({ ...f, stage: e.target.value }))} placeholder="รอบชิงชนะเลิศ" />
                      </FormField>
                      <FormField label="สถานที่">
                        <input required className={inputClass} value={matchForm.location} onChange={e => setMatchForm(f => ({ ...f, location: e.target.value }))} />
                      </FormField>
                      <FormField label="วันที่">
                        <input type="date" required className={inputClass} value={matchForm.date} onChange={e => setMatchForm(f => ({ ...f, date: e.target.value }))} />
                      </FormField>
                      <FormField label="เวลา">
                        <input type="time" required className={inputClass} value={matchForm.time} onChange={e => setMatchForm(f => ({ ...f, time: e.target.value }))} />
                      </FormField>
                      <FormField label="ทีม A">
                        <input required className={inputClass} value={matchForm.team_a_name} onChange={e => setMatchForm(f => ({ ...f, team_a_name: e.target.value }))} />
                      </FormField>
                      <FormField label="สีทีม A">
                        <input type="color" className={inputClass + ' h-10'} value={matchForm.team_a_color_hex} onChange={e => setMatchForm(f => ({ ...f, team_a_color_hex: e.target.value }))} />
                      </FormField>
                      <FormField label="คะแนนทีม A">
                        <input type="number" min="0" className={inputClass} value={matchForm.team_a_score} onChange={e => setMatchForm(f => ({ ...f, team_a_score: e.target.value }))} />
                      </FormField>
                      <FormField label="ทีม B">
                        <input required className={inputClass} value={matchForm.team_b_name} onChange={e => setMatchForm(f => ({ ...f, team_b_name: e.target.value }))} />
                      </FormField>
                      <FormField label="สีทีม B">
                        <input type="color" className={inputClass + ' h-10'} value={matchForm.team_b_color_hex} onChange={e => setMatchForm(f => ({ ...f, team_b_color_hex: e.target.value }))} />
                      </FormField>
                      <FormField label="คะแนนทีม B">
                        <input type="number" min="0" className={inputClass} value={matchForm.team_b_score} onChange={e => setMatchForm(f => ({ ...f, team_b_score: e.target.value }))} />
                      </FormField>
                    </div>
                    <SubmitButton saving={saving} label={matchForm.id ? 'อัปเดตแมตช์' : 'เพิ่มแมตช์'} />
                  </form>
                </Panel>

                <Panel title="รายการแมตช์">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {(matches ?? []).map(m => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/30 text-xs gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold">{m.sportName}</span> — {m.stage}
                          <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            m.status === 'live' ? 'bg-red-100 text-red-600' :
                            m.status === 'upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>{m.status}</span>
                          {m.status === 'completed' && (
                            <span className="ml-1 text-primary font-mono">{m.teamA.score}-{m.teamB.score}</span>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button type="button" onClick={() => setMatchForm({
                            id: m.id, sport_id: m.sportId, sport_name: m.sportName, stage: m.stage,
                            team_a_name: m.teamA.name, team_a_color_hex: m.teamA.colorHex,
                            team_a_score: m.teamA.score?.toString() ?? '', team_b_name: m.teamB.name,
                            team_b_color_hex: m.teamB.colorHex, team_b_score: m.teamB.score?.toString() ?? '',
                            status: m.status, date: m.date, time: m.time, location: m.location,
                          })} className="text-primary cursor-pointer">แก้ไข</button>
                          <button type="button" onClick={() => handleAction(async () => { await deleteMatch(m.id); refetchMatches(); })} className="text-red-500 cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {/* NEWS TAB */}
            {activeTab === 'news' && (
              <>
                <Panel title="จัดการข่าวสาร">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        await upsertNews({
                          ...(newsForm.id ? { id: newsForm.id } : {}),
                          title: newsForm.title,
                          excerpt: newsForm.excerpt,
                          content: newsForm.content,
                          date: newsForm.date,
                          category: newsForm.category,
                          image_url: newsForm.image_url || null,
                        });
                        setNewsForm({ id: '', title: '', excerpt: '', content: '', date: new Date().toISOString().split('T')[0], category: 'sports', image_url: '' });
                        refetchNews();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="หัวข้อ"><input required className={inputClass} value={newsForm.title} onChange={e => setNewsForm(f => ({ ...f, title: e.target.value }))} /></FormField>
                      <FormField label="หมวดหมู่">
                        <select className={inputClass} value={newsForm.category} onChange={e => setNewsForm(f => ({ ...f, category: e.target.value as typeof newsForm.category }))}>
                          <option value="sports">ข่าวกีฬา</option>
                          <option value="announcement">ประกาศ</option>
                          <option value="activity">กิจกรรม</option>
                        </select>
                      </FormField>
                      <FormField label="วันที่"><input type="date" required className={inputClass} value={newsForm.date} onChange={e => setNewsForm(f => ({ ...f, date: e.target.value }))} /></FormField>
                      <FormField label="URL รูปภาพ"><input className={inputClass} value={newsForm.image_url} onChange={e => setNewsForm(f => ({ ...f, image_url: e.target.value }))} /></FormField>
                      <div className="md:col-span-2"><FormField label="บทสรุป"><textarea required className={inputClass} rows={2} value={newsForm.excerpt} onChange={e => setNewsForm(f => ({ ...f, excerpt: e.target.value }))} /></FormField></div>
                      <div className="md:col-span-2"><FormField label="เนื้อหา"><textarea required className={inputClass} rows={4} value={newsForm.content} onChange={e => setNewsForm(f => ({ ...f, content: e.target.value }))} /></FormField></div>
                    </div>
                    <SubmitButton saving={saving} label={newsForm.id ? 'อัปเดตข่าว' : 'เพิ่มข่าว'} />
                  </form>
                </Panel>
                <ItemList
                  items={(news ?? []).map(n => ({ id: n.id, label: n.title, onEdit: () => setNewsForm({ id: n.id, title: n.title, excerpt: n.excerpt, content: n.content, date: n.date, category: n.category, image_url: n.imageUrl ?? '' }), onDelete: () => handleAction(async () => { await deleteNews(n.id); refetchNews(); }) }))}
                />
              </>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <>
                <Panel title="จัดการแกลเลอรี">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        await upsertGallery({
                          ...(galleryForm.id ? { id: galleryForm.id } : {}),
                          title: galleryForm.title,
                          sport_name: galleryForm.sport_name || null,
                          image_url: galleryForm.image_url,
                          date: galleryForm.date,
                        });
                        setGalleryForm({ id: '', title: '', sport_name: '', image_url: '', date: new Date().toISOString().split('T')[0] });
                        refetchGallery();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="ชื่อภาพ"><input required className={inputClass} value={galleryForm.title} onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))} /></FormField>
                      <FormField label="หมวดหมู่/กีฬา"><input className={inputClass} value={galleryForm.sport_name} onChange={e => setGalleryForm(f => ({ ...f, sport_name: e.target.value }))} /></FormField>
                      <FormField label="URL รูปภาพ"><input required className={inputClass} value={galleryForm.image_url} onChange={e => setGalleryForm(f => ({ ...f, image_url: e.target.value }))} /></FormField>
                      <FormField label="วันที่"><input type="date" required className={inputClass} value={galleryForm.date} onChange={e => setGalleryForm(f => ({ ...f, date: e.target.value }))} /></FormField>
                    </div>
                    <SubmitButton saving={saving} label={galleryForm.id ? 'อัปเดตภาพ' : 'เพิ่มภาพ'} />
                  </form>
                </Panel>
                <ItemList
                  items={(gallery ?? []).map(g => ({ id: g.id, label: g.title, onEdit: () => setGalleryForm({ id: g.id, title: g.title, sport_name: g.sportName ?? '', image_url: g.imageUrl, date: g.date }), onDelete: () => handleAction(async () => { await deleteGallery(g.id); refetchGallery(); }) }))}
                />
              </>
            )}

            {/* ATHLETES TAB */}
            {activeTab === 'athletes' && (
              <>
                <Panel title="จัดการนักกีฬา">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        await upsertAthlete({
                          ...(athleteForm.id ? { id: athleteForm.id } : {}),
                          sport_id: athleteForm.sport_id || null,
                          sub_category_id: athleteForm.sub_category_id || null,
                          name: athleteForm.name,
                          position: athleteForm.position || null,
                          team: athleteForm.team || null,
                          number: athleteForm.number || null,
                          avatar_url: athleteForm.avatar_url || null,
                        });
                        setAthleteForm({ id: '', sport_id: '', sub_category_id: '', name: '', position: '', team: '', number: '', avatar_url: '' });
                        refetchAthletes();
                        refetchSports();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="กีฬา">
                        <select className={inputClass} value={athleteForm.sport_id} onChange={e => setAthleteForm(f => ({ ...f, sport_id: e.target.value, sub_category_id: '' }))}>
                          <option value="">-- เลือก --</option>
                          {sportOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </FormField>
                      <FormField label="ประเภทย่อย">
                        <select className={inputClass} value={athleteForm.sub_category_id} onChange={e => setAthleteForm(f => ({ ...f, sub_category_id: e.target.value }))}>
                          <option value="">-- ไม่ระบุ --</option>
                          {subcategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                        </select>
                      </FormField>
                      <FormField label="ชื่อ"><input required className={inputClass} value={athleteForm.name} onChange={e => setAthleteForm(f => ({ ...f, name: e.target.value }))} /></FormField>
                      <FormField label="ตำแหน่ง"><input className={inputClass} value={athleteForm.position} onChange={e => setAthleteForm(f => ({ ...f, position: e.target.value }))} /></FormField>
                      <FormField label="คณะสี"><input className={inputClass} value={athleteForm.team} onChange={e => setAthleteForm(f => ({ ...f, team: e.target.value }))} /></FormField>
                      <FormField label="เบอร์"><input className={inputClass} value={athleteForm.number} onChange={e => setAthleteForm(f => ({ ...f, number: e.target.value }))} /></FormField>
                      <FormField label="URL รูป"><input className={inputClass} value={athleteForm.avatar_url} onChange={e => setAthleteForm(f => ({ ...f, avatar_url: e.target.value }))} /></FormField>
                    </div>
                    <SubmitButton saving={saving} label={athleteForm.id ? 'อัปเดตนักกีฬา' : 'เพิ่มนักกีฬา'} />
                  </form>
                </Panel>
                <ItemList
                  items={(athletes ?? []).map(a => ({
                    id: a.id,
                    label: a.name,
                    onEdit: () => setAthleteForm({ id: a.id, sport_id: a.sport_id ?? '', sub_category_id: a.sub_category_id ?? '', name: a.name, position: a.position ?? '', team: a.team ?? '', number: a.number ?? '', avatar_url: a.avatar_url ?? '' }),
                    onDelete: () => handleAction(async () => { await deleteAthlete(a.id); refetchAthletes(); refetchSports(); }),
                  }))}
                />
              </>
            )}

            {/* MEDALS TAB */}
            {activeTab === 'medals' && (
              <>
                <Panel title="จัดการเหรียญรางวัล">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        const id = medalForm.id || `team-${Date.now()}`;
                        await upsertMedal({
                          id,
                          name: medalForm.name,
                          color_name: medalForm.color_name,
                          color_hex: medalForm.color_hex,
                          gold: medalForm.gold,
                          silver: medalForm.silver,
                          bronze: medalForm.bronze,
                          total_points: medalForm.total_points,
                        });
                        setMedalForm({ id: '', name: '', color_name: '', color_hex: '#E6007E', gold: 0, silver: 0, bronze: 0, total_points: 0 });
                        refetchMedals();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="ชื่อคณะ"><input required className={inputClass} value={medalForm.name} onChange={e => setMedalForm(f => ({ ...f, name: e.target.value }))} /></FormField>
                      <FormField label="ชื่อสี"><input required className={inputClass} value={medalForm.color_name} onChange={e => setMedalForm(f => ({ ...f, color_name: e.target.value }))} /></FormField>
                      <FormField label="สี Hex"><input type="color" className={inputClass + ' h-10'} value={medalForm.color_hex} onChange={e => setMedalForm(f => ({ ...f, color_hex: e.target.value }))} /></FormField>
                      <FormField label="🥇 ทอง"><input type="number" min="0" className={inputClass} value={medalForm.gold} onChange={e => setMedalForm(f => ({ ...f, gold: parseInt(e.target.value) || 0 }))} /></FormField>
                      <FormField label="🥈 เงิน"><input type="number" min="0" className={inputClass} value={medalForm.silver} onChange={e => setMedalForm(f => ({ ...f, silver: parseInt(e.target.value) || 0 }))} /></FormField>
                      <FormField label="🥉 ทองแดง"><input type="number" min="0" className={inputClass} value={medalForm.bronze} onChange={e => setMedalForm(f => ({ ...f, bronze: parseInt(e.target.value) || 0 }))} /></FormField>
                      <FormField label="คะแนนรวม"><input type="number" min="0" className={inputClass} value={medalForm.total_points} onChange={e => setMedalForm(f => ({ ...f, total_points: parseInt(e.target.value) || 0 }))} /></FormField>
                    </div>
                    <SubmitButton saving={saving} label={medalForm.id ? 'อัปเดตเหรียญ' : 'เพิ่มคณะสี'} />
                  </form>
                </Panel>
                <ItemList
                  items={(medals ?? []).map(m => ({
                    id: m.id,
                    label: `${m.name} — 🥇${m.gold} 🥈${m.silver} 🥉${m.bronze} (${m.totalPoints} pts)`,
                    onEdit: () => setMedalForm({ id: m.id, name: m.name, color_name: m.colorName, color_hex: m.colorHex, gold: m.gold, silver: m.silver, bronze: m.bronze, total_points: m.totalPoints }),
                    onDelete: () => handleAction(async () => { await deleteMedal(m.id); refetchMedals(); }),
                  }))}
                />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Container>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-card border border-border/40 p-6 md:p-8 rounded-3xl shadow-xs">
      <h3 className="text-base font-bold text-text-primary mb-6 flex items-center gap-2">
        <Plus size={14} className="text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function SubmitButton({ saving, label }: { saving: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
    >
      {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
      {label}
    </button>
  );
}

function ItemList({ items }: { items: { id: string; label: string; onEdit: () => void; onDelete: () => void }[] }) {
  return (
    <div className="bg-surface-card border border-border/40 p-6 rounded-3xl shadow-xs">
      <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
        <Trophy size={14} className="text-primary" />
        รายการ ({items.length})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-xs text-text-secondary text-center py-4">ยังไม่มีข้อมูล</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/30 text-xs gap-2">
              <span className="truncate">{item.label}</span>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={item.onEdit} className="text-primary cursor-pointer">แก้ไข</button>
                <button type="button" onClick={item.onDelete} className="text-red-500 cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
