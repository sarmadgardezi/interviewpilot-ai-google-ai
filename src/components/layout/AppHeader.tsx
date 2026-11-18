"use client";

import React from "react";
import Link from "next/link";
import { LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InterviewPilotLogo } from "@/components/InterviewPilotLogo";

export function AppHeader() {
  const { user, userProfile, logout } = useAuth();
  const displayName =
    userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Candidate";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center gap-4">
        <InterviewPilotLogo size="sm" />
      </div>

      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{userProfile?.role || "Candidate"}</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{displayName}</span>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => logout()}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
