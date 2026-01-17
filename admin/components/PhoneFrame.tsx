import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function PhoneFrame({ children, className = '', scale = 1 }: PhoneFrameProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: 280 * scale,
        height: 580 * scale,
      }}
    >
      {/* Phone outer frame */}
      <div
        className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 p-[3px] shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset'
        }}
      >
        {/* Phone inner bezel */}
        <div className="w-full h-full rounded-[2.8rem] bg-black p-2">
          {/* Screen */}
          <div className="w-full h-full rounded-[2.4rem] overflow-hidden bg-[#F5F5F3] relative">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50" />

            {/* Screen content */}
            <div className="w-full h-full pt-12 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
