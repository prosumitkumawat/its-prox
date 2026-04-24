import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PencilLine, 
  Pi, 
  Library, 
  Monitor, 
  Zap, 
  ClipboardList, 
  BookOpenText, 
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItem {
  icon: any;
  label: string;
  path: string;
  isNew?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const SECTIONS: SidebarSection[] = [
  {
    title: 'LEARN ONLINE',
    items: [
      { icon: PencilLine, label: 'Study', path: '/study' },
      { icon: Pi, label: 'PI', path: '/pi', isNew: true },
      { icon: Library, label: 'Library', path: '/library' },
      { icon: BookOpenText, label: 'Books', path: '/books', isNew: true },
    ]
  },
  {
    title: 'STUDY PACKS',
    items: [
      { icon: Monitor, label: 'Batches', path: '/batches' },
      { icon: Zap, label: 'Power Batch', path: '/power-batch' },
      { icon: ClipboardList, label: 'Test Series', path: '/test-series' },
      { icon: Monitor, label: 'Purchased Batches', path: '/purchased-batches' },
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { icon: Monitor, label: 'Admin Panel', path: '/xyzabc123' }
    ]
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[140] lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-100 overflow-y-auto z-[150] transition-all duration-300 custom-scrollbar",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 space-y-8">
        {SECTIONS.filter(s => s.items.length > 0).map((section) => (
          <div key={section.title}>
            <h3 className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-[#F3F2FF] text-[#5A4BDA]" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive ? "bg-[#5A4BDA] text-white shadow-md shadow-[#5A4BDA]/20" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm"
                      )}>
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.isNew && (
                        <span className="relative flex">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">New</span>
                        </span>
                      )}
                      {!isActive && (
                        <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </aside>
    </>
  );
}
