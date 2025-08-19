/* Ensure you had installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest */

import React from 'react';
import { cn } from '../../lib/utils'; // Adjust path if needed
import { CountUp } from './count-up';

type TrustedUsersProps = {
  avatars: string[];
  rating?: number;
  totalUsersText?: number;
  caption?: string;
  className?: string;
  starColorClass?: string;
  ringColors?: string[];
  starSize?: string;
  numberSize?: string;
  textSize?: string;
  restartTrigger?: number; // Prop per forzare il restart del count
};

export const TrustedUsers: React.FC<TrustedUsersProps> = ({
  avatars,
  rating = 5,
  totalUsersText = 1000, // ✅ default as number
  caption = 'Trusted by',
  className = '',
  starColorClass = 'text-yellow-400',
  ringColors = [],
  starSize = '1.25rem', // 20px default
  numberSize = '2rem', // 32px default
  textSize = '0.875rem', // 14px default
  restartTrigger = 0,
}) => {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center gap-3 bg-transparent
          text-foreground py-4 px-4`,
        className,
      )}
    >
      {/* Avatars - only show if provided */}
      {avatars.length > 0 && (
        <div className="flex -space-x-4 justify-center">
          {avatars.map((src, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full overflow-hidden ring-1 ring-offset-2 ring-offset-black ${
                ringColors[i] || 'ring-blue-900'
              }`}
            >
              <img
                src={src}
                alt={`Avatar ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy" // Add lazy loading
                decoding="async" // Suggest asynchronous decoding
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {/* Stars - centered */}
        <div className={`flex gap-1 justify-center ${starColorClass}`}>
          {Array.from({ length: rating }).map((_, i) => (
            <svg
              key={i}
              fill="currentColor"
              style={{ width: starSize, height: starSize }}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Count and text - centered */}
        <div className="text-foreground text-center font-medium">
          <div className="flex items-center justify-center gap-1">
            <span style={{ fontSize: textSize }}>{caption}</span>
            <CountUp
              value={totalUsersText}
              duration={2}
              separator=","
              className="font-bold"
              style={{
                fontSize: numberSize,
                background: 'linear-gradient(135deg, #1a1a1a 0%, #f97316 50%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              suffix="+"
              colorScheme="default"
              restartTrigger={restartTrigger}
            />
            <span style={{ fontSize: textSize }}>clients</span>
          </div>
        </div>
      </div>
    </div>
  );
};
