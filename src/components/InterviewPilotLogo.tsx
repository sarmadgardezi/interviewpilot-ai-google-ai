import React from "react";
import Link from "next/link";

interface InterviewPilotLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function InterviewPilotLogo({
  className = "",
  size = "md",
}: InterviewPilotLogoProps) {
  const iconSize = size === "sm" ? 32 : size === "lg" ? 48 : 40;
  const titleSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  const subtitleSize = size === "sm" ? "text-[11px]" : "text-xs sm:text-sm";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 select-none group transition-opacity hover:opacity-95 ${className}`}
    >
      {/* 4-point Sparkle Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Top petal (Coral Red) */}
          <path
            d="M24 4C24 15.0457 24 24 24 24C24 24 15.0457 24 4 24C15.0457 24 24 15.0457 24 4Z"
            fill="url(#top-grad)"
          />
          {/* Right petal (Google Blue) */}
          <path
            d="M24 4C24 15.0457 24 24 24 24C24 24 32.9543 24 44 24C32.9543 24 24 15.0457 24 4Z"
            fill="url(#right-grad)"
          />
          {/* Bottom-left petal (Emerald Green) */}
          <path
            d="M24 44C24 32.9543 24 24 24 24C24 24 15.0457 24 4 24C15.0457 24 24 32.9543 24 44Z"
            fill="url(#bottom-left-grad)"
          />
          {/* Bottom-right petal (Vibrant Blue / Teal) */}
          <path
            d="M24 44C24 32.9543 24 24 24 24C24 24 32.9543 24 44 24C32.9543 24 24 32.9543 24 44Z"
            fill="url(#bottom-right-grad)"
          />

          <defs>
            <linearGradient id="top-grad" x1="14" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF5252" />
              <stop offset="1" stopColor="#EA4335" />
            </linearGradient>
            <linearGradient id="right-grad" x1="24" y1="14" x2="44" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4285F4" />
              <stop offset="1" stopColor="#1A73E8" />
            </linearGradient>
            <linearGradient id="bottom-left-grad" x1="14" y1="34" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34A853" />
              <stop offset="1" stopColor="#0F9D58" />
            </linearGradient>
            <linearGradient id="bottom-right-grad" x1="34" y1="34" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A73E8" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col leading-tight">
        <div className={`font-bold tracking-tight text-slate-900 ${titleSize} flex items-center`}>
          <span>InterviewPilot</span>
          <span className="text-blue-600 ml-1.5">AI</span>
        </div>
        <span className={`font-medium text-slate-500 tracking-normal ${subtitleSize}`}>
          Your AI Interview Coach
        </span>
      </div>
    </Link>
  );
}
