'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useGallery, useSiteSettings } from '@/hooks/useData';
import { X, ZoomIn, Calendar, Camera } from 'lucide-react';
import PhotoWallGrid from '@/components/ui/photo-wall/photo-wall-grid';
import UploadSheet from '@/components/ui/photo-wall/upload-sheet';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | string>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: gallery, loading, error } = useGallery();

  const images = gallery ?? [];
  const filters: string[] = ['all', ...Array.from(new Set<string>(images.map((img: any) => img.sportName as string).filter((name: string) => !!name)))];

  const filteredImages = activeFilter === 'all'
    ? images
    : images.filter((img: any) => img.sportName === activeFilter);

  const currentImage = images.find((img: any) => img.id === selectedImage);
  const { data: settings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'community' | 'official'>('community');
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);

  return (
    <Container className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle
          subtitle="ภาพบรรยากาศ"
          title="แกลเลอรีรูปภาพกีฬาสี"
          highlightWord="แกลเลอรีรูปภาพ"
        />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-surface-card border border-border/40 rounded-full shadow-sm max-w-sm w-full">
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                activeTab === 'community'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              💖 Photo Wall
            </button>
            <button
              onClick={() => setActiveTab('official')}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                activeTab === 'official'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              📸 รูปจากช่างภาพ
            </button>
          </div>
        </div>

        {activeTab === 'official' ? (
          <>
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setSelectedImage(null);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all border cursor-pointer active:scale-95 ${
                    activeFilter === filter
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-surface-card border-border/40 hover:border-primary/20 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {filter === 'all' ? 'ทั้งหมด' : filter}
                </button>
              ))}
            </div>

            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} />
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredImages.map((img: any) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img.id)}
                    className="break-inside-avoid bg-surface-card border border-border/40 rounded-2xl overflow-hidden shadow-xs hover:border-primary/20 hover:shadow-sm cursor-pointer relative group transition-all"
                  >
                    <ImageWithFallback
                      src={img.imageUrl}
                      alt={img.title}
                      containerClassName="w-full"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                      {img.sportName && (
                        <span className="text-xs bg-primary px-3 py-1 rounded-full w-max mb-2 font-semibold">
                          {img.sportName}
                        </span>
                      )}
                      <h4 className="font-bold text-sm leading-snug">{img.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                        <Calendar size={12} />
                        <span>{img.date}</span>
                      </div>
                      <ZoomIn size={16} className="absolute top-4 right-4 text-white/80" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <PhotoWallGrid />
        )}

        <AnimatePresence>
          {selectedImage && currentImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={currentImage.imageUrl}
                  alt={currentImage.title}
                  containerClassName="max-w-full max-h-[72vh] rounded-2xl"
                  className="max-w-full max-h-[72vh] rounded-2xl object-contain shadow-2xl"
                />
                <div className="text-center text-white/90">
                  {currentImage.sportName && (
                    <span className="text-xs bg-primary px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                      {currentImage.sportName}
                    </span>
                  )}
                  <h3 className="font-bold text-base mt-2">{currentImage.title}</h3>
                  <p className="text-xs text-white/80 mt-1">{currentImage.date}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Action Button (Only in Community Tab) */}
      <AnimatePresence>
        {activeTab === 'community' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadSheetOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 bg-primary hover:bg-primary-hover text-white px-5 py-3.5 rounded-full shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera size={20} />
            <span className="font-bold text-sm">ส่งรูปของคุณ</span>
          </motion.button>
        )}
      </AnimatePresence>

      <UploadSheet 
        isOpen={isUploadSheetOpen} 
        onClose={() => setIsUploadSheetOpen(false)} 
        settings={settings}
      />
    </Container>
  );
}
