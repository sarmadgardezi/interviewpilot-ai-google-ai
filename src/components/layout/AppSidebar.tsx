"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      title: "10Q Mock Interview",
      href: "/interview",
      icon: Sparkles,
      active: pathname === "/interview",
    },
    {
      title: "Survey & Preferences",
      href: "/onboarding",
      icon: ClipboardList,
      active: pathname === "/onboarding",
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/70 border-r border-slate-100 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    item.active
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workshop Pill */}
        <div className="p-3.5 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50/50 border border-blue-100 text-xs">
          <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>DevFest Workshop</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Powered by Google Gemma &amp; Vertex AI. Preparing autonomous agents for Google Cloud.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200/60 text-center text-[11px] text-slate-400">
        InterviewPilot AI v0.1
      </div>
    </aside>
  );
}
