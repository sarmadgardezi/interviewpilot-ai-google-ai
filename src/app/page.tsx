"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Cpu,
  CheckCircle,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InterviewPilotLogo } from "@/components/InterviewPilotLogo";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { GoogleMascotsDoodle } from "@/components/GoogleMascotsDoodle";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-white relative flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <DecorativeBackground />

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto w-full">
        <InterviewPilotLogo size="md" />

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 font-semibold text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-16 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Value Prop */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>GDG Cloud Islamabad &bull; Road to DevFest 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Master Your Next Tech Interview with{" "}
            <span className="text-blue-600">Personalized AI</span>.
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
            InterviewPilot AI dynamically tailors 10-question technical &amp; behavioral mock interviews to your exact skills and experience level, with real-time scoring out of 100 powered by Google Gemma.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>{user ? "Open My Dashboard" : "Start Preparing Now — Free"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-base flex items-center justify-center gap-2 transition-colors"
            >
              <span>Take 5-Question Survey</span>
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Zero Static Questions</span>
              </div>
              <p className="text-xs text-slate-500">
                AI dynamically crafts questions tailored to your resume and stack.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>10 Marks per Question</span>
              </div>
              <p className="text-xs text-slate-500">
                Detailed marking rubric, correct &amp; missing concepts breakdown.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Google Gemma AI</span>
              </div>
              <p className="text-xs text-slate-500">
                Powered by Google Gemma 4 26B &amp; Google Cloud Vertex AI.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Google Mascots Doodle Illustration */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <GoogleMascotsDoodle size={400} />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-slate-100 text-center text-xs text-slate-400">
        InterviewPilot AI &copy; 2026 &bull; Created by Sarmad Gardezi for Road to DevFest 2026 (GDG Cloud Islamabad)
      </footer>
    </main>
  );
}
