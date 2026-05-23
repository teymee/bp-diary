import React from 'react'

export default function Loader() {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center gap-4 px-3 py-4 sm:gap-6 sm:px-4">
      {/* Pulsing heart */}
      <div className="relative flex items-center justify-center">
        {/* Ripple rings */}
        <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-red-400/30 sm:h-20 sm:w-20" />
        <span className="absolute inline-flex h-11 w-11 animate-ping rounded-full bg-red-400/50 [animation-delay:150ms] sm:h-14 sm:w-14" />

        {/* Heart icon */}
        <svg
          viewBox="0 0 24 24"
          className="relative h-10 w-10 animate-[heartbeat_1s_ease-in-out_infinite] drop-shadow-lg sm:h-12 sm:w-12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#e53e3e"
            stroke="#c53030"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* ECG line */}
      <div className="w-full max-w-40 overflow-hidden sm:max-w-48">
        <svg viewBox="0 0 200 40" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="0,20 30,20 40,20 50,5 60,35 70,20 80,20 110,20 120,20 130,5 140,35 150,20 160,20 200,20"
            fill="none"
            stroke="#e53e3e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="[stroke-dasharray:260] [stroke-dashoffset:260] animate-[ecg_1.5s_ease-in-out_infinite]"
          />
        </svg>
      </div>

      <p className="text-xs font-semibold tracking-[0.18em] text-red-600 uppercase dark:text-red-400 sm:text-sm sm:tracking-widest">
        Loading…
      </p>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.25); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.15); }
          70%       { transform: scale(1); }
        }
        @keyframes ecg {
          0%   { stroke-dashoffset: 260; opacity: 1; }
          80%  { stroke-dashoffset: 0;   opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 0; }
        }
      `}</style>
    </div>
  )
}

