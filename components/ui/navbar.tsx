'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock } from 'lucide-react';
import { NAV_ITEMS } from '@/constants';
import Container from './container';
import { ThemeToggle } from './theme-toggle';

import AnnouncementBanner from './announcement-banner';
import PasscodeModal from './passcode-modal';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Easter Egg State
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    setTapCount(prev => prev + 1);

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    tapTimerRef.current = setTimeout(() => {
      setTapCount(0);
    }, 4000);

    if (tapCount + 1 >= 10) {
      setIsPasscodeModalOpen(true);
      setTapCount(0);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <AnnouncementBanner />
      <div className={`${scrolled
          ? 'glassmorphism border-b border-border/40 py-3 shadow-xs'
          : 'bg-background/80 backdrop-blur-md border-b border-border/20 py-3.5'
        }`}>
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" onClick={handleLogoTap} className="flex items-center gap-2.5 group">
              <Image
                src="/logo.png"
                alt="Dusitsawan Logo"
                width={80}
                height={80}
                priority
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-base font-bold tracking-wide bg-gradient-to-r from-zinc-900 via-zinc-900 to-primary dark:from-white dark:via-white dark:to-primary bg-clip-text text-transparent leading-tight">
                  ดุสิตสวรรค์ธัญมหาปราสาท
                </span>
                <span className="text-[9px] tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-0.5 group-hover:text-primary transition-colors font-semibold">
                  Dusitsawan Tunyamahaprasat
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto whitespace-nowrap">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const isAdmin = item.href === '/admin';

                if (isAdmin) return null; // Render admin separately

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors relative shrink-0 ${isActive
                        ? 'text-primary dark:text-pink-400'
                        : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-primary/5 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Admin / CTA Button (Desktop) */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <ThemeToggle />
              {pathname === '/admin' ? (
                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border bg-rose-500 hover:bg-rose-600 border-rose-500 text-white shadow-xs cursor-pointer active:scale-95"
                >
                  <X size={14} />
                  ปิด Admin Panel
                </Link>
              ) : (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border bg-surface-card border-border hover:border-primary/20 text-text-primary"
                >
                  <Lock size={12} className="text-primary" />
                  จัดการข้อมูล
                </Link>
              )}
            </div>

            {/* Mobile Menu & Theme Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </Container>
      </div>

      <PasscodeModal 
        isOpen={isPasscodeModalOpen} 
        onClose={() => setIsPasscodeModalOpen(false)} 
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-lg overflow-hidden"
          >
            <Container className="py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const isAdmin = item.href === '/admin';

                if (isAdmin && pathname === '/admin') {
                  return (
                    <Link
                      key="close-admin"
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold border border-rose-500/30 text-rose-500 mt-2 bg-rose-500/10"
                    >
                      <span>ปิด Admin Panel</span>
                      <X size={16} />
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive
                        ? 'bg-primary/5 text-primary font-semibold'
                        : isAdmin
                          ? 'border border-border/60 text-text-primary mt-2 bg-surface-card'
                          : 'text-text-secondary hover:bg-surface/50 hover:text-text-primary'
                      }`}
                  >
                    <span>{item.label}</span>
                    {isAdmin ? (
                      <Lock size={14} className="text-primary" />
                    ) : null}
                  </Link>
                );
              })}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
