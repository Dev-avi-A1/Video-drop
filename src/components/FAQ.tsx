import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Is the service free?',
      answer: 'Yes. VideoDrop is a free utility designed for personal archiving, educational analysis, and previewing authorized media formats without registration or subscription fees.'
    },
    {
      question: 'Where are downloaded files stored?',
      answer: 'Files downloaded from VideoDrop are saved directly to your local device (such as your browser’s default Downloads directory). On the server, temporary transcode jobs are stored in volatile memory and purged automatically within 15 minutes of creation.'
    },
    {
      question: 'Can I download any YouTube video?',
      answer: 'No. Downloading is strictly supported only where legally and technically permitted. VideoDrop honors DRM access controls, content licensing, and YouTube Terms of Service. If a video is protected or restricted, the platform will display an authorized restriction notice rather than attempting to bypass digital safeguards.'
    },
    {
      question: 'Are private or age-restricted videos supported?',
      answer: 'No. We do not support private videos, unlisted videos with restricted permissions, or content requiring account authentication. All metadata queries are conducted through public, authorized endpoints.'
    },
    {
      question: 'Do you store my URLs or personal browsing history?',
      answer: 'No. We believe in strict data minimization. URLs submitted for analysis are processed transiently in memory to fetch stream manifests and are never written to permanent database storage or shared with third-party trackers.'
    },
    {
      question: 'What video and audio formats are supported?',
      answer: 'When available from the authorized stream, we support MP4 video containers at 1080p Full HD, 720p HD, 480p, and 360p resolutions, as well as MP3 and M4A audio formats for music and podcast listening.'
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-400">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Clear, transparent answers about our privacy practices, legal compliance, and technical features.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-800 bg-[#121821] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-200">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
