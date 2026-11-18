import React from "react";
import { Bot, Award, TrendingUp, CheckCircle } from "lucide-react";
import { UserInterviewStats } from "@/types/interview";

interface StatsOverviewProps {
  stats?: UserInterviewStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const completed = stats?.interviewsCompleted || 0;
  const avg = stats && stats.interviewsCompleted > 0 ? `${stats.averageScore}/100` : "--";
  const best = stats && stats.interviewsCompleted > 0 ? `${stats.bestScore}/100` : "--";

  const cards = [
    {
      title: "Interviews Completed",
      value: completed,
      subtitle: completed === 0 ? "Ready for your first session" : "Completed mock interviews",
      icon: Bot,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Average Score",
      value: avg,
      subtitle: completed === 0 ? "Scores will calculate here" : "Across all 10-question mocks",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Best Score",
      value: best,
      subtitle: completed === 0 ? "Aim for 80+ out of 100" : "Highest recorded session",
      icon: Award,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Interview Readiness",
      value: "Active",
      subtitle: "Personalized survey configured",
      icon: CheckCircle,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
