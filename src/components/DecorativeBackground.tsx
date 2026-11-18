import React from "react";

export function DecorativeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* Top-Right Decorative Shapes */}
      <div className="absolute -top-12 -right-12 sm:-top-8 sm:-right-8 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Yellow Shape (Top) */}
          <path
            d="M130 0C170 30 240 10 300 50V0H130Z"
            fill="#FABB05"
          />
          <path
            d="M180 0C190 40 250 50 300 80V0H180Z"
            fill="#FBBF24"
          />
          {/* Red/Coral Shape (Middle) */}
          <path
            d="M190 0C180 55 220 110 300 130V50C250 35 220 20 190 0Z"
            fill="#EA4335"
          />
          {/* Blue Shape (Bottom of top-right cluster) */}
          <path
            d="M245 45C225 90 245 130 300 160V120C260 100 250 70 245 45Z"
            fill="#3B82F6"
          />
        </svg>
      </div>

      {/* Bottom-Left Decorative Shapes */}
      <div className="absolute -bottom-10 -left-10 sm:-bottom-8 sm:-left-8 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Green Shape (Curving upward from bottom left) */}
          <path
            d="M0 300V130C35 135 90 160 105 210C120 260 90 295 0 300Z"
            fill="#10B981"
          />
          <path
            d="M0 300V150C25 155 75 175 90 220C100 260 70 295 0 300Z"
            fill="#34A853"
          />
          {/* Yellow Shape (Tucked at bottom edge) */}
          <path
            d="M50 300C70 270 120 265 170 300H50Z"
            fill="#FABB05"
          />
        </svg>
      </div>
    </div>
  );
}
