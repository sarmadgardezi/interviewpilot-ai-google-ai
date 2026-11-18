"use client";

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

interface PerformanceTrendProps {
  data?: { date: string; score: number }[];
}

export function PerformanceTrend({ data = [] }: PerformanceTrendProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Score Progression</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Marks tracked across 10-question interview sessions
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <BarChart3 className="w-6 h-6 text-slate-300" />
          </div>
          <div className="text-sm font-bold text-slate-800">
            No Score History Yet
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Take your first AI interview session to generate your personalized performance trend chart.
          </p>
        </div>
      ) : (
        <div className="h-48 flex items-end gap-3 pt-6 px-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-600 rounded-t-lg transition-all"
                style={{ height: `${item.score}%` }}
              />
              <span className="text-[10px] text-slate-400">{item.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
