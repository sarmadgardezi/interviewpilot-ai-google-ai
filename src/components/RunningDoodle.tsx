"use client";

import React from "react";

interface RunningDoodleProps {
  state?: "running" | "idle" | "speaking" | "celebrating";
  className?: string;
}

export function RunningDoodle({ state = "idle", className = "" }: RunningDoodleProps) {
  return (
    <div className={`relative inline-flex items-center gap-2 select-none ${className}`}>
      {/* Running / Floating Android Mascot */}
      <div className={`relative transition-all duration-300 ${state === "running" ? "animate-bounce" : ""}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antennae */}
          <line
            x1="32"
            y1="25"
            x2="22"
            y2="10"
            stroke="#34A853"
            strokeWidth="4"
            strokeLinecap="round"
            className={state === "running" ? "animate-pulse" : ""}
          />
          <line
            x1="68"
            y1="25"
            x2="78"
            y2="10"
            stroke="#34A853"
            strokeWidth="4"
            strokeLinecap="round"
            className={state === "running" ? "animate-pulse" : ""}
          />

          {/* Android Head */}
          <path
            d="M20 45 C20 28, 80 28, 80 45 Z"
            fill="#34A853"
          />

          {/* Android Eyes */}
          <circle cx="38" cy="36" r="4" fill="#FFFFFF" />
          <circle cx="62" cy="36" r="4" fill="#FFFFFF" />
          <circle
            cx={state === "running" ? "40" : "38"}
            cy="36"
            r="2"
            fill="#1E293B"
          />
          <circle
            cx={state === "running" ? "64" : "62"}
            cy="36"
            r="2"
            fill="#1E293B"
          />

          {/* Android Body */}
          <rect
            x="20"
            y="49"
            width="60"
            height="32"
            rx="8"
            fill="#34A853"
          />

          {/* Decorative Google colored scarf / emblem */}
          <circle cx="50" cy="58" r="5" fill="#4285F4" />
          <circle cx="43" cy="66" r="3" fill="#EA4335" />
          <circle cx="57" cy="66" r="3" fill="#FBBC05" />

          {/* Left Arm */}
          <rect
            x="10"
            y="50"
            width="6"
            height="22"
            rx="3"
            fill="#34A853"
            className={state === "running" ? "animate-pulse origin-top -rotate-12" : ""}
          />

          {/* Right Arm */}
          <rect
            x="84"
            y="50"
            width="6"
            height="22"
            rx="3"
            fill="#34A853"
            className={state === "running" ? "animate-pulse origin-top rotate-12" : ""}
          />

          {/* Left Leg */}
          <rect
            x="32"
            y="82"
            width="8"
            height="14"
            rx="4"
            fill="#34A853"
            className={state === "running" ? "origin-top -rotate-24" : ""}
          />

          {/* Right Leg */}
          <rect
            x="60"
            y="82"
            width="8"
            height="14"
            rx="4"
            fill="#34A853"
            className={state === "running" ? "origin-top rotate-24" : ""}
          />
        </svg>

        {/* Running dust / spark particles when running */}
        {state === "running" && (
          <div className="absolute -bottom-1 -left-2 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span className="w-1 h-1 rounded-full bg-yellow-400 animate-ping delay-75" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping delay-150" />
          </div>
        )}
      </div>

      {/* Floating status tag */}
      {state === "running" && (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold tracking-wide animate-pulse border border-blue-200">
          Scouting &amp; Typing Words...
        </span>
      )}
      {state === "speaking" && (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide animate-pulse border border-emerald-200 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Speaking aloud...</span>
        </span>
      )}
    </div>
  );
}
