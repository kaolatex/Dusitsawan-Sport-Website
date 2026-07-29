'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
    <Container className="py-10 md:py-18">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        {/* Header Title */}
        <SectionTitle
          subtitle="เกี่ยวกับพวกเรา"
          title="คณะ 2 สีชมพู ดุสิตสวรรค์ธัญมหาปราสาท"
          highlightWord="ดุสิตสวรรค์ธัญมหาปราสาท"
        />

        {/* Compact Layout for Mobile-First */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* About Concept (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-card rounded-3xl p-6 md:p-8 shadow-sm space-y-4 border border-border/20">
              <h3 className="text-xl font-extrabold text-gradient-primary">
                สัญลักษณ์แห่งชัยชนะและความสง่างาม
              </h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                ชื่อคณะสี <span className="text-primary font-semibold">"ดุสิตสวรรค์ธัญมหาปราสาท"</span> ได้รับแรงบันดาลใจจากแดนดุสิตซึ่งเป็นสวรรค์ชั้นที่สี่ ผสานกับคำว่า "ธัญ" (ความอุดมสมบูรณ์) และ "มหาปราสาท" (ความยิ่งใหญ่)
              </p>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                เราเชื่อในการนำเสนอแนวคิดแบบไทยร่วมสมัย (Contemporary Thai) ดึงเอาจิตวิญญาณและความอ่อนช้อยของศิลปะไทย มาผสานกับสุนทรียศาสตร์ดิจิทัลยุคใหม่
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold tracking-wider">
                  EST. 2026
                </span>
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-semibold tracking-wider">
                  CONTEMPORARY THAI
                </span>
              </div>
            </div>

            {/* Core Values 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-card rounded-2xl p-4 shadow-sm border border-border/20 hover:shadow-md transition-all active:scale-98"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center mb-2 text-primary">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-text-primary text-xs mb-1">{item.title}</h4>
                  <p className="text-text-secondary text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Card (5 cols) - Apple Minimalist Compact Card */}
          <div className="lg:col-span-5 bg-surface-card rounded-3xl p-6 shadow-md border border-border/20 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full translate-x-8 -translate-y-8" />

            <div className="space-y-1 border-b border-border/30 pb-3">
              <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-primary/10 text-primary rounded-full inline-block">
                Contact & Socials
              </span>
              <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                ช่องทางติดต่อเรา
              </h3>
            </div>

            {/* Contact Items Stack */}
            <div className="space-y-2.5">
              {/* School Address */}
              <a
                href={CONTACT_INFO.addressUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-surface/60 border border-border/20 hover:border-primary/30 transition-all shadow-2xs group cursor-pointer active:scale-98"
              >
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">ที่อยู่โรงเรียน</span>
                    <span className="text-xs font-semibold text-text-primary leading-snug">{CONTACT_INFO.address}</span>
                  </div>
                </div>
                <ExternalLink size={12} className="text-text-secondary group-hover:text-primary transition-colors shrink-0 mt-1" />
              </a>

              {/* Faculty IG */}
              <a
                href={CONTACT_INFO.facultyIgUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-surface/60 border border-border/20 hover:border-primary/30 transition-all shadow-2xs group cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Camera size={15} className="text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">IG คณะ 2 สีชมพู</span>
                    <span className="text-xs font-semibold text-text-primary">{CONTACT_INFO.facultyIg}</span>
                  </div>
                </div>
                <ExternalLink size={12} className="text-text-secondary group-hover:text-primary transition-colors" />
              </a>

              {/* Student Council IG */}
              <a
                href={CONTACT_INFO.studentCouncilIgUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-surface/60 border border-border/20 hover:border-primary/30 transition-all shadow-2xs group cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Camera size={15} className="text-accent-gold shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">IG สภานักเรียน</span>
                    <span className="text-xs font-semibold text-text-primary">{CONTACT_INFO.studentCouncilIg}</span>
                  </div>
                </div>
                <ExternalLink size={12} className="text-text-secondary group-hover:text-accent-gold transition-colors" />
              </a>

              {/* School Facebook */}
              <a
                href={CONTACT_INFO.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-surface/60 border border-border/20 hover:border-primary/30 transition-all shadow-2xs group cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Globe size={15} className="text-blue-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">เพจ Facebook</span>
                    <span className="text-xs font-semibold text-text-primary truncate max-w-[180px]">{CONTACT_INFO.facebookPage}</span>
                  </div>
                </div>
                <ExternalLink size={12} className="text-text-secondary group-hover:text-blue-500 transition-colors" />
              </a>

              {/* Telephone */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface/60 border border-border/20 shadow-2xs">
                <Phone size={15} className="text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-text-secondary uppercase">โทรศัพท์ติดต่อ</span>
                  <span className="text-xs font-semibold text-text-primary font-mono">{CONTACT_INFO.telephone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Staff & Executive Section */}
        <div className="space-y-6 pt-6 border-t border-border/30">
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary shadow-2xs">
              <Sparkles size={13} />
              คณะผู้จัดทำ & เจ้าหน้าที่
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-text-primary">
              ทีมงานผู้อยู่เบื้องหลังความสำเร็จ
            </h3>
          </div>

          {Object.keys(groupedStaff).length > 0 ? (
            <div className="space-y-6">
              {Object.keys(groupedStaff).map((categoryType) => (
                <div key={categoryType} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-2">
                    <User size={15} className="text-primary" />
                    <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">
                      {categoryType}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-secondary font-mono border border-border/20">
                      {groupedStaff[categoryType].length} คน
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupedStaff[categoryType].map((member) => (
                      <StaffCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-surface-card rounded-2xl shadow-sm border border-border/20">
              <p className="text-xs text-text-secondary">กำลังอัปเดตข้อมูลเจ้าหน้าที่ประจำคณะ</p>
            </div>
          )}
        </div>
      </motion.div>
    </Container>
  );
}
