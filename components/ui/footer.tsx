import React from 'react';
import Link from 'next/link';
import Container from './container';
import { NAV_ITEMS } from '@/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Split nav items for different columns
  const mainLinks = NAV_ITEMS.filter(item => !['/scoreboard', '/gallery', '/admin'].includes(item.href));
  const statsLinks = NAV_ITEMS.filter(item => ['/scoreboard', '/gallery', '/admin'].includes(item.href));

  return (
    <footer className="bg-surface border-t border-border/45 pt-14 pb-8 text-sm">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-xs">
                ดส
              </span>
              <span className="text-base font-bold text-gradient-primary">
                ดุสิตสวรรค์ธัญมหาปราสาท
              </span>
            </Link>
            <p className="text-text-secondary text-xs max-w-sm leading-relaxed">
              ระบบบริหารจัดการข้อมูลและตารางการแข่งขันกีฬาสี คณะ 2 สีชมพู (ดุสิตสวรรค์) 
              สะท้อนเอกลักษณ์ศิลปะร่วมสมัย ผสมผสานเทคโนโลยีสมัยใหม่สู่ความเป็นเลิศในทุกด้าน
            </p>
            <p className="text-[11px] text-accent-gold font-medium tracking-wide">
              "วิมานแห่งดุสิตแดนสวรรค์ พรั่งพร้อมธัญญาหารและความรุ่งเรืองอันเป็นนิรันดร์"
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">
              หน้าหลักและกิจกรรม
            </h4>
            <div className="flex flex-col gap-2.5">
              {mainLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-text-secondary hover:text-primary transition-colors text-xs"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">
              ข้อมูลและการจัดการ
            </h4>
            <div className="flex flex-col gap-2.5">
              {statsLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-text-secondary hover:text-primary transition-colors text-xs"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-text-secondary">
            © {currentYear} คณะ 2 สีชมพู (ดุสิตสวรรค์). สงวนลิขสิทธิ์ทั้งหมด
          </p>
          <div className="flex items-center gap-5 text-[11px] text-text-secondary">
            <span className="hover:text-primary cursor-pointer transition-colors">ข้อตกลงการใช้งาน</span>
            <span className="hover:text-primary cursor-pointer transition-colors">นโยบายความเป็นส่วนตัว</span>
            <span className="text-primary font-semibold">Contemporary Thai Edition</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
