import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCompliance: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCompliance }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#0B0F14] text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent font-black">
                VIDEODROP
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              Simple. Fast. Secure. Live video metadata and provider-powered downloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#home" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <button
              type="button"
              onClick={onOpenCompliance}
              className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliance & Terms</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>
            © {new Date().getFullYear()} VideoDrop. All rights reserved. Not affiliated with YouTube or Google LLC.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Built with precision & compliance</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
