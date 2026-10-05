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
      answer: 'VideoDrop adds no registration requirement, subscription gate, or download quota. Availability depends on the connected download provider.'
    },
    {
      question: 'Where are downloaded files stored?',
      answer: 'Your browser saves files to your device. VideoDrop returns a download link; the connected provider handles media processing, delivery, and link expiration. VideoDrop does not store media files.'
    },
    {
      question: 'Can I download any YouTube video?',
      answer: 'You can request any supported YouTube video without artificial site-imposed format locks or quotas. The provider must be able to access the video. Removed videos, DRM, sign-in requirements, and provider limitations can still prevent downloads. Download only content you have permission to save.'
    },
    {
      question: 'Are private or age-restricted videos supported?',
      answer: 'Public and accessible unlisted videos can be attempted. VideoDrop does not supply account credentials or bypass access controls. Videos requiring authentication depend on the provider and may fail.'
    },
    {
      question: 'Do you store my URLs or personal browsing history?',
      answer: 'VideoDrop does not create a persistent download history. Submitted links are sent to YouTube for metadata and to the configured downloader for processing. Those services and the hosting platform have their own logging policies.'
    },
    {
      question: 'What video and audio formats are supported?',
      answer: 'Request MP4 video at the best available quality or resolutions from 144p through 8K, and MP3 audio from 8 to 320 kbps. These are preferences, not guarantees: the provider and original source determine actual quality, container, and size.'
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
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
