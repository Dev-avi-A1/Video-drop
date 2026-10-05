import React from 'react';
import { ClipboardCopy, Search, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      index: '01',
      title: 'Paste',
      description: 'Paste any supported public YouTube video or shorts URL into the input field.',
      icon: <ClipboardCopy className="w-5 h-5 text-rose-400" />
    },
    {
      index: '02',
      title: 'Analyze',
      description: 'The server retrieves authorized video metadata, audio streams, and available resolutions.',
      icon: <Search className="w-5 h-5 text-amber-400" />
    },
    {
      index: '03',
      title: 'Download',
      description: 'Choose your desired format (MP4 video or MP3/M4A audio) and download the file directly.',
      icon: <Download className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-400">
            Streamlined Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A frictionless three-step process designed for speed, privacy, and simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.index}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#121821] border border-slate-800 hover:border-slate-700/80 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {step.index}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
                Step {step.index} of 03
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
