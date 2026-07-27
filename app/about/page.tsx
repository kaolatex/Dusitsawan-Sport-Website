'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import { ShieldCheck, Compass, Heart, Users } from 'lucide-react';

export default function AboutPage() {
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
      >
        <SectionTitle
          subtitle="เกี่ยวกับพวกเรา"
          title="คณะ 2 สีชมพู ดุสิตสวรรค์ธัญมหาปราสาท"
          highlightWord="ดุสิตสวรรค์ธัญมหาปราสาท"
        />

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
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

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
