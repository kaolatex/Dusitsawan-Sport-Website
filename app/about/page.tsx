'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { fetchStaff } from '@/lib/supabase/services';
import type { Tables } from '@/lib/supabase/database.types';
import { ShieldCheck, Compass, Heart, Users, User, Crown, Phone, Sparkles } from 'lucide-react';

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
      className="bg-surface-card border border-border/40 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 hover:shadow-xs transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/3 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform" />

      {/* Avatar */}
      <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent-gold/15 flex items-center justify-center shadow-xs">
        {hasAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image_url!}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-primary font-extrabold text-base select-none">
            {getInitial(member.name)}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h5 className="font-bold text-text-primary text-sm truncate group-hover:text-primary transition-colors">
            {member.name}
          </h5>
          {member.position && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">
              <Crown size={9} />
              {member.position}
            </span>
          )}
        </div>

        {member.department && (
          <p className="text-[11px] text-text-secondary font-medium">
            {member.department}
          </p>
        )}

        {member.contact_info && (
          <p className="text-[10px] text-accent-gold flex items-center gap-1 font-mono pt-0.5">
            <Phone size={10} className="shrink-0" />
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

    // Sort items within each category by display_order ascending
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
    <Container className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-20"
      >
        {/* Header Title */}
        <SectionTitle
          subtitle="เกี่ยวกับพวกเรา"
          title="คณะ 2 สีชมพู ดุสิตสวรรค์ธัญมหาปราสาท"
          highlightWord="ดุสิตสวรรค์ธัญมหาปราสาท"
        />

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-text-secondary leading-relaxed text-sm">
            <p>
              ชื่อคณะสี <span className="text-primary font-semibold">"ดุสิตสวรรค์ธัญมหาปราสาท"</span> ได้รับแรงบันดาลใจจากแดนดุสิตซึ่งเป็นสวรรค์ชั้นที่สี่อันพรั่งพร้อมไปด้วยความดีงามและความสงบสุข ผสานกับคำว่า "ธัญ" (ความอุดมสมบูรณ์) และ "มหาปราสาท" (ความยิ่งใหญ่และสง่างาม)
            </p>
            <p>
              เราเชื่อในการแสดงออกที่เรียบง่ายแต่ทรงพลัง (Less is More) โดยการนำเสนอแนวคิดแบบไทยร่วมสมัย หลีกเลี่ยงรูปแบบดั้งเดิมที่หนักเกินไป แต่เลือกดึงเอาจิตวิญญาณ ความอ่อนช้อย และสีสันอันนุ่มนวลของสถาปัตยกรรมไทย มาผสานเข้ากับงานกราฟิกและดีไซน์ระดับสากล
            </p>
            <p>
              ในงานกีฬาสีปีนี้ คณะสีชมพูพร้อมแล้วที่จะแสดงศักยภาพของนักกีฬาในทุกประเภท พร้อมด้วยสแตนด์เชียร์และขบวนพาเหรดที่สะท้อนถึงความคิดสร้างสรรค์อันไร้ขีดจำกัด
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent-gold/10 p-8 border border-primary/10 flex flex-col justify-center min-h-[280px]">
            <span className="text-7xl font-extrabold text-primary/10 absolute right-6 bottom-4 select-none">
              PINK 02
            </span>
            <h3 className="text-xl font-bold text-gradient-primary mb-3">
              สัญลักษณ์แห่งชัยชนะและความสง่างาม
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              สีชมพูเข้ม (#E6007E) เป็นตัวแทนของความรัก ความสามัคคี และพลังขับเคลื่อนอันแรงกล้า ผนวกกับสีทองอ่อน (#D4AF37) ที่เข้ามาช่วยแต่งแต้มความสง่างามและความเป็นเลิศ
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold tracking-wider">
                EST. 2026
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-semibold tracking-wider">
                CONTEMPORARY THAI
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Staff & Executive Section */}
        <div className="space-y-12 pt-6 border-t border-border/40">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary">
              <Sparkles size={13} />
              คณะผู้จัดทำ & เจ้าหน้าที่
            </span>
            <h3 className="text-2xl font-extrabold text-text-primary">
              ทีมงานผู้อยู่เบื้องหลังความสำเร็จ
            </h3>
          </div>

          {Object.keys(groupedStaff).length > 0 ? (
            <div className="space-y-10">
              {Object.keys(groupedStaff).map((categoryType) => (
                <div key={categoryType} className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                    <User size={16} className="text-primary" />
                    <h4 className="font-bold text-text-primary text-base uppercase tracking-wider">
                      {categoryType}
                    </h4>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface text-text-secondary font-mono border border-border/30">
                      {groupedStaff[categoryType].length} คน
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {groupedStaff[categoryType].map((member) => (
                      <StaffCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-surface-card border border-border/40 rounded-2xl">
              <p className="text-xs text-text-secondary">กำลังอัปเดตข้อมูลเจ้าหน้าที่ประจำคณะ</p>
            </div>
          )}
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-border/40">
          {values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="bg-surface-card border border-border/40 p-6 rounded-2xl hover:shadow-xs hover:border-primary/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h4 className="font-semibold text-text-primary text-sm mb-2">
                {item.title}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  );
}
