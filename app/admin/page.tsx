'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/loading-state';
import AdminLoginModal from '@/components/admin/admin-login-modal';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { getSupabase } from '@/lib/supabase/client';
import {
  fetchAthletes,
  fetchMatches,
  fetchMedals,
  fetchNews,
  fetchGallery,
  fetchSportOptions,
  fetchSports,
  fetchSubcategories,
  fetchStaff,
  fetchCheerMessages,
  fetchSiteSettings,
  deleteAthlete,
  deleteGallery,
  deleteMatch,
  deleteMedal,
  deleteNews,
  deleteSport,
  deleteSubcategory,
  deleteStaff,
  deleteCheerMessage,
  updateCheerStatus,
  upsertAthlete,
  updateAthlete,
  upsertGallery,
  updateGallery,
  upsertMatch,
  updateMatch,
  upsertMedal,
  upsertNews,
  updateNews,
  upsertSport,
  updateSport,
  upsertSubcategory,
  upsertStaff,
  updateStaff,
  updateCheerWall,
  upsertSiteSettings,
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
  Upload,
  X,
  Loader2,
  CheckCircle2,
  UserCheck,
  Pin,
  MessageSquare,
  Megaphone,
  Check,
  EyeOff,
  Sliders,
  Timer,
} from 'lucide-react';

type AdminTab =
  | 'pinning'
  | 'sports'
  | 'matches'
  | 'news'
  | 'gallery'
  | 'athletes'
  | 'medals'
  | 'staff'
  | 'cheer_wall'
  | 'site_settings';

const inputClass =
  'bg-surface border border-border/40 rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary w-full shadow-2xs';
const labelClass = 'text-[10px] font-bold uppercase text-text-secondary tracking-wider';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function OrderInput({
  value,
  onChange,
  disabled
}: {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}) {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <div className="flex items-center gap-1.5 ml-2 mr-3">
      <span className="text-[10px] text-text-secondary font-medium">ลำดับ:</span>
      <input
        type="number"
        min={0}
        disabled={disabled}
        className="w-14 px-2 py-1 text-xs font-bold text-center bg-surface border border-border/40 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50"
        value={localValue}
        onChange={e => setLocalValue(parseInt(e.target.value) || 0)}
        onBlur={handleBlur}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
      />
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  bucket,
  folder = '',
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket: string;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadStatus !== 'idle') {
      const timer = setTimeout(() => setUploadStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      setUploadStatus('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5 MB');
      setUploadStatus('error');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setErrorMsg('');

    try {
      const supabase = getSupabase();
      const ext = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const filePath = folder
        ? `${folder}/${timestamp}-${random}.${ext}`
        : `${timestamp}-${random}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onChange(urlData.publicUrl);
      setUploadStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่');
      setUploadStatus('error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          className={inputClass}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="วาง URL หรืออัปโหลดไฟล์..."
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 p-2 rounded-xl bg-surface border border-border/40 hover:border-red-200 hover:text-red-500 text-text-secondary transition-colors cursor-pointer"
            title="ลบ URL"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer shadow-2xs ${
            uploading
              ? 'bg-primary/5 border-primary/20 text-primary'
              : 'bg-surface border-border/40 text-text-secondary hover:border-primary/30 hover:text-primary'
          }`}
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'กำลังอัปโหลด...' : 'เลือกไฟล์จากเครื่อง'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {uploadStatus === 'success' && (
          <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium">
            <CheckCircle2 size={12} /> อัปโหลดสำเร็จ
          </span>
        )}
        {uploadStatus === 'error' && (
          <span className="text-[10px] text-red-500 font-medium">{errorMsg}</span>
        )}
      </div>

      {value && (
        <div className="mt-1 relative w-24 h-24 rounded-xl overflow-hidden border border-border/30 bg-surface shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="ตัวอย่างรูปภาพ"
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f7" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%236e6e73" font-size="12">Error</text></svg>';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, signIn, signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('pinning');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sportsFetcher = useCallback(() => fetchSports(), []);
  const matchesFetcher = useCallback(() => fetchMatches(), []);
  const newsFetcher = useCallback(() => fetchNews(), []);
  const galleryFetcher = useCallback(() => fetchGallery(), []);
  const medalsFetcher = useCallback(() => fetchMedals(), []);
  const athletesFetcher = useCallback(() => fetchAthletes(), []);
  const staffFetcher = useCallback(() => fetchStaff(), []);
  const cheerFetcher = useCallback(() => fetchCheerMessages(), []);
  const settingsFetcher = useCallback(() => fetchSiteSettings(), []);

  const { data: sports, refetch: refetchSports } = useSupabaseData('sports', sportsFetcher);
  const { data: matches, refetch: refetchMatches } = useSupabaseData('matches', matchesFetcher);
  const { data: news, refetch: refetchNews } = useSupabaseData('news', newsFetcher);
  const { data: gallery, refetch: refetchGallery } = useSupabaseData('gallery', galleryFetcher);
  const { data: medals, refetch: refetchMedals } = useSupabaseData('medals', medalsFetcher);
  const { data: athletes, refetch: refetchAthletes } = useSupabaseData('athletes', athletesFetcher);
  const { data: staffList, refetch: refetchStaff } = useSupabaseData('staff', staffFetcher);
  const { data: cheerList, refetch: refetchCheer } = useSupabaseData('cheer_wall', cheerFetcher);
  const { data: siteSettings, refetch: refetchSettings } = useSupabaseData('site_settings', settingsFetcher);

  const [sportOptions, setSportOptions] = useState<{ id: string; name: string }[]>([]);

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
      console.error("Admin Action Error:", err);
      showMessage('error', err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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
    match_type: 'versus' as 'versus' | 'track',
    team_a_name: '',
    team_a_color_hex: '#E6007E',
    team_a_score: '',
    team_b_name: '',
    team_b_color_hex: '#1E40AF',
    team_b_score: '',
    competitors: [
      { lane: 1, name: 'คณะ 1 สีเหลือง', colorHex: '#FBBF24', score: '', place: '' },
      { lane: 2, name: 'คณะ 2 สีชมพู', colorHex: '#E6007E', score: '', place: '' },
      { lane: 3, name: 'คณะ 3 สีเขียว', colorHex: '#10B981', score: '', place: '' },
      { lane: 4, name: 'คณะ 4 สีแสด', colorHex: '#F97316', score: '', place: '' },
      { lane: 5, name: 'คณะ 5 สีฟ้า', colorHex: '#3B82F6', score: '', place: '' },
    ],
    status: 'upcoming' as MatchStatus,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    is_pinned: false,
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
    is_featured: false,
    is_pinned: false,
  });

  // --- Gallery Form State ---
  const [galleryForm, setGalleryForm] = useState({
    id: '',
    title: '',
    sport_name: '',
    image_url: '',
    date: new Date().toISOString().split('T')[0],
    is_pinned: false,
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

  // --- Staff Form State ---
  const [staffForm, setStaffForm] = useState({
    id: '',
    name: '',
    position: '',
    department: '',
    contact_info: '',
    type: 'Head',
    display_order: 0,
    image_url: '',
  });

  // --- Site Settings Form State ---
  const [settingsForm, setSettingsForm] = useState({
    announcement_text: siteSettings?.announcement_text || '🎉 ยินดีต้อนรับสู่การแข่งขันกีฬาสี คณะ 2 สีชมพู ดุสิตสวรรค์ธัญมหาปราสาท!',
    is_announcement_active: siteSettings?.is_announcement_active ?? true,
    event_date: siteSettings?.event_date || '2026-08-15T08:30:00',
    is_countdown_active: siteSettings?.is_countdown_active ?? true,
    show_countdown_on_home: siteSettings?.show_countdown_on_home ?? true,
    show_medals_on_home: siteSettings?.show_medals_on_home ?? true,
    show_cheer_on_home: siteSettings?.show_cheer_on_home ?? false,
  });

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        announcement_text: siteSettings.announcement_text || '',
        is_announcement_active: siteSettings.is_announcement_active,
        event_date: siteSettings.event_date || '',
        is_countdown_active: siteSettings.is_countdown_active,
        show_countdown_on_home: siteSettings.show_countdown_on_home ?? true,
        show_medals_on_home: siteSettings.show_medals_on_home ?? true,
        show_cheer_on_home: siteSettings.show_cheer_on_home ?? false,
      });
    }
  }, [siteSettings]);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'pinning', label: '📌 จัดการหน้าแรก / Pinning', icon: <Pin size={14} /> },
    { id: 'sports', label: 'จัดการกีฬา', icon: <Dumbbell size={14} /> },
    { id: 'matches', label: 'แมตช์ & คะแนน', icon: <Calendar size={14} /> },
    { id: 'news', label: 'ข่าวสาร', icon: <Newspaper size={14} /> },
    { id: 'gallery', label: 'แกลเลอรี', icon: <ImageIcon size={14} /> },
    { id: 'athletes', label: 'นักกีฬา', icon: <Users size={14} /> },
    { id: 'medals', label: 'เหรียญรางวัล', icon: <Award size={14} /> },
    { id: 'staff', label: 'เจ้าหน้าที่/ทีมงาน', icon: <UserCheck size={14} /> },
    { id: 'cheer_wall', label: 'Cheer Wall (กำแพงเชียร์)', icon: <MessageSquare size={14} /> },
    { id: 'site_settings', label: 'ประกาศ & นับถอยหลัง', icon: <Megaphone size={14} /> },
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
    <Container className="py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border/30 pb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-primary/10 text-primary rounded-full mb-2 inline-block shadow-2xs">
              Global Pinning System Enabled
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              แผงควบคุมระบบหลังบ้าน
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border/30 rounded-full font-medium shadow-2xs">
              <Database size={12} className="text-primary" />
              Supabase Connected
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-border/40 hover:border-red-200 hover:text-red-500 transition-colors cursor-pointer shadow-2xs active:scale-95"
            >
              <LogOut size={12} />
              ออกจากระบบ
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-xs font-medium border shadow-xs ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tab Navigation Sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 border-b lg:border-b-0 border-border/30 pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface-card hover:bg-surface text-text-secondary border border-border/20 shadow-2xs'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 space-y-6">
            {/* PINNING MANAGEMENT TAB */}
            {activeTab === 'pinning' && (
              <div className="space-y-6">
                <Panel title="📌 ระบบปักหมุดเนื้อหาบนหน้าแรก (Global Pinning Control)">
                  <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                    หน้าแรกถูกกำหนดเป็น Clean Slate โดยจะดึงเฉพาะไอเทมและส่วนงานที่คุณเปิดใช้งานสวิตช์ปักหมุดด้านล่างนี้มาเรนเดอร์แสดงผลเรียงลำดับลงมา
                  </p>

                  <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2 border-b border-border/30 pb-2">
                    <Sliders size={16} className="text-primary" /> เปิด/ปิด Widget หน้าแรก
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Toggle Announcement Banner */}
                    <div className="p-4 bg-surface border border-border/30 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                          <Megaphone size={14} className="text-pink-500" />
                          แถบประกาศด่วน
                        </span>
                        <input
                          type="checkbox"
                          checked={settingsForm.is_announcement_active}
                          onChange={e => {
                            const val = e.target.checked;
                            setSettingsForm(f => ({ ...f, is_announcement_active: val }));
                            handleAction(async () => {
                              await upsertSiteSettings({ ...settingsForm, is_announcement_active: val });
                              refetchSettings();
                            });
                          }}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-text-secondary">แถบข้อความวิ่งด้านบนสุด (Emergency Banner)</p>
                    </div>

                    {/* Toggle Countdown Card */}
                    <div className="p-4 bg-surface border border-border/30 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                          <Timer size={14} className="text-primary" />
                          Countdown
                        </span>
                        <input
                          type="checkbox"
                          checked={settingsForm.show_countdown_on_home}
                          onChange={e => {
                            const val = e.target.checked;
                            setSettingsForm(f => ({ ...f, show_countdown_on_home: val }));
                            handleAction(async () => {
                              await upsertSiteSettings({ ...settingsForm, show_countdown_on_home: val });
                              refetchSettings();
                            });
                          }}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-text-secondary">กล่องนับถอยหลัง / ป๊อปอัปสแปลช</p>
                    </div>

                    {/* Toggle Medal Standings */}
                    <div className="p-4 bg-surface border border-border/30 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                          <Trophy size={14} className="text-accent-gold" />
                          Medals Table
                        </span>
                        <input
                          type="checkbox"
                          checked={settingsForm.show_medals_on_home}
                          onChange={e => {
                            const val = e.target.checked;
                            setSettingsForm(f => ({ ...f, show_medals_on_home: val }));
                            handleAction(async () => {
                              await upsertSiteSettings({ ...settingsForm, show_medals_on_home: val });
                              refetchSettings();
                            });
                          }}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-text-secondary">สรุปอันดับเหรียญและคะแนนรวมหน้าแรก</p>
                    </div>

                    {/* Toggle Cheer Wall */}
                    <div className="p-4 bg-surface border border-border/30 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-primary" />
                          Cheer Wall
                        </span>
                        <input
                          type="checkbox"
                          checked={settingsForm.show_cheer_on_home}
                          onChange={e => {
                            const val = e.target.checked;
                            setSettingsForm(f => ({ ...f, show_cheer_on_home: val }));
                            handleAction(async () => {
                              await upsertSiteSettings({ ...settingsForm, show_cheer_on_home: val });
                              refetchSettings();
                            });
                          }}
                          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-text-secondary">วิดเจ็ตกองเชียร์ / ข้อความกำลังใจ</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary mb-3 flex items-center gap-2 border-b border-border/30 pb-2">
                    <Pin size={16} className="text-primary" /> เลือกปักหมุดคอนเทนต์เด่น (Pinned Items)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pinned Sports */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <Dumbbell size={14} className="text-primary" />
                        1. กีฬาไฮไลต์ (Sports)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(sports ?? []).map(s => (
                          <div key={s.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <span className="font-bold text-text-primary truncate pr-2">{s.name}</span>
                            <div className="flex items-center">
                              {s.isPinned && (
                                <OrderInput
                                  value={s.pinnedOrder || 0}
                                  onChange={val => handleAction(async () => { await updateSport(s.id, { pinned_order: val }); refetchSports(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateSport(s.id, { is_pinned: !s.isPinned }); refetchSports(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  s.isPinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {s.isPinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned Matches */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        2. แมตช์คู่ชิง (Matches)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(matches ?? []).map(m => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <div className="truncate pr-2">
                              <span className="font-bold text-text-primary">{m.sportName}</span>
                              <span className="text-text-secondary ml-2 text-[10px]">({m.stage})</span>
                            </div>
                            <div className="flex items-center">
                              {m.isPinned && (
                                <OrderInput
                                  value={m.pinnedOrder || 0}
                                  onChange={val => handleAction(async () => { await updateMatch(m.id, { pinned_order: val }); refetchMatches(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateMatch(m.id, { is_pinned: !m.isPinned }); refetchMatches(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  m.isPinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {m.isPinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned News */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <Newspaper size={14} className="text-primary" />
                        3. ข่าวสารสำคัญ (News)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(news ?? []).map(n => (
                          <div key={n.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <span className="font-bold text-text-primary truncate pr-2">{n.title}</span>
                            <div className="flex items-center">
                              {n.isPinned && (
                                <OrderInput
                                  value={n.pinnedOrder || 0}
                                  onChange={val => handleAction(async () => { await updateNews(n.id, { pinned_order: val }); refetchNews(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateNews(n.id, { is_pinned: !n.isPinned }); refetchNews(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  n.isPinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {n.isPinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned Gallery */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-primary" />
                        4. รูปภาพเด็ด (Gallery)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(gallery ?? []).map(g => (
                          <div key={g.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <span className="font-bold text-text-primary truncate pr-2">{g.title}</span>
                            <div className="flex items-center">
                              {g.isPinned && (
                                <OrderInput
                                  value={g.pinnedOrder || 0}
                                  onChange={val => handleAction(async () => { await updateGallery(g.id, { pinned_order: val }); refetchGallery(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateGallery(g.id, { is_pinned: !g.isPinned }); refetchGallery(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  g.isPinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {g.isPinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned Athletes */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <Users size={14} className="text-primary" />
                        5. นักกีฬา MVP (Athletes)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(athletes ?? []).map(a => (
                          <div key={a.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <div className="truncate pr-2">
                              <span className="font-bold text-text-primary">{a.name}</span>
                              <span className="text-text-secondary ml-2 text-[10px]">{a.team}</span>
                            </div>
                            <div className="flex items-center">
                              {a.is_pinned && (
                                <OrderInput
                                  value={a.pinned_order || 0}
                                  onChange={val => handleAction(async () => { await updateAthlete(a.id, { pinned_order: val }); refetchAthletes(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateAthlete(a.id, { is_pinned: !a.is_pinned }); refetchAthletes(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  a.is_pinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {a.is_pinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned Staff */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <UserCheck size={14} className="text-primary" />
                        6. คณะกรรมการ/ทีมงาน (Staff)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(staffList ?? []).map(s => (
                          <div key={s.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <div className="truncate pr-2">
                              <span className="font-bold text-text-primary">{s.name}</span>
                              <span className="text-text-secondary ml-2 text-[10px]">{s.position}</span>
                            </div>
                            <div className="flex items-center">
                              {s.is_pinned && (
                                <OrderInput
                                  value={s.pinned_order || 0}
                                  onChange={val => handleAction(async () => { await updateStaff(s.id, { pinned_order: val }); refetchStaff(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateStaff(s.id, { is_pinned: !s.is_pinned }); refetchStaff(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  s.is_pinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {s.is_pinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned Cheer Messages */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-primary" />
                        7. ข้อความเชียร์ไฮไลต์ (Cheer Wall)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(cheerList ?? []).map(c => (
                          <div key={c.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs shadow-2xs">
                            <div className="truncate pr-2">
                              <span className="font-bold text-text-primary">"{c.message}"</span>
                              <span className="text-text-secondary ml-2 text-[10px]">- {c.author_name}</span>
                            </div>
                            <div className="flex items-center">
                              {c.is_pinned && (
                                <OrderInput
                                  value={c.pinned_order || 0}
                                  onChange={val => handleAction(async () => { await updateCheerWall(c.id, { pinned_order: val }); refetchCheer(); })}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => handleAction(async () => { await updateCheerWall(c.id, { is_pinned: !c.is_pinned }); refetchCheer(); })}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                                  c.is_pinned ? 'bg-primary text-white border-primary' : 'bg-surface border-border/40 text-text-secondary hover:border-primary'
                                }`}
                              >
                                📌 {c.is_pinned ? 'ปักหมุดอยู่' : 'ปักหมุด'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

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
                      <FormField label="ชื่อกีฬา"><input required className={inputClass} value={sportForm.name} onChange={e => setSportForm(f => ({ ...f, name: e.target.value }))} /></FormField>
                      <FormField label="Icon Name">
                        <select className={inputClass} value={sportForm.icon_name} onChange={e => setSportForm(f => ({ ...f, icon_name: e.target.value }))}>
                          {['Trophy', 'Target', 'Activity', 'Gamepad2', 'Zap'].map(i => (<option key={i} value={i}>{i}</option>))}
                        </select>
                      </FormField>
                      <FormField label="รายละเอียด"><textarea className={inputClass} rows={2} value={sportForm.description} onChange={e => setSportForm(f => ({ ...f, description: e.target.value }))} /></FormField>
                      <FormField label="กฎกติกา (บรรทัดละ 1 ข้อ)"><textarea className={inputClass} rows={2} value={sportForm.rules} onChange={e => setSportForm(f => ({ ...f, rules: e.target.value }))} /></FormField>
                    </div>
                    <SubmitButton saving={saving} label="เพิ่มกีฬา" />
                  </form>
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
                        try {
                          const selectedSport = sportOptions.find(s => s.id === matchForm.sport_id);

                          // Fix Date Formatting (Ensure YYYY-MM-DD for Supabase)
                          let isoDate = matchForm.date;
                          if (isoDate) {
                            try {
                              const d = new Date(isoDate);
                              if (!isNaN(d.getTime())) {
                                // Extract YYYY-MM-DD locally to avoid timezone shifts
                                const year = d.getFullYear();
                                // Basic sanity check: if year is > 2500, it might be Buddhist Era (BE)
                                const correctedYear = year > 2500 ? year - 543 : year;
                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                const day = String(d.getDate()).padStart(2, '0');
                                isoDate = `${correctedYear}-${month}-${day}`;
                              }
                            } catch (e) {
                              console.warn("Date parse error:", e);
                            }
                          }

                          const payload = {
                            sport_id: matchForm.sport_id || null,
                            sport_name: selectedSport?.name ?? matchForm.sport_name,
                            stage: matchForm.stage,
                            match_type: matchForm.match_type,
                            team_a_name: matchForm.team_a_name,
                            team_a_color_hex: matchForm.team_a_color_hex,
                            team_a_score: matchForm.team_a_score ? parseInt(matchForm.team_a_score) : null,
                            team_b_name: matchForm.team_b_name,
                            team_b_color_hex: matchForm.team_b_color_hex,
                            team_b_score: matchForm.team_b_score ? parseInt(matchForm.team_b_score) : null,
                            competitors: matchForm.match_type === 'track' ? matchForm.competitors.map(c => ({
                              ...c,
                              score: c.score ? parseInt(c.score as string) : undefined,
                              place: c.place ? parseInt(c.place as string) : undefined
                            })) : null,
                            status: matchForm.status,
                            date: isoDate,
                            time: matchForm.time,
                            location: matchForm.location,
                            is_pinned: matchForm.is_pinned,
                          };

                          if (matchForm.id) {
                            await updateMatch(matchForm.id, payload);
                          } else {
                            await upsertMatch(payload);
                          }
                          setMatchForm(f => ({ ...f, id: '', stage: '', team_a_score: '', team_b_score: '', is_pinned: false }));
                          refetchMatches();
                        } catch (err) {
                          console.error("Match Submit Error Details:", err);
                          throw err;
                        }
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
                      <FormField label="ประเภทการแข่งขัน">
                        <select className={inputClass} value={matchForm.match_type} onChange={e => setMatchForm(f => ({ ...f, match_type: e.target.value as 'versus' | 'track' }))}>
                          <option value="versus">ประกบคู่ (Versus)</option>
                          <option value="track">ประเภทลู่ / แข่งรวม (Track)</option>
                        </select>
                      </FormField>
                      <FormField label="รอบการแข่งขัน"><input required className={inputClass} value={matchForm.stage} onChange={e => setMatchForm(f => ({ ...f, stage: e.target.value }))} placeholder="รอบชิงชนะเลิศ" /></FormField>
                      <FormField label="สถานที่"><input required className={inputClass} value={matchForm.location} onChange={e => setMatchForm(f => ({ ...f, location: e.target.value }))} /></FormField>
                      <FormField label="วันที่"><input type="date" required className={inputClass} value={matchForm.date} onChange={e => setMatchForm(f => ({ ...f, date: e.target.value }))} /></FormField>
                      <FormField label="เวลา"><input type="time" required className={inputClass} value={matchForm.time} onChange={e => setMatchForm(f => ({ ...f, time: e.target.value }))} /></FormField>

                      {matchForm.match_type === 'versus' ? (
                        <>
                          <FormField label="ทีม A"><input required={matchForm.match_type === 'versus'} className={inputClass} value={matchForm.team_a_name} onChange={e => setMatchForm(f => ({ ...f, team_a_name: e.target.value }))} /></FormField>
                          <FormField label="สีทีม A"><input type="color" className={inputClass + ' h-10'} value={matchForm.team_a_color_hex} onChange={e => setMatchForm(f => ({ ...f, team_a_color_hex: e.target.value }))} /></FormField>
                          <FormField label="คะแนนทีม A"><input type="number" min="0" className={inputClass} value={matchForm.team_a_score} onChange={e => setMatchForm(f => ({ ...f, team_a_score: e.target.value }))} /></FormField>
                          <FormField label="ทีม B"><input required={matchForm.match_type === 'versus'} className={inputClass} value={matchForm.team_b_name} onChange={e => setMatchForm(f => ({ ...f, team_b_name: e.target.value }))} /></FormField>
                          <FormField label="สีทีม B"><input type="color" className={inputClass + ' h-10'} value={matchForm.team_b_color_hex} onChange={e => setMatchForm(f => ({ ...f, team_b_color_hex: e.target.value }))} /></FormField>
                          <FormField label="คะแนนทีม B"><input type="number" min="0" className={inputClass} value={matchForm.team_b_score} onChange={e => setMatchForm(f => ({ ...f, team_b_score: e.target.value }))} /></FormField>
                        </>
                      ) : (
                        <div className="md:col-span-2 space-y-3 mt-2 border-t border-border/30 pt-4">
                          <h4 className="text-xs font-bold text-text-primary">ข้อมูลผู้เข้าแข่งขัน (Track Events)</h4>
                          <div className="grid gap-3">
                            {matchForm.competitors.map((comp, idx) => (
                              <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-surface p-2 rounded-xl border border-border/40">
                                 <span className="text-[10px] font-bold text-center col-span-1">ลู่ {comp.lane}</span>
                                 <input className={inputClass + " col-span-2"} value={comp.name} onChange={e => {
                                   const newComps = [...matchForm.competitors];
                                   newComps[idx].name = e.target.value;
                                   setMatchForm(f => ({ ...f, competitors: newComps }));
                                 }} placeholder="ชื่อทีม/นักกีฬา" />
                                 <input type="color" className={inputClass + " h-8 p-0.5 col-span-1 w-full"} value={comp.colorHex} onChange={e => {
                                   const newComps = [...matchForm.competitors];
                                   newComps[idx].colorHex = e.target.value;
                                   setMatchForm(f => ({ ...f, competitors: newComps }));
                                 }} />
                                 <input type="number" className={inputClass + " col-span-1"} value={comp.score} onChange={e => {
                                   const newComps = [...matchForm.competitors];
                                   newComps[idx].score = e.target.value;
                                   setMatchForm(f => ({ ...f, competitors: newComps }));
                                 }} placeholder="คะแนน" />
                                 <input type="number" className={inputClass + " col-span-1"} value={comp.place} onChange={e => {
                                   const newComps = [...matchForm.competitors];
                                   newComps[idx].place = e.target.value;
                                   setMatchForm(f => ({ ...f, competitors: newComps }));
                                 }} placeholder="อันดับ" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <SubmitButton saving={saving} label={matchForm.id ? 'อัปเดตแมตช์' : 'เพิ่มแมตช์'} />
                  </form>
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
                          is_featured: newsForm.is_featured,
                          is_pinned: newsForm.is_pinned,
                        });
                        setNewsForm({ id: '', title: '', excerpt: '', content: '', date: new Date().toISOString().split('T')[0], category: 'sports', image_url: '', is_featured: false, is_pinned: false });
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
                      <ImageUploadField label="รูปภาพข่าว" value={newsForm.image_url} onChange={url => setNewsForm(f => ({ ...f, image_url: url }))} bucket="news-images" folder="news" />
                      <div className="md:col-span-2"><FormField label="บทสรุป"><textarea required className={inputClass} rows={2} value={newsForm.excerpt} onChange={e => setNewsForm(f => ({ ...f, excerpt: e.target.value }))} /></FormField></div>
                      <div className="md:col-span-2"><FormField label="เนื้อหา"><textarea required className={inputClass} rows={4} value={newsForm.content} onChange={e => setNewsForm(f => ({ ...f, content: e.target.value }))} /></FormField></div>
                    </div>
                    <SubmitButton saving={saving} label={newsForm.id ? 'อัปเดตข่าว' : 'เพิ่มข่าว'} />
                  </form>
                </Panel>
                <ItemList
                  items={(news ?? []).map(n => ({
                    id: n.id,
                    label: n.title,
                    onEdit: () => setNewsForm({ id: n.id, title: n.title, excerpt: n.excerpt, content: n.content, date: n.date, category: n.category, image_url: n.imageUrl ?? '', is_featured: n.isFeatured ?? false, is_pinned: n.isPinned ?? false }),
                    onDelete: () => handleAction(async () => { await deleteNews(n.id); refetchNews(); }),
                  }))}
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
                          is_pinned: galleryForm.is_pinned,
                        });
                        setGalleryForm({ id: '', title: '', sport_name: '', image_url: '', date: new Date().toISOString().split('T')[0], is_pinned: false });
                        refetchGallery();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="ชื่อภาพ"><input required className={inputClass} value={galleryForm.title} onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))} /></FormField>
                      <FormField label="หมวดหมู่/กีฬา"><input className={inputClass} value={galleryForm.sport_name} onChange={e => setGalleryForm(f => ({ ...f, sport_name: e.target.value }))} /></FormField>
                      <ImageUploadField label="รูปภาพแกลเลอรี" value={galleryForm.image_url} onChange={url => setGalleryForm(f => ({ ...f, image_url: url }))} bucket="gallery-images" folder="gallery" />
                      <FormField label="วันที่"><input type="date" required className={inputClass} value={galleryForm.date} onChange={e => setGalleryForm(f => ({ ...f, date: e.target.value }))} /></FormField>
                    </div>
                    <SubmitButton saving={saving} label={galleryForm.id ? 'อัปเดตภาพ' : 'เพิ่มภาพ'} />
                  </form>
                </Panel>
                <ItemList items={(gallery ?? []).map(g => ({ id: g.id, label: g.title, onEdit: () => setGalleryForm({ id: g.id, title: g.title, sport_name: g.sportName ?? '', image_url: g.imageUrl, date: g.date, is_pinned: g.isPinned ?? false }), onDelete: () => handleAction(async () => { await deleteGallery(g.id); refetchGallery(); }) }))} />
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
                      <FormField label="ชื่อ"><input required className={inputClass} value={athleteForm.name} onChange={e => setAthleteForm(f => ({ ...f, name: e.target.value }))} /></FormField>
                      <FormField label="ตำแหน่ง"><input className={inputClass} value={athleteForm.position} onChange={e => setAthleteForm(f => ({ ...f, position: e.target.value }))} /></FormField>
                      <FormField label="คณะสี"><input className={inputClass} value={athleteForm.team} onChange={e => setAthleteForm(f => ({ ...f, team: e.target.value }))} /></FormField>
                      <ImageUploadField label="รูปนักกีฬา" value={athleteForm.avatar_url} onChange={url => setAthleteForm(f => ({ ...f, avatar_url: url }))} bucket="athlete-avatars" folder="avatars" />
                    </div>
                    <SubmitButton saving={saving} label={athleteForm.id ? 'อัปเดตนักกีฬา' : 'เพิ่มนักกีฬา'} />
                  </form>
                </Panel>
                <ItemList items={(athletes ?? []).map(a => ({ id: a.id, label: a.name, onEdit: () => setAthleteForm({ id: a.id, sport_id: a.sport_id ?? '', sub_category_id: a.sub_category_id ?? '', name: a.name, position: a.position ?? '', team: a.team ?? '', number: a.number ?? '', avatar_url: a.avatar_url ?? '' }), onDelete: () => handleAction(async () => { await deleteAthlete(a.id); refetchAthletes(); }) }))} />
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
                <ItemList items={(medals ?? []).map(m => ({ id: m.id, label: `${m.name} — 🥇${m.gold} 🥈${m.silver} 🥉${m.bronze} (${m.totalPoints} pts)`, onEdit: () => setMedalForm({ id: m.id, name: m.name, color_name: m.colorName, color_hex: m.colorHex, gold: m.gold, silver: m.silver, bronze: m.bronze, total_points: m.totalPoints }), onDelete: () => handleAction(async () => { await deleteMedal(m.id); refetchMedals(); }) }))} />
              </>
            )}

            {/* STAFF TAB */}
            {activeTab === 'staff' && (
              <>
                <Panel title="จัดการเจ้าหน้าที่ / ทีมงาน">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAction(async () => {
                        await upsertStaff({
                          id: staffForm.id || `staff-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                          name: staffForm.name,
                          position: staffForm.position || null,
                          department: staffForm.department || null,
                          contact_info: staffForm.contact_info || null,
                          type: staffForm.type || null,
                          display_order: Number(staffForm.display_order) || 0,
                          image_url: staffForm.image_url || null,
                        });
                        setStaffForm({ id: '', name: '', position: '', department: '', contact_info: '', type: 'Head', display_order: 0, image_url: '' });
                        refetchStaff();
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="ชื่อ-นามสกุล"><input required className={inputClass} value={staffForm.name} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} /></FormField>
                      <FormField label="ตำแหน่ง"><input className={inputClass} value={staffForm.position} onChange={e => setStaffForm(f => ({ ...f, position: e.target.value }))} /></FormField>
                      <FormField label="ฝ่าย / สังกัด"><input className={inputClass} value={staffForm.department} onChange={e => setStaffForm(f => ({ ...f, department: e.target.value }))} /></FormField>
                      <FormField label="หมวดหมู่ / ประเภท (เช่น Head, Staff)"><input className={inputClass} value={staffForm.type} onChange={e => setStaffForm(f => ({ ...f, type: e.target.value }))} /></FormField>
                      <FormField label="ช่องทางติดต่อ"><input className={inputClass} value={staffForm.contact_info} onChange={e => setStaffForm(f => ({ ...f, contact_info: e.target.value }))} /></FormField>
                      <FormField label="ลำดับการแสดงผล"><input type="number" min="0" className={inputClass} value={staffForm.display_order} onChange={e => setStaffForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} /></FormField>
                      <ImageUploadField label="รูปโปรไฟล์" value={staffForm.image_url} onChange={url => setStaffForm(f => ({ ...f, image_url: url }))} bucket="staff-images" folder="staff" />
                    </div>
                    <SubmitButton saving={saving} label={staffForm.id ? 'อัปเดตข้อมูลเจ้าหน้าที่' : 'เพิ่มเจ้าหน้าที่'} />
                  </form>
                </Panel>
                <ItemList items={(staffList ?? []).map(s => ({ id: s.id, label: `[${s.type || 'ทั่วไป'}] ${s.name}${s.position ? ` — ${s.position}` : ''}`, onEdit: () => setStaffForm({ id: s.id, name: s.name, position: s.position ?? '', department: s.department ?? '', contact_info: s.contact_info ?? '', type: s.type ?? '', display_order: s.display_order ?? 0, image_url: s.image_url ?? '' }), onDelete: () => handleAction(async () => { await deleteStaff(s.id); refetchStaff(); }) }))} />
              </>
            )}

            {/* CHEER WALL MODERATION TAB */}
            {activeTab === 'cheer_wall' && (
              <Panel title="💬 จัดการกำแพงส่งกำลังใจ (Cheer Wall Moderation)">
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {(cheerList ?? []).length === 0 ? (
                    <p className="text-xs text-text-secondary text-center py-6">ยังไม่มีข้อความกำลังใจในระบบ</p>
                  ) : (
                    (cheerList ?? []).map(item => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-surface border border-border/30 flex items-start justify-between gap-4 text-xs shadow-2xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary">{item.author_name}</span>
                            {item.is_anonymous && (
                              <span className="px-2 py-0.5 rounded-full bg-surface-card text-text-secondary text-[9px] border">
                                นิรนาม
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'approved' ? 'bg-green-100 text-green-700' :
                              item.status === 'flagged' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-text-secondary leading-relaxed">{item.message}</p>
                          <span className="text-[9px] text-text-secondary font-mono">{new Date(item.created_at).toLocaleString('th-TH')}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleAction(async () => { await updateCheerStatus(item.id, 'approved'); refetchCheer(); })}
                              className="p-1.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer"
                              title="อนุมัติ"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {item.status !== 'flagged' && (
                            <button
                              type="button"
                              onClick={() => handleAction(async () => { await updateCheerStatus(item.id, 'flagged'); refetchCheer(); })}
                              className="p-1.5 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 cursor-pointer"
                              title="ซ่อนข้อความ"
                            >
                              <EyeOff size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAction(async () => { await deleteCheerMessage(item.id); refetchCheer(); })}
                            className="p-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer"
                            title="ลบข้อความ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            )}

            {/* SITE SETTINGS TAB */}
            {activeTab === 'site_settings' && (
              <Panel title="📢 จัดการประกาศด่วน & นับถอยหลัง (Urgent Banner & Countdown)">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleAction(async () => {
                      await upsertSiteSettings({
                        announcement_text: settingsForm.announcement_text || null,
                        is_announcement_active: settingsForm.is_announcement_active,
                        event_date: settingsForm.event_date || null,
                        is_countdown_active: settingsForm.is_countdown_active,
                        show_countdown_on_home: settingsForm.show_countdown_on_home,
                        show_medals_on_home: settingsForm.show_medals_on_home,
                        show_cheer_on_home: settingsForm.show_cheer_on_home,
                      });
                      refetchSettings();
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField label="ข้อความประกาศด่วน (Urgent Announcement Bar)">
                        <input
                          className={inputClass}
                          value={settingsForm.announcement_text}
                          onChange={e => setSettingsForm(f => ({ ...f, announcement_text: e.target.value }))}
                          placeholder="เช่น 🎉 ยินดีต้อนรับสู่งานแข่งขันกีฬาสี ดุสิตสวรรค์!"
                        />
                      </FormField>
                    </div>

                    <div className="md:col-span-2 space-y-3 mt-2">
                      <ToggleSwitch
                        checked={settingsForm.is_announcement_active}
                        onChange={c => setSettingsForm(f => ({ ...f, is_announcement_active: c }))}
                        label="เปิดใช้งานแถบประกาศด่วน (Top Announcement Bar)"
                      />
                      <ToggleSwitch
                        checked={settingsForm.is_countdown_active}
                        onChange={c => setSettingsForm(f => ({ ...f, is_countdown_active: c }))}
                        label="เปิดใช้งานนาฬิกานับถอยหลัง (Countdown Timer)"
                      />
                      <ToggleSwitch
                        checked={settingsForm.show_countdown_on_home}
                        onChange={c => setSettingsForm(f => ({ ...f, show_countdown_on_home: c }))}
                        label="ปักหมุด: แสดงนับถอยหลังบนหน้าแรก"
                      />
                      <ToggleSwitch
                        checked={settingsForm.show_medals_on_home}
                        onChange={c => setSettingsForm(f => ({ ...f, show_medals_on_home: c }))}
                        label="ปักหมุด: แสดงตารางสรุปเหรียญบนหน้าแรก"
                      />
                      <ToggleSwitch
                        checked={settingsForm.show_cheer_on_home}
                        onChange={c => setSettingsForm(f => ({ ...f, show_cheer_on_home: c }))}
                        label="ปักหมุด: แสดงกำแพงเชียร์บนหน้าแรก"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField label="วันและเวลาจัดงานกีฬาสี (สำหรับนาฬิกานับถอยหลัง)">
                        <input
                          type="datetime-local"
                          className={inputClass}
                          value={settingsForm.event_date ? settingsForm.event_date.substring(0, 16) : ''}
                          onChange={e => setSettingsForm(f => ({ ...f, event_date: e.target.value }))}
                        />
                      </FormField>
                    </div>
                  </div>
                  <SubmitButton saving={saving} label="บันทึกการตั้งค่าเว็บไซต์" />
                </form>
              </Panel>
            )}
          </div>
        </div>
      </motion.div>
    </Container>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-card border border-border/20 p-6 md:p-8 rounded-3xl shadow-sm">
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
      className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-md shadow-primary/20 active:scale-95 cursor-pointer"
    >
      {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
      {label}
    </button>
  );
}

function ItemList({ items }: { items: { id: string; label: string; onEdit: () => void; onDelete: () => void }[] }) {
  return (
    <div className="bg-surface-card border border-border/20 p-6 rounded-3xl shadow-sm">
      <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
        <Trophy size={14} className="text-primary" />
        รายการ ({items.length})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-xs text-text-secondary text-center py-4">ยังไม่มีข้อมูล</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border/20 text-xs gap-2 shadow-2xs">
              <span className="truncate">{item.label}</span>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={item.onEdit} className="text-primary font-semibold cursor-pointer">แก้ไข</button>
                <button type="button" onClick={item.onDelete} className="text-red-500 hover:text-red-700 cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer w-full p-4 bg-surface border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
      <span className="font-bold text-xs md:text-sm text-text-primary">{label}</span>
      <div className="relative inline-flex items-center">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary shadow-inner"></div>
      </div>
    </label>
  );
}
