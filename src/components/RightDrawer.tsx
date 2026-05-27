import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  secondLayer?: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  };
}

export const RightDrawer = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer, 
  width = 380,
  secondLayer
}: RightDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[2000]"
          />
          
          {/* Main Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-[60px] bottom-[28px] bg-white border-l border-border-default shadow-[-2px_0_12px_rgba(0,0,0,0.06)] z-[2001] flex flex-col"
            style={{ width }}
          >
            {/* Header */}
            <div className="h-[56px] border-b border-border-default flex items-center justify-between px-6 shrink-0">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-text-primary uppercase tracking-tight">[{title}]</span>
                {subtitle && <span className="all-caps-label text-[10px]">{subtitle}</span>}
              </div>
              <button onClick={onClose} className="p-1 hover:bg-bg-hover rounded-sm text-text-secondary">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 font-sans">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="h-[64px] border-t border-border-default flex items-center justify-between px-6 shrink-0 bg-bg-secondary/30">
                {footer}
              </div>
            )}

            {/* Second Layer Drawer */}
            <AnimatePresence>
              {secondLayer?.isOpen && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute right-0 top-0 bottom-0 bg-white border-l border-border-default shadow-[-2px_0_12px_rgba(0,0,0,0.06)] z-[2002] flex flex-col"
                  style={{ width: 360 }}
                >
                  <div className="h-[56px] border-b border-border-default flex items-center justify-between px-6 shrink-0">
                    <span className="text-[13px] font-bold text-text-primary uppercase tracking-tight">[{secondLayer.title}]</span>
                    <button onClick={secondLayer.onClose} className="p-1 hover:bg-bg-hover rounded-sm text-text-secondary">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    {secondLayer.children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
