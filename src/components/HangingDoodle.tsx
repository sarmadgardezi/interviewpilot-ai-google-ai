"use client";

import React from "react";

interface HangingDoodleProps {
  mood?: "happy" | "peeking" | "cheering" | "thinking";
  character?: "android" | "sparky" | "gemini";
  className?: string;
}

export function HangingDoodle({
  mood = "peeking",
  character = "android",
  className = "",
}: HangingDoodleProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Hanging Android Bugdroid Doodle */}
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 160 90"
          width="130"
          height="75"
          className="overflow-visible drop-shadow-md"
        >
          <defs>
            <linearGradient id="androidGreenHanging" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4AE389" />
              <stop offset="100%" stopColor="#2BB865" />
            </linearGradient>

            <filter id="handGripShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Antennas */}
          <line
            x1="58"
            y1="32"
            x2="46"
            y2="10"
            stroke="#2BB865"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="102"
            y1="32"
            x2="114"
            y2="10"
            stroke="#2BB865"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Android Dome Head */}
          <path
            d="M 40 70 A 40 40 0 0 1 120 70 Z"
            fill="url(#androidGreenHanging)"
            stroke="#239B56"
            strokeWidth="1.5"
          />

          {/* Expressive Eyes */}
          {mood === "thinking" ? (
            <g>
              <ellipse cx="64" cy="46" rx="5" ry="3" fill="#212121" />
              <ellipse cx="96" cy="46" rx="5" ry="3" fill="#212121" />
            </g>
          ) : (
            <g>
              <circle cx="64" cy="48" r="5" fill="#212121" />
              <circle cx="62" cy="46" r="1.8" fill="#FFFFFF" />
              <circle cx="96" cy="48" r="5" fill="#212121" />
              <circle cx="94" cy="46" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Two Little Hands Gripping the Top Bar */}
          {/* Left Hand */}
          <g filter="url(#handGripShadow)">
            <ellipse
              cx="44"
              cy="74"
              rx="9"
              ry="7"
              fill="url(#androidGreenHanging)"
              stroke="#239B56"
              strokeWidth="1"
            />
            <path
              d="M 37 76 Q 44 80 51 76"
              stroke="#1D8348"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Right Hand */}
          <g filter="url(#handGripShadow)">
            <ellipse
              cx="116"
              cy="74"
              rx="9"
              ry="7"
              fill="url(#androidGreenHanging)"
              stroke="#239B56"
              strokeWidth="1"
            />
            <path
              d="M 109 76 Q 116 80 123 76"
              stroke="#1D8348"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
