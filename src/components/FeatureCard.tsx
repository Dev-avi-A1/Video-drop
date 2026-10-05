import React from 'react';
import { Zap, ShieldCheck, Smartphone, Target, Moon, Lock } from 'lucide-react';

export const FeatureCard: React.FC = () => {
  const features = [
    {
      title: 'Fast',
      description: 'Optimized request handling and instant metadata queries without bloat.',
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      title: 'Secure',
      description: 'Server credentials and API secrets are never exposed to browser client code.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Mobile Friendly',
      description: 'Responsive design meticulously tailored for smartphones, tablets, and desktops.',
      icon: <Smartphone className="w-5 h-5 text-sky-400" />
    },
    {
      title: 'Simple',
      description: 'Minimal interface with no unnecessary steps, intrusive ads, or confusing redirects.',
      icon: <Target className="w-5 h-5 text-rose-400" />
    },
    {
      title: 'Dark Mode',
      description: 'Engineered with high-contrast Obsidian dark theme and crisp typographic hierarchy.',
      icon: <Moon className="w-5 h-5 text-indigo-400" />
    },
    {
      title: 'Privacy Focused',
      description: 'Zero permanent logs of analyzed URLs. Temporary files auto-purged after 15 minutes.',
      icon: <Lock className="w-5 h-5 text-teal-400" />
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-400">
            Engineered For Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Core Features
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Built with modern web standards, strict security posture, and legal compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-[#121821] border border-slate-800 hover:border-slate-700/80 transition-all duration-200 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
