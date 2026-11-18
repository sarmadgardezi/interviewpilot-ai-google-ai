"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Target,
  BookOpen,
  CheckCircle,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { UserRecommendations } from "@/types/interview";

interface RecommendationCardProps {
  recommendations: UserRecommendations;
  onStartInterview?: () => void;
}

export function RecommendationCard({
  recommendations,
  onStartInterview,
}: RecommendationCardProps) {
  const difficultyColors = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
    Advanced: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-blue-50/70 via-white to-indigo-50/40 border border-blue-100 shadow-md shadow-blue-500/5 relative overflow-hidden">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-blue-400/10 to-transparent blur-2xl pointer-events-none" />

      {/* Top Meta Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
          <Target className="w-3.5 h-3.5" />
          <span>Recommended Track</span>
        </span>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
            difficultyColors[recommendations.recommendedDifficulty] ||
            "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          {recommendations.recommendedDifficulty} Difficulty
        </span>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700">
          <span>{recommendations.targetRoleLabel}</span>
        </span>
      </div>

      {/* Main Title & Description */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {recommendations.categoryTitle}
      </h2>
      <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
        {recommendations.categoryDescription}
      </p>

      {/* Gemma AI Coaching Advice (if generated) */}
      {recommendations.aiAdvice && (
        <div className="mt-5 p-4 rounded-2xl bg-white/90 border border-blue-100 text-xs sm:text-sm text-slate-700 flex items-start gap-3 shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Google Gemma AI Coach Insights</span>
              <span className="text-[10px] font-medium text-blue-600 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                Gemma 4 26B
              </span>
            </div>
            <div className="mt-1 text-slate-600 whitespace-pre-line leading-relaxed">
              {recommendations.aiAdvice}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Practice Curriculum */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Key Topics to be Tested (10 Questions &bull; 100 Total Marks)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendations.recommendedTopics.map((topic, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100 text-xs sm:text-sm font-medium text-slate-800"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/interview"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
        >
          <span>Start 10-Question AI Interview</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/onboarding"
          className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
          <span>Retake Survey</span>
        </Link>
      </div>
    </div>
  );
}
