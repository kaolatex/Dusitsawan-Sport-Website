import React from 'react';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import { ShieldAlert } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export const metadata = {
  title: 'ข้อตกลงการใช้งาน | ดุสิตสวรรค์ธัญมหาปราสาท',
  description: 'ข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์คณะ 2 สีชมพู',
};

export default function TermsPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <div className="bg-surface-card rounded-3xl p-8 md:p-12 shadow-sm border border-border/40">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <ShieldAlert size={24} />
          </div>
          <SectionTitle
            title="ข้อตกลงการใช้งาน"
            highlightWord="ข้อตกลง"
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
              การยอมรับข้อตกลง
            </h3>
            <p className="pl-8">
              โดยการเข้าถึงและใช้งานเว็บไซต์ "ดุสิตสวรรค์ธัญมหาปราสาท" (คณะ 2 สีชมพู) ถือว่าท่านได้อ่าน ทำความเข้าใจ 
              และตกลงยอมรับข้อผูกพันตามข้อตกลงและเงื่อนไขการใช้งานเหล่านี้ทุกประการ หากท่านไม่เห็นด้วยกับข้อตกลงนี้ 
              กรุณางดเว้นการใช้งานเว็บไซต์
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              วัตถุประสงค์ของเว็บไซต์
            </h3>
            <p className="pl-8">
              เว็บไซต์นี้จัดทำขึ้นเพื่อใช้ในการนำเสนอข้อมูล กิจกรรม ข่าวสาร และเป็นช่องทางสื่อสารภายในกิจกรรมกีฬาสี 
              ของโรงเรียนพระนารายณ์ ประจำปีการศึกษาปัจจุบัน โดยมีกลุ่มเป้าหมายคือ นักเรียน ครู อาจารย์ และผู้ที่เกี่ยวข้อง
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              การใช้งานกระดานข้อความ (Cheer Wall) และการส่งรูปภาพ
            </h3>
            <p className="pl-8">
              เพื่อให้เว็บไซต์เป็นพื้นที่ที่สร้างสรรค์และปลอดภัย ผู้ใช้งานต้องปฏิบัติตามกฎกติกาดังต่อไปนี้อย่างเคร่งครัด:
            </p>
            <ul className="list-disc pl-14 space-y-2 mt-2">
              <li>ห้ามโพสต์ข้อความหรือรูปภาพที่มีเนื้อหาหยาบคาย ลามกอนาจาร หมิ่นประมาท หรือผิดกฎหมาย</li>
              <li>ห้ามโพสต์ข้อความที่สร้างความแตกแยก ยุยง หรือพาดพิงถึงบุคคลอื่นในทางเสื่อมเสีย</li>
              <li>การส่งรูปภาพต้องเป็นรูปภาพที่ท่านมีสิทธิ์หรือได้รับอนุญาตให้เผยแพร่</li>
              <li>ทีมผู้ดูแลระบบ (Admin) ขอสงวนสิทธิ์ในการลบข้อความหรือรูปภาพที่ไม่เหมาะสมได้ทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
              ทรัพย์สินทางปัญญา
            </h3>
            <p className="pl-8">
              ข้อมูล รูปภาพ โลโก้ และเนื้อหาทั้งหมดที่ปรากฏบนเว็บไซต์นี้ เป็นทรัพย์สินทางปัญญาของคณะผู้จัดทำ 
              ไม่อนุญาตให้นำไปทำซ้ำ ดัดแปลง หรือเผยแพร่เพื่อการค้าโดยไม่ได้รับอนุญาต
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">5</span>
              ช่องทางการติดต่อ
            </h3>
            <p className="pl-8">
              หากท่านมีข้อสงสัยเกี่ยวกับข้อตกลงการใช้งานนี้ ท่านสามารถติดต่อทีมงานได้ผ่านช่องทางดังต่อไปนี้:
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
