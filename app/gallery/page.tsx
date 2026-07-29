'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/container';
import SectionTitle from '@/components/ui/section-title';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import LoadingState, { ErrorState } from '@/components/ui/loading-state';
import { useGallery } from '@/hooks/useData';
import { X, ZoomIn, Calendar } from 'lucide-react';

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

        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setSelectedImage(null);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
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
                    <span className="text-[10px] bg-primary px-2 py-0.5 rounded-full w-max mb-2 font-semibold">
                      {img.sportName}
                    </span>
                  )}
                  <h4 className="font-bold text-xs leading-snug">{img.title}</h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-300 mt-1">
                    <Calendar size={10} />
                    <span>{img.date}</span>
                  </div>
                  <ZoomIn size={16} className="absolute top-4 right-4 text-white/80" />
                </div>
              </div>
            ))}
          </div>
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
                    <span className="text-[10px] bg-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      {currentImage.sportName}
                    </span>
                  )}
                  <h3 className="font-bold text-sm mt-2">{currentImage.title}</h3>
                  <p className="text-[10px] text-white/50 mt-1">{currentImage.date}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}
