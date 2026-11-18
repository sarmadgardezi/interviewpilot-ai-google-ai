"use client";

import React from "react";

export interface GoogleMascotsDoodleProps {
  focusedField?: "email" | "password" | null;
  isEmailWrong?: boolean;
  isPasswordRevealed?: boolean;
  isLoading?: boolean;
  size?: number;
  className?: string;
}

export function GoogleMascotsDoodle({
  focusedField = null,
  isEmailWrong = false,
  isPasswordRevealed = false,
  isLoading = false,
  size = 400,
  className = "",
}: GoogleMascotsDoodleProps) {
  const isAngry = isEmailWrong;
  const isCoveringEyes = focusedField === "password" || isPasswordRevealed;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: "100%", maxWidth: size }}
    >
      <style jsx>{`
        @keyframes doodleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(0.8deg);
          }
        }
        @keyframes ballBounce {
          0%, 100% {
            transform: translateY(0px) scale(1, 1);
            animation-timing-function: cubic-bezier(0.3, 0, 0.7, 0.3);
          }
          45% {
            transform: translateY(-55px) scale(0.95, 1.08);
            animation-timing-function: cubic-bezier(0.3, 0.7, 0.7, 1);
          }
          85% {
            transform: translateY(0px) scale(1.18, 0.82);
          }
          92% {
            transform: translateY(-6px) scale(0.98, 1.02);
          }
        }
        @keyframes ballShadow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          45% {
            transform: scale(0.4);
            opacity: 0.12;
          }
          85% {
            transform: scale(1.25);
            opacity: 0.45;
          }
        }
        @keyframes sparkyTalk {
          0%, 100% {
            transform: scaleY(0.75);
          }
          50% {
            transform: scaleY(1.35);
          }
        }
        @keyframes sparkyBob {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-3px) rotate(-1.5deg);
          }
        }
        @keyframes dashWingFlap {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-14deg);
          }
        }
        @keyframes legKick {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(12deg);
          }
        }
        @keyframes bugdroidPeek {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          50% {
            transform: translate(-2px, -4px) rotate(-2deg);
          }
        }
      `}</style>

      {/* SVG Doodle Canvas */}
      <svg
        viewBox="0 0 400 420"
        width="100%"
        height="100%"
        className="overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Gemini Star Gradients */}
          <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4B4B" />
            <stop offset="35%" stopColor="#FF7A45" />
            <stop offset="55%" stopColor="#1E88E5" />
            <stop offset="80%" stopColor="#00C853" />
            <stop offset="100%" stopColor="#FFD600" />
          </linearGradient>

          <radialGradient id="geminiRedGlow" cx="50%" cy="10%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" />
            <stop offset="70%" stopColor="#FF5252" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="geminiBlueGlow" cx="90%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#007BFF" />
            <stop offset="70%" stopColor="#1E88E5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E88E5" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="geminiGreenGlow" cx="50%" cy="90%" r="50%">
            <stop offset="0%" stopColor="#00E676" />
            <stop offset="70%" stopColor="#00C853" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="geminiYellowGlow" cx="10%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFEA00" />
            <stop offset="70%" stopColor="#FFC400" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFC400" stopOpacity="0" />
          </radialGradient>

          {/* Angry Flaming Star Gradient */}
          <linearGradient id="angryGeminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D50000" />
            <stop offset="50%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#FF6D00" />
          </linearGradient>

          {/* 3D Surface Light */}
          <radialGradient id="specularLight" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </radialGradient>

          {/* Sparky Flame Mascot Gradient */}
          <radialGradient id="sparkyGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="60%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FFA000" />
          </radialGradient>

          {/* Dash Body Gradient */}
          <radialGradient id="dashBodyGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#81D4FA" />
            <stop offset="70%" stopColor="#29B6F6" />
            <stop offset="100%" stopColor="#0288D1" />
          </radialGradient>

          {/* Android Green Gradient */}
          <linearGradient id="androidGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#55E795" />
            <stop offset="100%" stopColor="#2EBD6E" />
          </linearGradient>

          {/* Red Stage Platform Gradient */}
          <linearGradient id="redFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="25%" stopColor="#EA4335" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>

          {/* Bouncing Ball Gradient (Multi-colored Google Spherical) */}
          <radialGradient id="ballGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#4285F4" />
            <stop offset="70%" stopColor="#1967D2" />
            <stop offset="100%" stopColor="#0D47A1" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="doodleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.18" />
          </filter>

          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* 1. ANDROID BUGDROID (Top-Right, peeking behind star)       */}
        {/* ======================================================== */}
        <g
          style={{
            animation: "bugdroidPeek 4s ease-in-out infinite",
            transformOrigin: "310px 100px",
          }}
        >
          {/* Left Antenna */}
          <line
            x1="285"
            y1="56"
            x2="276"
            y2="34"
            stroke="#2EBD6E"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Right Antenna */}
          <line
            x1="335"
            y1="56"
            x2="346"
            y2="34"
            stroke="#2EBD6E"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Android Dome Head */}
          <path
            d="M 270 95 A 42 42 0 0 1 354 95 Z"
            fill="url(#androidGreenGrad)"
            stroke="#239B56"
            strokeWidth="1.5"
          />

          {/* Eyes */}
          <circle cx="295" cy="74" r="5" fill="#212121" />
          <circle cx="330" cy="78" r="5" fill="#212121" />

          {/* Body peering from behind star */}
          <rect
            x="272"
            y="98"
            width="80"
            height="85"
            rx="20"
            fill="url(#androidGreenGrad)"
          />

          {/* Android Arm hugging the right side of the star */}
          <path
            d="M 338 120 C 330 148, 292 166, 275 160 C 268 158, 272 144, 282 144 C 302 144, 322 134, 326 116 Z"
            fill="url(#androidGreenGrad)"
            stroke="#239B56"
            strokeWidth="1"
          />
        </g>

        {/* ======================================================== */}
        {/* 2. GEMINI 4-POINT STAR (Center)                           */}
        {/* Floating animation                                        */}
        {/* Center: (205, 175)                                       */}
        {/* ======================================================== */}
        <g
          filter="url(#doodleShadow)"
          style={{
            animation: isAngry ? "none" : "doodleFloat 4.5s ease-in-out infinite",
            transformOrigin: "205px 175px",
          }}
        >
          {/* Star Shape */}
          <path
            d="
              M 205 38
              C 208 32, 214 32, 217 38
              C 220 128, 248 156, 332 160
              C 338 163, 338 169, 332 172
              C 248 176, 220 204, 217 294
              C 214 300, 208 300, 205 294
              C 202 204, 174 176, 90 172
              C 84 169, 84 163, 90 160
              C 174 156, 202 128, 205 38
              Z
            "
            fill={isAngry ? "url(#angryGeminiGrad)" : "url(#geminiGrad)"}
          />

          {!isAngry && (
            <>
              {/* Top Red Glow */}
              <path
                d="
                  M 205 38
                  C 208 32, 214 32, 217 38
                  C 220 128, 248 156, 332 160
                  C 338 163, 338 169, 332 172
                  C 248 176, 220 204, 217 294
                  C 214 300, 208 300, 205 294
                  C 202 204, 174 176, 90 172
                  C 84 169, 84 163, 90 160
                  C 174 156, 202 128, 205 38
                  Z
                "
                fill="url(#geminiRedGlow)"
              />
              {/* Right Blue Glow */}
              <path
                d="
                  M 205 38
                  C 208 32, 214 32, 217 38
                  C 220 128, 248 156, 332 160
                  C 338 163, 338 169, 332 172
                  C 248 176, 220 204, 217 294
                  C 214 300, 208 300, 205 294
                  C 202 204, 174 176, 90 172
                  C 84 169, 84 163, 90 160
                  C 174 156, 202 128, 205 38
                  Z
                "
                fill="url(#geminiBlueGlow)"
              />
              {/* Bottom Green Glow */}
              <path
                d="
                  M 205 38
                  C 208 32, 214 32, 217 38
                  C 220 128, 248 156, 332 160
                  C 338 163, 338 169, 332 172
                  C 248 176, 220 204, 217 294
                  C 214 300, 208 300, 205 294
                  C 202 204, 174 176, 90 172
                  C 84 169, 84 163, 90 160
                  C 174 156, 202 128, 205 38
                  Z
                "
                fill="url(#geminiGreenGlow)"
              />
              {/* Left Yellow Glow */}
              <path
                d="
                  M 205 38
                  C 208 32, 214 32, 217 38
                  C 220 128, 248 156, 332 160
                  C 338 163, 338 169, 332 172
                  C 248 176, 220 204, 217 294
                  C 214 300, 208 300, 205 294
                  C 202 204, 174 176, 90 172
                  C 84 169, 84 163, 90 160
                  C 174 156, 202 128, 205 38
                  Z
                "
                fill="url(#geminiYellowGlow)"
              />
            </>
          )}

          {/* 3D Glossy Light Reflection */}
          <path
            d="
              M 205 38
              C 208 32, 214 32, 217 38
              C 220 128, 248 156, 332 160
              C 338 163, 338 169, 332 172
              C 248 176, 220 204, 217 294
              C 214 300, 208 300, 205 294
              C 202 204, 174 176, 90 172
              C 84 169, 84 163, 90 160
              C 174 156, 202 128, 205 38
              Z
            "
            fill="url(#specularLight)"
          />

          {/* Eyes on Gemini Star when in password/angry state */}
          {isAngry && (
            <g transform="translate(180, 140)">
              {/* Angry Eyes */}
              <path d="M 12 12 L 28 22 L 12 30" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 46 12 L 30 22 L 46 30" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Anger vein 💢 */}
              <path d="M 60 -10 L 72 -10 M 66 -16 L 66 -4 M 56 0 L 68 0 M 62 -6 L 62 6" stroke="#FFEB3B" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {isCoveringEyes && !isAngry && (
            <g transform="translate(180, 145)">
              {/* Shy closed eyes under hands */}
              <path d="M 12 18 Q 24 24 34 18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 44 18 Q 54 24 64 18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Hands covering star eyes */}
              <g filter="url(#handShadow)">
                <ellipse cx="24" cy="18" rx="15" ry="12" fill="#FFFFFF" />
                <ellipse cx="54" cy="18" rx="15" ry="12" fill="#FFFFFF" />
              </g>
            </g>
          )}
        </g>

        {/* ======================================================== */}
        {/* 3. FLUTTER DASH BIRD (Bottom-Right)                       */}
        {/* Stands beside the red floor                               */}
        {/* ======================================================== */}
        <g id="dash-bird" transform="translate(230, 205)">
          {/* Orange Bird Feet on the stage */}
          <path
            d="M 46 142 L 38 152 M 46 142 L 46 154 M 46 142 L 54 152"
            stroke="#FF6D00"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 80 142 L 72 152 M 80 142 L 80 154 M 80 142 L 88 152"
            stroke="#FF6D00"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Left Wing (Waving / Flapping) */}
          <path
            d="M 15 75 C -4 60, -8 40, 6 42 C 18 44, 25 65, 28 85 Z"
            fill="#40C4FF"
            stroke="#0288D1"
            strokeWidth="1.5"
            style={{
              animation: "dashWingFlap 1.8s ease-in-out infinite",
              transformOrigin: "25px 80px",
            }}
          />

          {/* Right Wing (Raised High Joyfully) */}
          <path
            d="M 100 85 C 118 70, 136 60, 138 75 C 140 88, 120 102, 102 98 Z"
            fill="#40C4FF"
            stroke="#0288D1"
            strokeWidth="1.5"
            style={{
              animation: "dashWingFlap 1.8s ease-in-out infinite reverse",
              transformOrigin: "105px 90px",
            }}
          />

          {/* Head Tuft (Darker Blue) */}
          <circle cx="86" cy="15" r="13" fill="#0288D1" />
          <circle cx="94" cy="22" r="10" fill="#0288D1" />

          {/* Dash Main Body */}
          <ellipse
            cx="66"
            cy="78"
            rx="48"
            ry="54"
            fill="url(#dashBodyGrad)"
            stroke="#0288D1"
            strokeWidth="2"
          />

          {/* White Belly */}
          <ellipse
            cx="66"
            cy="92"
            rx="32"
            ry="30"
            fill="#F5F5F5"
          />

          {/* Big Cartoon Eyes */}
          {/* Left Eye */}
          <ellipse cx="48" cy="56" rx="13" ry="16" fill="#212121" />
          <ellipse cx="44" cy="50" rx="5" ry="6.5" fill="#FFFFFF" />
          <circle cx="50" cy="62" r="2.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="84" cy="56" rx="13" ry="16" fill="#212121" />
          <ellipse cx="80" cy="50" rx="5" ry="6.5" fill="#FFFFFF" />
          <circle cx="86" cy="62" r="2.5" fill="#FFFFFF" />

          {/* Cute Orange Beak (Happy Open Smile) */}
          <path
            d="M 54 68 Q 66 60 78 68 Q 66 90 54 68 Z"
            fill="#FF8F00"
            stroke="#E65100"
            strokeWidth="2"
          />
          {/* Open Mouth Tongue */}
          <path
            d="M 58 71 Q 66 84 74 71 Z"
            fill="#D84315"
          />
          <path
            d="M 62 76 Q 66 79 70 76"
            stroke="#FFAB91"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* ======================================================== */}
        {/* 4. RED STAGE / FLOOR (At the bottom)                      */}
        {/* Smooth pill platform like in the image                    */}
        {/* ======================================================== */}
        <g id="red-floor">
          {/* Shadow below stage */}
          <rect
            x="8"
            y="358"
            width="384"
            height="44"
            rx="22"
            fill="#000000"
            opacity="0.08"
          />
          {/* Stage Platform */}
          <rect
            x="10"
            y="350"
            width="380"
            height="50"
            rx="25"
            fill="url(#redFloorGrad)"
          />
          {/* Stage 3D Top Highlight Bar */}
          <rect
            x="20"
            y="352"
            width="360"
            height="5"
            rx="2.5"
            fill="#FF8A80"
            opacity="0.65"
          />
        </g>

        {/* ======================================================== */}
        {/* 5. YELLOW FLAME MASCOT (Firebase Sparky)                  */}
        {/* Sitting on the red floor, legs dangling, animated talking */}
        {/* ======================================================== */}
        <g id="sparky-flame" transform="translate(68, 205)">
          {/* Dangling Legs over the red floor */}
          {/* Left Leg */}
          <g style={{ animation: "legKick 2.4s ease-in-out infinite", transformOrigin: "42px 148px" }}>
            <path
              d="M 42 144 C 44 158, 48 168, 58 170"
              stroke="#6D4C41"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Little foot */}
            <ellipse cx="62" cy="170" rx="6" ry="4" fill="#6D4C41" />
          </g>

          {/* Right Leg */}
          <g style={{ animation: "legKick 2.4s ease-in-out infinite 0.6s", transformOrigin: "68px 148px" }}>
            <path
              d="M 68 144 C 70 158, 80 168, 92 168"
              stroke="#6D4C41"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Little foot */}
            <ellipse cx="96" cy="167" rx="6" ry="4" fill="#6D4C41" />
          </g>

          {/* Sparky Body: Cute Flame Character */}
          <g
            style={{
              animation: "sparkyBob 3s ease-in-out infinite",
              transformOrigin: "55px 140px",
            }}
          >
            {/* Fire Drop Silhouette */}
            <path
              d="
                M 56 4
                C 56 4, 30 28, 14 62
                C -2 96, 6 138, 42 148
                C 78 156, 108 132, 108 94
                C 108 62, 88 40, 78 30
                C 80 44, 72 48, 64 42
                C 68 32, 70 16, 56 4
                Z
              "
              fill="url(#sparkyGrad)"
              stroke="#FFA000"
              strokeWidth="2"
            />

            {/* Left Top Flame Flickers */}
            <path
              d="M 16 64 C 10 52, 18 38, 24 36 C 20 46, 26 52, 22 62 Z"
              fill="#FFD54F"
            />

            {/* Rosy Cheeks */}
            <circle cx="28" cy="104" r="8" fill="#FF8A80" opacity="0.55" />
            <circle cx="86" cy="98" r="8" fill="#FF8A80" opacity="0.55" />

            {/* Eyebrows */}
            <path
              d="M 34 76 Q 44 70 52 76"
              stroke="#6D4C41"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 64 74 Q 74 68 82 74"
              stroke="#6D4C41"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Big Expressive Doodle Eyes */}
            {/* Left Eye */}
            <ellipse cx="44" cy="88" rx="8" ry="10" fill="#212121" />
            <circle cx="41" cy="84" r="3" fill="#FFFFFF" />
            <circle cx="46" cy="91" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="74" cy="86" rx="8" ry="10" fill="#212121" />
            <circle cx="71" cy="82" r="3" fill="#FFFFFF" />
            <circle cx="76" cy="89" r="1.5" fill="#FFFFFF" />

            {/* ANIMATED TALKING MOUTH */}
            <g
              style={{
                animation: "sparkyTalk 0.5s ease-in-out infinite",
                transformOrigin: "58px 108px",
              }}
            >
              {/* Talking Mouth Cavity */}
              <path
                d="M 48 104 Q 58 120 68 104 Z"
                fill="#C62828"
                stroke="#6D4C41"
                strokeWidth="2.5"
              />
              {/* Cute little tongue inside */}
              <path
                d="M 52 110 Q 58 108 64 110 Q 58 116 52 110 Z"
                fill="#FF8A80"
              />
            </g>

            {/* Brown Stick Arms Clasped Together Happily */}
            <path
              d="M 28 112 C 40 126, 50 128, 58 120"
              stroke="#6D4C41"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 86 108 C 76 124, 66 126, 58 120"
              stroke="#6D4C41"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* ======================================================== */}
        {/* 6. ANIMATED BOUNCING BALL (In front of yellow flame)     */}
        {/* Bounces rhythmically off the red stage floor              */}
        {/* ======================================================== */}
        <g id="bouncing-ball-group" transform="translate(178, 328)">
          {/* Shadow of bouncing ball on the stage */}
          <ellipse
            cx="0"
            cy="24"
            rx="14"
            ry="4"
            fill="#000000"
            style={{
              animation: "ballShadow 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
              transformOrigin: "0px 24px",
            }}
          />

          {/* Bouncing Spherical Ball */}
          <g
            style={{
              animation: "ballBounce 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
              transformOrigin: "0px 14px",
            }}
          >
            <circle
              cx="0"
              cy="14"
              r="13"
              fill="url(#ballGrad)"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            />
            {/* Ball Specular Dot */}
            <circle cx="-4" cy="9" r="3.5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}
