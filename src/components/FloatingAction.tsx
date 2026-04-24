import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FloatingAction = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white p-4 rounded-xl shadow-2xl border border-stroke-light max-w-[280px] pointer-events-auto relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-body-2 hover:text-headings p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="font-bold text-headings mb-1 pr-6">Talk to a counsellor</div>
            <div className="text-xs text-body-2 mb-4">Have doubts? Our support team will be happy to assist you!</div>
            <a 
              href="tel:7019243492" 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg font-bold text-sm hover:bg-primary/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              7019243492
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary p-4 rounded-full shadow-2xl cursor-pointer pointer-events-auto hover:opacity-90 transition-opacity"
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white animate-in fade-in zoom-in duration-300" />
        ) : (
          <Phone className="w-8 h-8 text-white animate-in fade-in zoom-in duration-300" />
        )}
      </div>
    </div>
  );
};

export default FloatingAction;
