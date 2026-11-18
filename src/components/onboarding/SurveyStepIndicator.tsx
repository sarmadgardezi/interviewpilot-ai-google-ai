import React from "react";

interface SurveyStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function SurveyStepIndicator({
  currentStep,
  totalSteps = 5,
}: SurveyStepIndicatorProps) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
        <span>
          Question {currentStep} of {totalSteps}
        </span>
        <span className="text-blue-600 font-bold">{progressPercent}% Completed</span>
      </div>

      {/* Progress Bar with Google Gradient */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Indicators */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                isDone
                  ? "bg-emerald-500 text-white shadow-xs"
                  : isCurrent
                  ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {isDone ? "✓" : stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
