'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadPhotoToWall, fetchPhotoWallStatuses } from '@/lib/supabase/services';
import type { SiteSettings } from '@/types';

interface UploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings | null;
}

export default function UploadSheet({ isOpen, onClose, settings }: UploadSheetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myPendingPhotos, setMyPendingPhotos] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPaused = settings?.is_photo_wall_paused;

  // Load pending photos and check real statuses
  useEffect(() => {
    if (!isOpen) return;
    const pendingStr = localStorage.getItem('myPendingPhotos');
    if (pendingStr) {
      try {
        const localPhotos = JSON.parse(pendingStr);
        setMyPendingPhotos(localPhotos);
        
        // Fetch actual statuses from DB
        const ids = localPhotos.map((p: any) => p.id);
        if (ids.length > 0) {
          fetchPhotoWallStatuses(ids).then(latestData => {
            if (latestData && latestData.length > 0) {
              const updatedPhotos = localPhotos.map((p: any) => {
                const latest = latestData.find((d: any) => d.id === p.id);
                if (latest) return { ...p, status: latest.status };
                return { ...p, status: 'deleted' };
              });
              setMyPendingPhotos(updatedPhotos);
              // Save updated back to localstorage so they persist their statuses
              localStorage.setItem('myPendingPhotos', JSON.stringify(updatedPhotos));
            }
          });
        }
      } catch (e) {}
    }
  }, [isOpen]);

  // Compress image to webp
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    if (!selected.type.startsWith('image/')) {
      setError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
      return;
    }

    setError(null);
    setSuccess(false);
    
    // Preview original
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selected);

    // Compress using Canvas
    const img = new Image();
    img.src = URL.createObjectURL(selected);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Max dimension 1200px
      const MAX_SIZE = 1200;
      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], `${Date.now()}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            setFile(compressedFile);
          }
        },
        'image/webp',
        0.7 // quality
      );
    };
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const inserted = await uploadPhotoToWall(file, uploaderName, caption);
      if (inserted) {
        // Save to local storage to show in grid immediately as pending
        const existingStr = localStorage.getItem('myPendingPhotos');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        existing.push(inserted);
        localStorage.setItem('myPendingPhotos', JSON.stringify(existing));
        setMyPendingPhotos(existing);
        // Dispatch custom event to notify grid to reload local storage
        window.dispatchEvent(new Event('photoUploaded'));
      }
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setUploaderName('');
    setCaption('');
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-surface rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-center p-3">
              <div className="w-12 h-1.5 bg-border rounded-full" />
            </div>
            
            <div className="px-6 pb-8 pt-2 max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">ส่งรูปของคุณ</h3>
                  <p className="text-sm text-text-secondary">แชร์ภาพความประทับใจลง Photo Wall</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 bg-surface-card hover:bg-border/50 rounded-full transition-colors text-text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              {isPaused ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center text-red-600 dark:text-red-400">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <X size={24} />
                  </div>
                  <h4 className="font-bold mb-1">ปิดรับรูปชั่วคราว</h4>
                  <p className="text-sm">ขณะนี้ระบบงดรับรูปภาพชั่วคราว ขออภัยในความไม่สะดวกครับ</p>
                </div>
              ) : success ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-2xl p-8 text-center text-green-600 dark:text-green-400 flex flex-col items-center"
                >
                  <CheckCircle2 size={48} className="mb-4" />
                  <h4 className="font-bold text-lg mb-1">ส่งรูปรอการตรวจสอบสำเร็จ!</h4>
                  <p className="text-sm">รูปของคุณจะแสดงบน Photo Wall ทันทีที่แอดมินอนุมัติ</p>
                </motion.div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-4">
                  {/* Image Upload Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      preview 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-surface-card'
                    }`}
                  >
                    {preview ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-black/5">
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <span className="font-medium">เปลี่ยนรูปภาพ</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                          <UploadCloud size={28} />
                        </div>
                        <h4 className="font-bold text-text-primary mb-1">กดเพื่อเลือกรูปภาพ</h4>
                        <p className="text-xs text-text-secondary">รองรับ JPG, PNG (ระบบจะบีบอัดอัตโนมัติ)</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      {error}
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        ชื่อช่างภาพ (ไม่บังคับ)
                      </label>
                      <input
                        type="text"
                        value={uploaderName}
                        onChange={e => setUploaderName(e.target.value)}
                        placeholder="เช่น น้องดุสิต ม.6/1"
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-text-primary"
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        ข้อความบรรยาย (ไม่บังคับ)
                      </label>
                      <textarea
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="เขียนคำบรรยายสั้นๆ ให้รูปนี้..."
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-text-primary resize-none h-20"
                        maxLength={150}
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="pt-2">
                    <p className="text-[10px] text-text-secondary text-center mb-3 flex items-center justify-center gap-1">
                      <span>⏳</span> รูปภาพจะแสดงสถานะ <b>รออนุมัติ</b> หลังจากการส่ง
                    </p>
                    <button
                      type="submit"
                      disabled={!file || isUploading}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        !file || isUploading
                          ? 'bg-surface-card text-text-secondary cursor-not-allowed border border-border'
                          : 'bg-primary text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> กำลังส่งรูปภาพ...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={18} /> ส่งรูปภาพเข้าระบบ
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Pending Photos List */}
              {!isPaused && myPendingPhotos.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-text-primary mb-3">สถานะรูปภาพของคุณ</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {myPendingPhotos.map(photo => {
                      const isApproved = photo.status === 'approved';
                      const isRejected = photo.status === 'rejected';
                      const isDeleted = photo.status === 'deleted';
                      const isFlagged = photo.status === 'flagged';
                      
                      return (
                      <div key={photo.id} className="relative rounded-lg overflow-hidden border border-border bg-surface-card aspect-square">
                        <img src={photo.image_url} alt="Status" className={`w-full h-full object-cover ${isApproved ? '' : 'grayscale'}`} />
                        <div className={`absolute inset-0 flex flex-col items-center justify-center p-2 backdrop-blur-[2px] transition-colors ${
                          isApproved ? 'bg-green-900/60' :
                          isRejected || isDeleted || isFlagged ? 'bg-red-900/60' :
                          'bg-black/50'
                        }`}>
                          <span className="text-white text-xl mb-1 drop-shadow-md">
                            {isApproved ? '✅' : isRejected ? '❌' : isDeleted ? '🗑️' : isFlagged ? '⚠️' : '⏳'}
                          </span>
                          <span className="text-white text-[10px] font-bold text-center drop-shadow-md">
                            {isApproved ? 'อนุมัติแล้ว' : isRejected ? 'ไม่อนุมัติ' : isDeleted ? 'ถูกลบ' : isFlagged ? 'ถูกซ่อน' : 'รออนุมัติ'}
                          </span>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
