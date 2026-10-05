import React from 'react';
import { X, ShieldAlert, CheckCircle2, Server, Scale, Terminal } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compliance-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#121821] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-rose-500" />
            <h3 id="compliance-modal-title" className="text-lg font-bold text-white">
              Legal Compliance & Architecture Policy
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Legal Stance */}
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              1. Platform Restrictions & DRM Compliance
            </h4>
            <p className="text-slate-400">
              VideoDrop strictly adheres to digital copyright legislation (including DMCA and EU Copyright Directives) and YouTube's Terms of Service.
              This application does not bypass DRM, encryption keys, paywalls, or authentication boundaries. Downloading is only initiated where explicitly permitted by content license or authorized public media endpoints.
            </p>
          </div>

          {/* Section 2: Mock & API Provider Architecture */}
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              2. Clean Service Abstraction
            </h4>
            <p className="text-slate-400">
              The application implements a clean service layer (<code className="text-rose-300 font-mono text-xs">videoService.ts</code>) decoupling frontend UI components from backend data sources.
              In evaluation mode, a Mock Provider provides realistic manifests and progress simulation so that all interface capabilities can be tested safely without exposing private API keys or violating third-party terms.
            </p>
          </div>

          {/* Section 3: Data Retention & Privacy */}
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Privacy & Zero-Retention
            </h4>
            <p className="text-slate-400">
              All URL analyses are performed strictly in volatile memory. We do not persist URLs, IP records, or download histories in any database. Temporary stream containers are purged by automated background workers every 15 minutes.
            </p>
          </div>

          {/* Section 4: Security */}
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-400" />
              4. Backend Security & Abuse Protection
            </h4>
            <p className="text-slate-400">
              Our Express server enforces sliding-window IP rate limiting (60 req/min), strict URL structure sanitization, size limits on payloads, and security headers (nosniff, frameguard).
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
