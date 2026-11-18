"use client";

import React from "react";

export type EmojiState = "idle" | "email" | "password" | "error" | "loading";

interface GoogleInteractiveEmojiProps {
  state: EmojiState;
  showPassword?: boolean;
  className?: string;
  size?: number;
}

export function GoogleInteractiveEmoji({
  state,
  showPassword = false,
  className = "",
  size = 180,
}: GoogleInteractiveEmojiProps) {
  // Determine speech text and mood
  let moodText = "Hi! Welcome back to InterviewPilot";
  let moodSub = "Click below to sign in";
  let moodBadge = "Google AI Companion";
  let badgeColor = "bg-blue-50 text-blue-700 border-blue-200";

  if (state === "email") {
    moodText = "I'm watching your email!";
    moodSub = "Enter your registered email address";
    moodBadge = "Focused on Email ✉️";
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (state === "password") {
    if (showPassword) {
      moodText = "Ooh, peeking at the password! 🫣";
      moodSub = "Keep your screen safe from shoulder surfers";
      moodBadge = "Peeking Mode 🫣";
      badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
    } else {
      moodText = "No peeking! Your password is safe 🙈";
      moodSub = "Hands over eyes until you're done";
      moodBadge = "Privacy Shield 🙈";
      badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  } else if (state === "error") {
    moodText = "Oops! Something didn't match";
    moodSub = "Please double-check your credentials";
    moodBadge = "Needs Attention ⚠️";
    badgeColor = "bg-red-50 text-red-700 border-red-200";
  } else if (state === "loading") {
    moodText = "Logging you into your dashboard...";
    moodSub = "Connecting with Firebase Auth";
    moodBadge = "Signing In 🚀";
    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Speech / Reaction Bubble */}
      <div className="relative mb-5 max-w-xs transition-all duration-300 ease-out">
        <div className="relative z-10 px-4 py-2.5 rounded-2xl bg-white shadow-md shadow-slate-200/60 border border-slate-100 flex flex-col items-center">
          <span
            className={`inline-block px-2 py-0.5 mb-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${badgeColor}`}
          >
            {moodBadge}
          </span>
          <p className="text-slate-800 text-sm font-bold tracking-tight">
            {moodText}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            {moodSub}
          </p>
        </div>
        {/* Bubble arrow pointing down */}
        <div className="w-3 h-3 bg-white border-r border-b border-slate-100 transform rotate-45 mx-auto -mt-1.5 shadow-xs" />
      </div>

      {/* The Animated Google Emoji SVG */}
      <div
        className="relative transition-transform duration-300 ease-out hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          className="overflow-visible drop-shadow-xl"
        >
          <defs>
            {/* Google Emoji Yellow Face Gradient */}
            <radialGradient
              id="googleEmojiFaceGrad"
              cx="45%"
              cy="35%"
              r="60%"
              fx="40%"
              fy="30%"
            >
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="65%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FFA000" />
            </radialGradient>

            {/* Hand Gradient */}
            <linearGradient id="handGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>

            {/* Blush Gradient */}
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF8A80" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF8A80" stopOpacity="0" />
            </radialGradient>

            {/* Google Accent Halo */}
            <linearGradient id="googleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="33%" stopColor="#EA4335" />
              <stop offset="66%" stopColor="#FBBC04" />
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
          </defs>

          {/* Subtle Google Color Accent Ring around head */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#googleGlow)"
            strokeWidth="3.5"
            strokeDasharray="14 10"
            className="opacity-70 animate-[spin_25s_linear_infinite]"
          />

          {/* Emoji Main Head */}
          <circle
            cx="100"
            cy="100"
            r="76"
            fill="url(#googleEmojiFaceGrad)"
            filter="drop-shadow(0 6px 12px rgba(230, 138, 0, 0.25))"
          />

          {/* Rosy Cheeks */}
          <circle cx="50" cy="118" r="14" fill="url(#blushGrad)" />
          <circle cx="150" cy="118" r="14" fill="url(#blushGrad)" />

          {/* --- EYEBROWS --- */}
          {state === "idle" && (
            <g stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M58 64 Q70 58 82 66" />
              <path d="M118 66 Q130 58 142 64" />
            </g>
          )}

          {state === "email" && (
            <g stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" fill="none">
              {/* Curious, raised eyebrows */}
              <path d="M56 60 Q70 50 84 60" />
              <path d="M116 60 Q130 50 144 60" />
            </g>
          )}

          {state === "password" && (
            <g stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" fill="none">
              {/* Shy curved eyebrows */}
              <path d="M58 66 Q70 60 82 66" />
              <path d="M118 66 Q130 60 142 66" />
            </g>
          )}

          {state === "error" && (
            <g stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" fill="none">
              {/* Confused/worried slanted eyebrows */}
              <path d="M58 60 Q70 68 84 72" />
              <path d="M116 72 Q130 68 142 60" />
            </g>
          )}

          {state === "loading" && (
            <g stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M58 62 Q70 54 82 62" />
              <path d="M118 62 Q130 54 142 62" />
            </g>
          )}

          {/* --- EYES & EXPRESSION --- */}
          {/* 1. IDLE STATE: Friendly Big Eyes */}
          {state === "idle" && (
            <g>
              {/* Left Eye */}
              <circle cx="70" cy="85" r="13" fill="#212121" />
              <circle cx="66" cy="81" r="4.5" fill="#FFFFFF" />
              <circle cx="73" cy="87" r="2" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="130" cy="85" r="13" fill="#212121" />
              <circle cx="126" cy="81" r="4.5" fill="#FFFFFF" />
              <circle cx="133" cy="87" r="2" fill="#FFFFFF" />

              {/* Cheerful Smile */}
              <path
                d="M72 118 Q100 145 128 118"
                fill="#C62828"
                stroke="#6D4C41"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M72 118 Q100 145 128 118 Z"
                fill="#C62828"
              />
              {/* Cute white teeth bar */}
              <path
                d="M80 118 Q100 126 120 118"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* 2. EMAIL STATE: Attentive, Looking Down towards the form */}
          {state === "email" && (
            <g className="transition-all duration-300">
              {/* Left Eye: shifted down and right */}
              <ellipse cx="70" cy="88" rx="14" ry="15" fill="#212121" />
              <ellipse cx="74" cy="94" rx="5" ry="5.5" fill="#FFFFFF" />
              <circle cx="67" cy="86" r="2" fill="#FFFFFF" opacity="0.6" />

              {/* Right Eye: shifted down and right */}
              <ellipse cx="130" cy="88" rx="14" ry="15" fill="#212121" />
              <ellipse cx="134" cy="94" rx="5" ry="5.5" fill="#FFFFFF" />
              <circle cx="127" cy="86" r="2" fill="#FFFFFF" opacity="0.6" />

              {/* Attentive cute focused mouth */}
              <ellipse
                cx="100"
                cy="126"
                rx="9"
                ry="11"
                fill="#C62828"
                stroke="#6D4C41"
                strokeWidth="3"
              />
              <path
                d="M93 121 Q100 124 107 121"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* 3. PASSWORD STATE: Covered Eyes (See-No-Evil) or Peeking */}
          {state === "password" && (
            <g>
              {/* Underlying closed eye lines (happy arcs) */}
              <path
                d="M58 88 Q70 96 82 88"
                fill="none"
                stroke="#6D4C41"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {!showPassword ? (
                <path
                  d="M118 88 Q130 96 142 88"
                  fill="none"
                  stroke="#6D4C41"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ) : (
                /* Peeking right eye! */
                <g>
                  <circle cx="130" cy="85" r="14" fill="#212121" />
                  <circle cx="127" cy="82" r="5" fill="#FFFFFF" />
                  <circle cx="134" cy="88" r="2" fill="#FFFFFF" />
                </g>
              )}

              {/* Shy cute mouth */}
              <path
                d="M82 124 Q100 136 118 124"
                fill="none"
                stroke="#6D4C41"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* HANDS COVERING EYES */}
              {/* Left Hand: always covers left eye */}
              <g
                className="transition-all duration-300"
                transform="translate(44, 68)"
              >
                <ellipse
                  cx="25"
                  cy="20"
                  rx="26"
                  ry="20"
                  fill="url(#handGrad)"
                  stroke="#FF8F00"
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                />
                {/* Finger lines */}
                <path d="M12 12 Q24 20 38 14" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M14 20 Q26 28 40 22" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M16 28 Q28 34 38 30" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>

              {/* Right Hand: covers right eye if hidden, lowers slightly if peeking! */}
              <g
                className="transition-all duration-300"
                transform={showPassword ? "translate(108, 92)" : "translate(108, 68)"}
              >
                <ellipse
                  cx="25"
                  cy="20"
                  rx="26"
                  ry="20"
                  fill="url(#handGrad)"
                  stroke="#FF8F00"
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                />
                {/* Finger lines */}
                <path d="M12 14 Q26 20 38 12" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M10 22 Q24 28 36 20" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M12 30 Q22 34 34 28" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            </g>
          )}

          {/* 4. ERROR STATE: Confused / Sweating */}
          {state === "error" && (
            <g>
              {/* Left Eye: dizzy swirl or squint */}
              <path
                d="M58 84 L82 88 M58 88 L82 84"
                stroke="#212121"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Right Eye: wide and bewildered */}
              <circle cx="130" cy="86" r="14" fill="#212121" />
              <circle cx="126" cy="82" r="5" fill="#FFFFFF" />

              {/* Wobbly wavy mouth */}
              <path
                d="M74 128 Q88 122 100 128 Q112 134 126 128"
                fill="none"
                stroke="#6D4C41"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Sweat drop on forehead */}
              <path
                d="M152 50 C152 40 162 30 162 30 C162 30 172 40 172 50 C172 56 167 61 162 61 C157 61 152 56 152 50 Z"
                fill="#42A5F5"
                filter="drop-shadow(0 2px 4px rgba(66,165,245,0.4))"
              />
            </g>
          )}

          {/* 5. LOADING STATE: Determined / Stars in eyes */}
          {state === "loading" && (
            <g>
              {/* Star Eyes */}
              <polygon
                points="70,72 74,82 85,83 76,90 79,100 70,94 61,100 64,90 55,83 66,82"
                fill="#1A73E8"
              />
              <polygon
                points="130,72 134,82 145,83 136,90 139,100 130,94 121,100 124,90 115,83 126,82"
                fill="#EA4335"
              />

              {/* Enthusiastic open mouth */}
              <ellipse
                cx="100"
                cy="125"
                rx="18"
                ry="14"
                fill="#C62828"
                stroke="#6D4C41"
                strokeWidth="3"
              />
              <path
                d="M86 120 Q100 128 114 120"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Google 4-Color Sparkle on bottom right of emoji */}
          <g transform="translate(142, 142) scale(0.65)">
            <circle cx="20" cy="20" r="18" fill="#FFFFFF" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))" />
            <path d="M20 6 C20 14 20 20 20 20 C20 20 14 20 6 20 C14 20 20 20 20 6 Z" fill="#EA4335" />
            <path d="M20 6 C20 14 20 20 20 20 C20 20 26 20 34 20 C26 20 20 20 20 6 Z" fill="#4285F4" />
            <path d="M20 34 C20 26 20 20 20 20 C20 20 14 20 6 20 C14 20 20 20 20 34 Z" fill="#34A853" />
            <path d="M20 34 C20 26 20 20 20 20 C20 20 26 20 34 20 C26 20 20 20 20 34 Z" fill="#FBBC04" />
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Reactive Mascot: Responds as you type</span>
      </div>
    </div>
  );
}
