import React from 'react';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import { Lock } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว | ดุสิตสวรรค์ธัญมหาปราสาท',
  description: 'นโยบายความเป็นส่วนตัวของเว็บไซต์คณะ 2 สีชมพู',
};

export default function PrivacyPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <div className="bg-surface-card rounded-3xl p-8 md:p-12 shadow-sm border border-border/40">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Lock size={24} />
          </div>
          <SectionTitle
            title="นโยบายความเป็นส่วนตัว"
            highlightWord="ความเป็นส่วนตัว"
            className="mb-0 sm:mb-0"
          />
        </div>

        <div className="max-w-none text-text-secondary space-y-8 text-sm md:text-base leading-relaxed">
          <p className="font-semibold text-text-primary">
            ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
              ข้อมูลที่เราจัดเก็บ
            </h3>
            <p className="pl-8">
              ในการใช้งานเว็บไซต์ของเรา เราอาจมีการเก็บรวบรวมข้อมูลดังต่อไปนี้:
            </p>
            <ul className="list-disc pl-14 space-y-2 mt-2">
              <li><strong>ข้อมูลที่ท่านให้ไว้โดยตรง:</strong> เช่น ชื่อ, ข้อความ, อีโมจิ หรือรูปภาพที่ท่านอัปโหลดผ่านระบบ Cheer Wall หรือระบบอื่นๆ บนเว็บไซต์</li>
              <li><strong>ข้อมูลทางสถิติการใช้งาน:</strong> เช่น จำนวนผู้เข้าชม, หน้าที่เข้าชม, เวลาที่ใช้บนเว็บไซต์ ซึ่งเป็นข้อมูลที่ไม่สามารถระบุตัวตนบุคคลได้ (Anonymous Data)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              การนำข้อมูลไปใช้
            </h3>
            <p className="pl-8">
              เราใช้ข้อมูลที่รวบรวมได้เพื่อวัตถุประสงค์ต่อไปนี้:
            </p>
            <ul className="list-disc pl-14 space-y-2 mt-2">
              <li>เพื่อแสดงผลข้อความและรูปภาพในกิจกรรมให้กำลังใจนักกีฬา (Cheer Wall)</li>
              <li>เพื่อวิเคราะห์และปรับปรุงประสิทธิภาพการทำงานของเว็บไซต์</li>
              <li>เพื่อนำเสนอสถิติภาพรวมของการแข่งขันและกิจกรรมภายในคณะสี</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              การเก็บรักษาและปกป้องข้อมูล
            </h3>
            <p className="pl-8">
              เราใช้ระบบฐานข้อมูลที่มีมาตรฐานความปลอดภัย (Supabase) เพื่อเก็บรักษาข้อมูลของท่าน 
              เราจะไม่มีการนำข้อมูลส่วนบุคคลของท่านไปจำหน่าย จ่ายแจก หรือแลกเปลี่ยนกับบุคคลภายนอกที่ไม่เกี่ยวข้องกับกิจกรรมของโรงเรียน
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
              การลบข้อมูล
            </h3>
            <p className="pl-8">
              หากท่านต้องการลบข้อความ หรือรูปภาพของท่านที่ปรากฏบนเว็บไซต์ ท่านสามารถแจ้งให้ทีมดูแลระบบ (Admin) หรือคณะกรรมการนักเรียนทราบ 
              ทางเราจะดำเนินการลบข้อมูลออกจากระบบตามคำร้องขออย่างเร็วที่สุด
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">5</span>
              การติดต่อสอบถาม
            </h3>
            <p className="pl-8">
              หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ ท่านสามารถติดต่อทีมงานได้ผ่านช่องทางดังต่อไปนี้:
            </p>
            <ul className="list-disc pl-14 space-y-2 mt-2">
              <li><strong>Instagram คณะ 2 สีชมพู:</strong> <a href={CONTACT_INFO.facultyIgUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{CONTACT_INFO.facultyIg}</a></li>
              <li><strong>Instagram สภานักเรียน:</strong> <a href={CONTACT_INFO.studentCouncilIgUrl} target="_blank" rel="noreferrer" className="text-accent-gold hover:underline">{CONTACT_INFO.studentCouncilIg}</a></li>
              <li><strong>Facebook โรงเรียน:</strong> <a href={CONTACT_INFO.facebookUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{CONTACT_INFO.facebookPage}</a></li>
              <li><strong>โทรศัพท์:</strong> {CONTACT_INFO.telephone}</li>
            </ul>
          </section>
        </div>
      </div>
    </Container>
  );
}
