'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotoWall } from '@/hooks/useData';
import { Heart, Maximize2, X, Pin } from 'lucide-react';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import LoadingState from '@/components/ui/loading-state';
import { likePhotoWallPost } from '@/lib/supabase/services';
import type { PhotoWallPost } from '@/types';

export default function PhotoWallGrid() {
  const { data, loading, error } = usePhotoWall('approved', 100, true);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWallPost | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Restore liked state from localStorage (simple client-side check)
  useEffect(() => {
    const saved = localStorage.getItem('likedPhotoWallIds');
    if (saved) {
      try {
        setLikedIds(new Set(JSON.parse(saved)));
      } catch (e) {}
    }
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <div className="text-center text-red-500 py-10">Failed to load Photo Wall</div>;

  const photos = data ?? [];

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 bg-surface border border-border/40 rounded-3xl mt-4">
        <p className="text-text-secondary">ยังไม่มีรูปภาพในขณะนี้ เป็นคนแรกที่เริ่มแชร์เลย!</p>
      </div>
    );
  }

  const handleLike = (e: React.MouseEvent, photo: PhotoWallPost) => {
    e.stopPropagation();
    if (likedIds.has(photo.id) || photo.status === 'pending') return; // Already liked or pending
    
    // Optimistic update
    const newSet = new Set(likedIds);
    newSet.add(photo.id);
    setLikedIds(newSet);
    localStorage.setItem('likedPhotoWallIds', JSON.stringify(Array.from(newSet)));

    // Fire & forget
    likePhotoWallPost(photo.id);
  };

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4 mt-6">
        {photos.map((photo: PhotoWallPost) => {
          const isLiked = likedIds.has(photo.id);
          const isPending = photo.status === 'pending';
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPhoto(photo)}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all bg-surface-card"
            >
              <ImageWithFallback
                src={photo.image_url}
                alt={photo.caption || 'Community Photo'}
                className="w-full h-auto object-cover"
                containerClassName="w-full"
              />
              {/* Overlay - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    {photo.is_pinned && (
                      <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Pin size={10} /> ปักหมุด
                      </span>
                    )}
                    {isPending && (
                      <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                        ⏳ รออนุมัติ
                      </span>
                    )}
                  </div>
                  <Maximize2 size={16} className="text-white drop-shadow-md hidden sm:block" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-xs font-medium truncate drop-shadow-md">
                      {photo.uploader_name || 'ไม่ระบุนาม'}
                    </p>
                    <button 
                      onClick={(e) => handleLike(e, photo)}
                      disabled={isPending}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full backdrop-blur-sm transition-all ${
                        isLiked 
                          ? 'bg-primary text-white' 
                          : 'bg-white/20 text-white hover:bg-white/40'
                      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                      <span>{photo.likes_count + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>
                  {photo.caption && (
                    <p className="text-white/80 text-[10px] line-clamp-2 drop-shadow-sm leading-tight">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption || 'Community Photo'}
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl object-contain"
              />
              <div className="mt-4 text-center max-w-2xl bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex justify-center items-center gap-2 mb-1">
                  <p className="text-white/70 text-sm font-medium">
                    ถ่ายโดย: <span className="text-white">{selectedPhoto.uploader_name || 'ไม่ระบุนาม'}</span>
                  </p>
                  {selectedPhoto.status === 'pending' && (
                    <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                      ⏳ รออนุมัติ
                    </span>
                  )}
                </div>
                {selectedPhoto.caption && (
                  <p className="text-white text-base leading-relaxed mt-2">
                    {selectedPhoto.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
