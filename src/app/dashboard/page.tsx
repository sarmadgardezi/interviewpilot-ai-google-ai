"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  X,
  Bot,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { PerformanceTrend } from "@/components/dashboard/PerformanceTrend";
import { RecentInterviews } from "@/components/dashboard/RecentInterviews";
import { getOnboardingData } from "@/lib/storage/onboarding";
import { OnboardingSurveyData, UserRecommendations } from "@/types/interview";

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<OnboardingSurveyData | null>(null);
  const [recommendations, setRecommendations] = useState<UserRecommendations | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!authLoading) {
        const data = await getOnboardingData(user?.uid);
        if (data.survey && data.recommendations) {
          setSurvey(data.survey);
          setRecommendations(data.recommendations);
        }
        setLoading(false);
      }
    }
    loadData();
  }, [user, authLoading]);

  const displayName =
    userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Candidate";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-slate-500 text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Header */}
      <AppHeader />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GDG Cloud Islamabad &bull; Road to DevFest 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Your personalized interview coach is tailored to your target engineering domain.
              </p>
            </div>

            {!survey && (
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all shrink-0"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Complete 5-Question Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Stats Grid */}
          <StatsOverview />

          {/* If survey completed, show the Recommendation Card */}
          {recommendations ? (
            <RecommendationCard
              recommendations={recommendations}
              onStartInterview={() => setShowInterviewModal(true)}
            />
          ) : (
            /* Empty State for Onboarding Survey */
            <div className="p-8 rounded-3xl bg-white border border-dashed border-blue-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Complete Your 5-Question Survey
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-md leading-relaxed">
                Answer 5 quick questions about your target role and skills to unlock your custom AI interview curriculum and recommended difficulty.
              </p>
              <Link
                href="/onboarding"
                className="mt-5 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Start Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Performance & Recent History Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceTrend />
            <RecentInterviews onStartClick={() => setShowInterviewModal(true)} />
          </div>
        </main>
      </div>

      {/* Start Interview Modal Preview */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 text-center">
            <button
              onClick={() => setShowInterviewModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AI Interview Engine Ready
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Target Track:{" "}
              <strong className="text-slate-900">
                {recommendations?.categoryTitle || "Engineering"}
              </strong>
              <br />
              Difficulty:{" "}
              <strong className="text-blue-600">
                {recommendations?.recommendedDifficulty || "Intermediate"}
              </strong>
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 text-left space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>10 original questions generated dynamically</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>10 marks available per question (100 total marks)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Graded with Google Gemma 4 26B AI rubric</span>
              </div>
            </div>

            <Link
              href="/interview"
              className="inline-flex items-center justify-center w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Start 10-Question AI Interview &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
