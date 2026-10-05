import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCompliance: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, onToggleTheme, onOpenCompliance }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Compliance', href: '#compliance', onClick: onOpenCompliance }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B0F14]/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home" 
          className="text-xl font-extrabold tracking-tight text-white hover:text-rose-400 transition-colors flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent font-black">
            VIDEODROP
          </span>
        </a>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
              }}
              className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-rose-500/60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCompliance}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Policy & ToS</span>
          </button>

          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0B0F14] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCompliance();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Review YouTube Terms & API Architecture</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
