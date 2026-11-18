"use client";

import React from "react";
import Link from "next/link";
import { History, PlusCircle } from "lucide-react";

interface RecentInterviewsProps {
  onStartClick?: () => void;
}

export function RecentInterviews({ onStartClick }: RecentInterviewsProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Recent Interviews</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Previous mock evaluations and question rubrics
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-12 flex flex-col items-center justify-center text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
          <History className="w-6 h-6 text-blue-500" />
        </div>
        <div className="text-sm font-bold text-slate-800">
          No Interviews Completed
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Your recorded answers, marks out of 10, and AI feedback breakdowns will be logged here.
        </p>

        <Link
          href="/interview"
          className="mt-4 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Launch Practice Session</span>
        </Link>
      </div>
    </div>
  );
}
