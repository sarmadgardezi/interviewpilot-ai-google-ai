"use client";

import React from "react";

export interface GeminiDoodleProps {
  /** Current active field or state */
  focusedField: "email" | "password" | null;
  /** Whether the email is invalid/wrong */
  isEmailWrong?: boolean;
  /** Whether the password is being revealed */
  isPasswordRevealed?: boolean;
  /** Whether the form is submitting */
  isLoading?: boolean;
  /** Overall size in pixels */
  size?: number;
  className?: string;
}

export function GeminiDoodle({
  focusedField,
  isEmailWrong = false,
  isPasswordRevealed = false,
  isLoading = false,
  size = 320,
  className = "",
}: GeminiDoodleProps) {
  // Determine dominant mood
  const isAngry = isEmailWrong;
  const isCoveringEyes = focusedField === "password" || isPasswordRevealed;
  const isLookingAtEmail = focusedField === "email" && !isAngry;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Soft Glow */}
      <div
        className={`absolute inset-4 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
          isAngry
            ? "bg-red-500/25 scale-110"
            : isCoveringEyes
            ? "bg-purple-500/20 scale-105"
            : "bg-blue-500/15 scale-100"
        }`}
      />

      {/* Main Doodle SVG */}
      <svg
        viewBox="0 0 320 320"
        width="100%"
        height="100%"
        className={`overflow-visible transition-transform duration-300 ease-out ${
          isAngry
            ? "animate-[wiggle_0.4s_ease-in-out_infinite]"
            : isLoading
            ? "animate-pulse"
            : "hover:scale-105 transition-transform"
        }`}
      >
        <defs>
          {/* Main 4-Point Gemini Star Gradients */}
          {/* 1. Normal Gemini Gradient: Top Red, Right Blue, Bottom Green, Left Yellow */}
          <linearGradient id="geminiNormalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4B4B" />
            <stop offset="35%" stopColor="#FF6B4A" />
            <stop offset="55%" stopColor="#1E88E5" />
            <stop offset="80%" stopColor="#00C853" />
            <stop offset="100%" stopColor="#FFD600" />
          </linearGradient>

          {/* Radial color overlays to match exact Gemini star colors */}
          {/* Top Red Glow */}
          <radialGradient id="geminiRedTop" cx="50%" cy="10%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" />
            <stop offset="60%" stopColor="#FF5252" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
          </radialGradient>

          {/* Right Blue Glow */}
          <radialGradient id="geminiBlueRight" cx="90%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#007BFF" />
            <stop offset="60%" stopColor="#1E88E5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E88E5" stopOpacity="0" />
          </radialGradient>

          {/* Bottom Green Glow */}
          <radialGradient id="geminiGreenBottom" cx="50%" cy="90%" r="50%">
            <stop offset="0%" stopColor="#00E676" />
            <stop offset="60%" stopColor="#00C853" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </radialGradient>

          {/* Left Yellow Glow */}
          <radialGradient id="geminiYellowLeft" cx="10%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFEA00" />
            <stop offset="60%" stopColor="#FFC400" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFC400" stopOpacity="0" />
          </radialGradient>

          {/* 2. Angry State Flaming Gradient */}
          <linearGradient id="geminiAngryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D50000" />
            <stop offset="40%" stopColor="#FF1744" />
            <stop offset="70%" stopColor="#FF5252" />
            <stop offset="100%" stopColor="#FF6D00" />
          </linearGradient>

          {/* 3D Soft Lighting Overlay */}
          <radialGradient id="gemini3DLight" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </radialGradient>

          {/* Hand Gradient */}
          <linearGradient id="doodleHandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Soft Drop Shadow for Hands */}
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
          </filter>

          {/* Star Body Shadow */}
          <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* GEMINI 4-POINT STAR BODY                                  */}
        {/* Center: (160, 160)                                       */}
        {/* Top: (160, 24)  Right: (296, 160)                         */}
        {/* Bottom: (160, 296) Left: (24, 160)                       */}
        {/* ======================================================== */}
        <g filter="url(#starShadow)">
          {/* Base Star Shape */}
          <path
            d="
              M 152 30
              C 156 22, 164 22, 168 30
              C 172 118, 202 148, 290 152
              C 298 156, 298 164, 290 168
              C 202 172, 172 202, 168 290
              C 164 298, 156 298, 152 290
              C 148 202, 118 172, 30 168
              C 22 164, 22 156, 30 152
              C 118 148, 148 118, 152 30
              Z
            "
            fill={isAngry ? "url(#geminiAngryGrad)" : "url(#geminiNormalGrad)"}
          />

          {/* Multi-color Radial Overlays (Only in normal/non-angry mode) */}
          {!isAngry && (
            <>
              {/* Top Red Arm Overlay */}
              <path
                d="
                  M 152 30
                  C 156 22, 164 22, 168 30
                  C 172 118, 202 148, 290 152
                  C 298 156, 298 164, 290 168
                  C 202 172, 172 202, 168 290
                  C 164 298, 156 298, 152 290
                  C 148 202, 118 172, 30 168
                  C 22 164, 22 156, 30 152
                  C 118 148, 148 118, 152 30
                  Z
                "
                fill="url(#geminiRedTop)"
              />
              {/* Right Blue Arm Overlay */}
              <path
                d="
                  M 152 30
                  C 156 22, 164 22, 168 30
                  C 172 118, 202 148, 290 152
                  C 298 156, 298 164, 290 168
                  C 202 172, 172 202, 168 290
                  C 164 298, 156 298, 152 290
                  C 148 202, 118 172, 30 168
                  C 22 164, 22 156, 30 152
                  C 118 148, 148 118, 152 30
                  Z
                "
                fill="url(#geminiBlueRight)"
              />
              {/* Bottom Green Arm Overlay */}
              <path
                d="
                  M 152 30
                  C 156 22, 164 22, 168 30
                  C 172 118, 202 148, 290 152
                  C 298 156, 298 164, 290 168
                  C 202 172, 172 202, 168 290
                  C 164 298, 156 298, 152 290
                  C 148 202, 118 172, 30 168
                  C 22 164, 22 156, 30 152
                  C 118 148, 148 118, 152 30
                  Z
                "
                fill="url(#geminiGreenBottom)"
              />
              {/* Left Yellow Arm Overlay */}
              <path
                d="
                  M 152 30
                  C 156 22, 164 22, 168 30
                  C 172 118, 202 148, 290 152
                  C 298 156, 298 164, 290 168
                  C 202 172, 172 202, 168 290
                  C 164 298, 156 298, 152 290
                  C 148 202, 118 172, 30 168
                  C 22 164, 22 156, 30 152
                  C 118 148, 148 118, 152 30
                  Z
                "
                fill="url(#geminiYellowLeft)"
              />
            </>
          )}

          {/* 3D Glossy Light Reflection */}
          <path
            d="
              M 152 30
              C 156 22, 164 22, 168 30
              C 172 118, 202 148, 290 152
              C 298 156, 298 164, 290 168
              C 202 172, 172 202, 168 290
              C 164 298, 156 298, 152 290
              C 148 202, 118 172, 30 168
              C 22 164, 22 156, 30 152
              C 118 148, 148 118, 152 30
              Z
            "
            fill="url(#gemini3DLight)"
          />
        </g>

        {/* ======================================================== */}
        {/* DOODLE FACE (Centered in the Star)                        */}
        {/* Center of face: (160, 160)                               */}
        {/* ======================================================== */}

        {/* 1. ANGRY STATE: On Wrong/Invalid Email */}
        {isAngry && (
          <g className="transition-all duration-300">
            {/* Angry Eyebrows (Sharply slanted) */}
            <path
              d="M 120 136 L 148 148"
              stroke="#212121"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 200 136 L 172 148"
              stroke="#212121"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Angry Eyes (> < style doodle or fierce round eyes) */}
            <g stroke="#212121" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 124 148 L 142 158 L 124 168" />
              <path d="M 196 148 L 178 158 L 196 168" />
            </g>

            {/* Angry Grumpy Mouth */}
            <path
              d="M 142 192 Q 160 178 178 192"
              fill="none"
              stroke="#212121"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Anime Anger Vein Mark 💢 on top-left of the star */}
            <g transform="translate(100, 75) scale(0.9)">
              <path
                d="M 6 0 L 26 0 M 16 -10 L 16 10 M 0 16 L 20 16 M 10 6 L 10 26"
                stroke="#FFEB3B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 6 0 L 26 0 M 16 -10 L 16 10 M 0 16 L 20 16 M 10 6 L 10 26"
                stroke="#D50000"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Steam puffs from ears */}
            <circle cx="85" cy="130" r="5" fill="#FFFFFF" opacity="0.75" />
            <circle cx="75" cy="120" r="7" fill="#FFFFFF" opacity="0.6" />
            <circle cx="235" cy="130" r="5" fill="#FFFFFF" opacity="0.75" />
            <circle cx="245" cy="120" r="7" fill="#FFFFFF" opacity="0.6" />
          </g>
        )}

        {/* 2. PASSWORD REVEAL / PASSWORD FOCUS: HANDS OVER EYES */}
        {!isAngry && isCoveringEyes && (
          <g className="transition-all duration-300">
            {/* Blushing Cheeks */}
            <circle cx="112" cy="174" r="12" fill="#FF5252" opacity="0.4" />
            <circle cx="208" cy="174" r="12" fill="#FF5252" opacity="0.4" />

            {/* Shy/Happy Smiling Closed Eye Arcs underneath */}
            <path
              d="M 124 154 Q 138 162 150 154"
              fill="none"
              stroke="#212121"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 170 154 Q 182 162 196 154"
              fill="none"
              stroke="#212121"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Shy Cute Mouth */}
            <path
              d="M 148 186 Q 160 196 172 186"
              fill="none"
              stroke="#212121"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* --- DOODLE HANDS COVERING EYES --- */}
            {/* Left Hand firmly over left eye */}
            <g
              filter="url(#handShadow)"
              className="transition-transform duration-300"
              transform={
                isPasswordRevealed
                  ? "translate(104, 134) scale(1.08)"
                  : "translate(106, 138)"
              }
            >
              {/* Palm / Glove */}
              <ellipse
                cx="24"
                cy="18"
                rx="24"
                ry="19"
                fill="url(#doodleHandGrad)"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              {/* Cute little doodle fingers */}
              <circle cx="10" cy="10" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="19" cy="6" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="29" cy="6" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="37" cy="10" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            </g>

            {/* Right Hand firmly over right eye */}
            <g
              filter="url(#handShadow)"
              className="transition-transform duration-300"
              transform={
                isPasswordRevealed
                  ? "translate(164, 134) scale(1.08)"
                  : "translate(162, 138)"
              }
            >
              {/* Palm / Glove */}
              <ellipse
                cx="24"
                cy="18"
                rx="24"
                ry="19"
                fill="url(#doodleHandGrad)"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              {/* Cute little doodle fingers */}
              <circle cx="10" cy="10" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="19" cy="6" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="29" cy="6" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="37" cy="10" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* 3. EMAIL FOCUSED: Eyes Looking Down & Right toward Form */}
        {!isAngry && !isCoveringEyes && isLookingAtEmail && (
          <g className="transition-all duration-300">
            {/* Curious Raised Eyebrows */}
            <path
              d="M 124 134 Q 138 126 150 134"
              fill="none"
              stroke="#212121"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 170 134 Q 182 126 196 134"
              fill="none"
              stroke="#212121"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Left Eye: Looking down and right */}
            <circle cx="138" cy="154" r="14" fill="#212121" />
            <circle cx="143" cy="159" r="5" fill="#FFFFFF" />
            <circle cx="134" cy="151" r="2.5" fill="#FFFFFF" opacity="0.6" />

            {/* Right Eye: Looking down and right */}
            <circle cx="182" cy="154" r="14" fill="#212121" />
            <circle cx="187" cy="159" r="5" fill="#FFFFFF" />
            <circle cx="178" cy="151" r="2.5" fill="#FFFFFF" opacity="0.6" />

            {/* Cute Curious Focused "O" Mouth */}
            <ellipse
              cx="160"
              cy="185"
              rx="7"
              ry="9"
              fill="#212121"
            />
          </g>
        )}

        {/* 4. IDLE STATE: Cheerful, Friendly Big Sparkle Eyes & Smile */}
        {!isAngry && !isCoveringEyes && !isLookingAtEmail && (
          <g className="transition-all duration-300">
            {/* Friendly Eyebrows */}
            <path
              d="M 124 136 Q 138 130 148 136"
              fill="none"
              stroke="#212121"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 172 136 Q 182 130 196 136"
              fill="none"
              stroke="#212121"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Left Eye */}
            <circle cx="136" cy="152" r="13" fill="#212121" />
            <circle cx="132" cy="148" r="4.5" fill="#FFFFFF" />
            <circle cx="139" cy="155" r="2" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="184" cy="152" r="13" fill="#212121" />
            <circle cx="180" cy="148" r="4.5" fill="#FFFFFF" />
            <circle cx="187" cy="155" r="2" fill="#FFFFFF" />

            {/* Rosy Cheeks */}
            <circle cx="114" cy="166" r="9" fill="#FF5252" opacity="0.3" />
            <circle cx="206" cy="166" r="9" fill="#FF5252" opacity="0.3" />

            {/* Cheerful Smile */}
            <path
              d="M 144 178 Q 160 196 176 178"
              fill="#C62828"
              stroke="#212121"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 144 178 Q 160 196 176 178 Z"
              fill="#C62828"
            />
            {/* Tongue */}
            <path
              d="M 152 186 Q 160 182 168 186 Q 160 195 152 186 Z"
              fill="#FF8A80"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
