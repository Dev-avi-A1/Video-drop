import React, { useState, useEffect } from 'react';
import { Film, Play } from 'lucide-react';
import { formatDuration } from '../utils/formatters.js';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  duration: number;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  duration
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [thumbnail]);

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md group">
      {!hasError ? (
        <>
          <img
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
              <Film className="w-8 h-8 text-slate-600" />
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-center">
          <Film className="w-10 h-10 text-slate-500 mb-2" />
          <span className="text-xs text-slate-400 font-medium line-clamp-2 px-2">
            {title}
          </span>
        </div>
      )}

      {/* Play icon overlay on hover */}
      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <Play className="w-5 h-5 ml-0.5 fill-current" />
        </div>
      </div>

      {/* Duration stamp in bottom-right corner */}
      {duration > 0 && (
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-white text-xs font-mono font-medium tracking-tight shadow">
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
};
