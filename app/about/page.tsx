'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { fetchStaff } from '@/lib/supabase/services';
import type { Tables } from '@/lib/supabase/database.types';
import { ShieldCheck, Compass, Heart, Users, User, Crown, Phone, Sparkles, MapPin, Globe, Camera, Share2, ExternalLink } from 'lucide-react';

/* ==========================================================================
   DEVELOPER_NOTE: CONTACT DETAILS CONFIGURATION
   แก้ไขข้อมูลช่องทางติดต่อโรงเรียน คณะสี และสภานักเรียนได้ที่นี่เลยครับ
   ========================================================================== */
const CONTACT_INFO = {
  schoolName: 'โรงเรียนพระนารายณ์',
  address: '83 หมู่ 8 ตำบล ท่าศาลา อำเภอ เมือง จังหวัด ลพบุรี 15000',
  addressUrl: 'https://maps.app.goo.gl/mDjT6mKnWYuoM3bQA?g_st=ic',
  facultyIg: '@dusitsawan',
  facultyIgUrl: 'https://www.instagram.com/dusitsawan?igsh=MXM1ajhkaXY0dDg4eQ==',
  studentCouncilIg: '@pnr.sco',
  studentCouncilIgUrl: 'https://www.instagram.com/pnr.sco?igsh=MXY0ZGRiMnc5c2p2aw==',
  facebookPage: 'โรงเรียนพระนารายณ์',
  facebookUrl: 'https://www.facebook.com/InnovationPNR?',
  telephone: '036-4131111',
};

function getInitial(name: string): string {
  const cleanName = name.replace(/^(นาย|น\.ส\.|นาง|ด\.ช\.|ด\.ญ\.)\s*/g, '');
  return cleanName.charAt(0) || '?';
}

function StaffCard({ member }: { member: Tables<'staff'> }) {
  const [imgError, setImgError] = useState(false);
  const hasAvatar = !!member.image_url && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-surface-card rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden border border-border/20 active:scale-98"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/3 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform" />

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent-gold/15 flex items-center justify-center shadow-2xs">
        {hasAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image_url!}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-primary font-extrabold text-sm select-none">
            {getInitial(member.name)}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h5 className="font-bold text-text-primary text-xs truncate group-hover:text-primary transition-colors">
            {member.name}
          </h5>
          {member.position && (
            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              <Crown size={8} />
              {member.position}
            </span>
          )}
        </div>

        {member.department && (
          <p className="text-[10px] text-text-secondary font-medium">
            {member.department}
          </p>
        )}

        {member.contact_info && (
          <p className="text-[9px] text-accent-gold flex items-center gap-1 font-mono pt-0.5">
            <Phone size={9} className="shrink-0" />
            {member.contact_info}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const staffFetcher = useCallback(() => fetchStaff(), []);
  const { data: dbStaff } = useSupabaseData('staff', staffFetcher);

  const staffList = dbStaff ?? [];

  const [activeTab, setActiveTab] = useState<'about' | 'staff' | 'contact'>('about');

  // Dynamically group staff members by type
  const groupedStaff = useMemo(() => {
    const groups: Record<string, Tables<'staff'>[]> = {};

    staffList.forEach(member => {
      const categoryType = (member.type && member.type.trim()) ? member.type.trim() : 'คณะทำงาน';
      if (!groups[categoryType]) {
        groups[categoryType] = [];
      }
      groups[categoryType].push(member);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    });

    return groups;
  }, [staffList]);

  const values = [
    {
      icon: <Compass className="text-primary w-5 h-5" />,
      title: 'ศิลปวัฒนธรรมร่วมสมัย',
      desc: 'ผสานอัตลักษณ์ไทยดั้งเดิมเข้ากับสุนทรียศาสตร์ยุคใหม่ในแบบ Contemporary'
    },
    {
      icon: <ShieldCheck className="text-primary w-5 h-5" />,
      title: 'วินัยและน้ำใจกีฬา',
      desc: 'มุ่งมั่นแข่งขันด้วยความซื่อสัตย์สุจริต และเคารพกฎกติกาอย่างเคร่งครัด'
    },
    {
      icon: <Heart className="text-primary w-5 h-5" />,
      title: 'จิตวิญญาณแห่งดุสิต',
      desc: 'สร้างสรรค์วิมานสีชมพูด้วยรอยยิ้ม ความรัก และความสามัคคีของทุกคนในคณะ'
    },
    {
      icon: <Users className="text-primary w-5 h-5" />,
      title: 'การมีส่วนร่วมของทุกคน',
      desc: 'ทุกคนมีบทบาทสำคัญในการผลักดันคณะ ไม่ว่าจะเป็นทัพนักกีฬา กองเชียร์ หรือทีมซัพพอร์ต'
    }
  ];

  return (
    <Container className="py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Title */}
        <SectionTitle
          subtitle="เกี่ยวกับพวกเรา"
          title={
            <>
              คณะ 2 สีชมพู <br className="sm:hidden" />
              <span className="text-primary font-bold">ดุสิตสวรรค์ธัญมหาปราสาท</span>
            </>
          }
        />

        {/* Tab Switcher (Pill Style - Matching News Page) */}
        <div className="flex gap-2 mb-6 md:mb-10 overflow-x-auto scrollbar-hide pb-2 md:justify-center px-1 snap-x">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all border cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 snap-center ${
              activeTab === 'about'
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
            }`}
          >
            <ShieldCheck size={14} className={activeTab === 'about' ? 'text-white' : 'text-primary'} />
            สัญลักษณ์ & อัตลักษณ์
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all border cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 snap-center ${
              activeTab === 'staff'
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users size={14} className={activeTab === 'staff' ? 'text-white' : 'text-primary'} />
            คณะผู้จัดทำ & ทีมงาน
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all border cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 snap-center ${
              activeTab === 'contact'
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Phone size={14} className={activeTab === 'contact' ? 'text-white' : 'text-primary'} />
            ติดต่อเรา
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[40vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* About Concept */}
                <div className="bg-surface-card rounded-3xl p-6 md:p-8 shadow-sm space-y-4 border border-border/20 max-w-4xl mx-auto">
                  <h3 className="text-xl md:text-2xl font-extrabold text-gradient-primary">
                    สัญลักษณ์แห่งชัยชนะและความสง่างาม
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                    ชื่อคณะสี <span className="text-primary font-semibold">"ดุสิตสวรรค์ธัญมหาปราสาท"</span> ได้รับแรงบันดาลใจจากแดนดุสิตซึ่งเป็นสวรรค์ชั้นที่สี่ ผสานกับคำว่า "ธัญ" (ความอุดมสมบูรณ์) และ "มหาปราสาท" (ความยิ่งใหญ่)
                  </p>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                    เราเชื่อในการนำเสนอแนวคิดแบบไทยร่วมสมัย (Contemporary Thai) ดึงเอาจิตวิญญาณและความอ่อนช้อยของศิลปะไทย มาผสานกับสุนทรียศาสตร์ดิจิทัลยุคใหม่
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider">
                      EST. 2026
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-bold tracking-wider">
                      CONTEMPORARY THAI
                    </span>
                  </div>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto pt-4">
                  {values.map((item, index) => (
                    <div
                      key={index}
                      className="bg-surface-card rounded-3xl p-6 shadow-sm border border-border/20 hover:shadow-md transition-all active:scale-98"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 text-primary shadow-inner">
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-text-primary text-sm mb-2">{item.title}</h4>
                      <p className="text-text-secondary text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 max-w-5xl mx-auto"
              >
                <div className="text-center space-y-1.5 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary shadow-2xs">
                    <Sparkles size={14} />
                    คณะผู้จัดทำ & เจ้าหน้าที่
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold text-text-primary">
                    ทีมงานผู้อยู่เบื้องหลังความสำเร็จ
                  </h3>
                </div>

                {Object.keys(groupedStaff).length > 0 ? (
                  <div className="space-y-8">
                    {Object.keys(groupedStaff).map((categoryType) => (
                      <div key={categoryType} className="space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-border/30 pb-3">
                          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <User size={16} />
                          </div>
                          <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider">
                            {categoryType}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-secondary font-mono border border-border/20">
                            {groupedStaff[categoryType].length} คน
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupedStaff[categoryType].map((member) => (
                            <StaffCard key={member.id} member={member} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-surface-card rounded-3xl shadow-sm border border-border/20">
                    <p className="text-sm text-text-secondary">กำลังอัปเดตข้อมูลเจ้าหน้าที่ประจำคณะ</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-surface-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full translate-x-12 -translate-y-12" />

                  <div className="space-y-1 border-b border-border/30 pb-4 mb-5 relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                      Contact & Socials
                    </span>
                    <h3 className="text-lg md:text-xl font-extrabold text-text-primary flex items-center gap-2">
                      <MapPin size={20} className="text-primary" />
                      ช่องทางติดต่อเรา
                    </h3>
                  </div>

                  {/* Contact Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {/* School Address */}
                    <a
                      href={CONTACT_INFO.addressUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-surface/80 border border-border/30 hover:border-primary/40 transition-all shadow-2xs group cursor-pointer active:scale-98"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-text-secondary uppercase mb-0.5">ที่อยู่โรงเรียน</span>
                          <span className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed">{CONTACT_INFO.address}</span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-text-secondary group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </a>

                    {/* Faculty IG */}
                    <a
                      href={CONTACT_INFO.facultyIgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface/80 border border-border/30 hover:border-primary/40 transition-all shadow-2xs group cursor-pointer active:scale-98"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                          <Camera size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-text-secondary uppercase mb-0.5">IG คณะ 2 สีชมพู</span>
                          <span className="text-xs sm:text-sm font-semibold text-text-primary">{CONTACT_INFO.facultyIg}</span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-text-secondary group-hover:text-primary transition-colors" />
                    </a>

                    {/* Student Council IG */}
                    <a
                      href={CONTACT_INFO.studentCouncilIgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface/80 border border-border/30 hover:border-accent-gold/40 transition-all shadow-2xs group cursor-pointer active:scale-98"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2 bg-accent-gold/10 rounded-xl text-accent-gold shrink-0">
                          <Camera size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-text-secondary uppercase mb-0.5">IG สภานักเรียน</span>
                          <span className="text-xs sm:text-sm font-semibold text-text-primary">{CONTACT_INFO.studentCouncilIg}</span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-text-secondary group-hover:text-accent-gold transition-colors" />
                    </a>

                    {/* School Facebook */}
                    <a
                      href={CONTACT_INFO.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface/80 border border-border/30 hover:border-blue-500/40 transition-all shadow-2xs group cursor-pointer active:scale-98"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 shrink-0">
                          <Globe size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-text-secondary uppercase mb-0.5">เพจ Facebook</span>
                          <span className="text-xs sm:text-sm font-semibold text-text-primary truncate max-w-[200px]">{CONTACT_INFO.facebookPage}</span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-text-secondary group-hover:text-blue-500 transition-colors" />
                    </a>

                    {/* Telephone */}
                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface/80 border border-border/30 shadow-2xs md:col-span-2">
                      <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                        <Phone size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-text-secondary uppercase mb-0.5">โทรศัพท์ติดต่อโรงเรียน</span>
                        <span className="text-xs sm:text-sm font-semibold text-text-primary font-mono">{CONTACT_INFO.telephone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Container>
  );
}
