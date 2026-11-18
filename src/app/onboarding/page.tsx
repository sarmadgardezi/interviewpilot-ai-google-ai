"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Code,
  Server,
  Layers,
  Smartphone,
  Cpu,
  Cloud,
  GraduationCap,
  Briefcase,
  Zap,
  Award,
  Terminal,
  ShieldCheck,
  Compass,
  Clock,
  Calendar,
  Target,
  Search,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InterviewPilotLogo } from "@/components/InterviewPilotLogo";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { SurveyStepIndicator } from "@/components/onboarding/SurveyStepIndicator";
import {
  TargetRole,
  ExperienceLevel,
  InterviewFocus,
  PreparationTimeline,
  OnboardingSurveyData,
} from "@/types/interview";
import { saveOnboardingData, getOnboardingData } from "@/lib/storage/onboarding";

// 5 Structured Questions Config
const ROLE_OPTIONS = [
  {
    id: "frontend" as TargetRole,
    title: "Frontend Engineer",
    description: "React, Next.js, TypeScript, UI Components & Web Performance",
    icon: Code,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "backend" as TargetRole,
    title: "Backend Engineer",
    description: "Node.js, Databases, REST/gRPC APIs & Microservices",
    icon: Server,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    id: "fullstack" as TargetRole,
    title: "Full Stack Developer",
    description: "End-to-End Applications, Cloud Integrations & DBs",
    icon: Layers,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    id: "mobile" as TargetRole,
    title: "Mobile App Developer",
    description: "Flutter, Android (Kotlin), iOS (Swift) & Cross-Platform",
    icon: Smartphone,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "ai_data" as TargetRole,
    title: "AI & Data Engineer",
    description: "Python, LLMs, Google Gemini/Gemma, Vector DBs & Pipelines",
    icon: Cpu,
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "devops_cloud" as TargetRole,
    title: "DevOps & Cloud Engineer",
    description: "Google Cloud Platform, Docker, Kubernetes, CI/CD & Terraform",
    icon: Cloud,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200",
  },
];

const EXPERIENCE_OPTIONS = [
  {
    id: "student" as ExperienceLevel,
    title: "Student / Fresh Graduate",
    subtitle: "Preparing for initial internships or first full-time role",
    icon: GraduationCap,
  },
  {
    id: "junior" as ExperienceLevel,
    title: "Junior Engineer (0 - 2 Years)",
    subtitle: "Building core production experience and looking to advance",
    icon: Briefcase,
  },
  {
    id: "mid" as ExperienceLevel,
    title: "Mid-Level Engineer (2 - 5 Years)",
    subtitle: "Experienced with architecture, design trade-offs, and delivery",
    icon: Zap,
  },
  {
    id: "senior" as ExperienceLevel,
    title: "Senior / Lead (5+ Years)",
    subtitle: "Focusing on large-scale distributed systems and leadership",
    icon: Award,
  },
];

const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "HTML & CSS",
  "SQL / PostgreSQL",
  "MongoDB",
  "Google Cloud (GCP)",
  "Firebase",
  "Docker",
  "Git & GitHub",
  "Flutter / Dart",
  "Go",
  "Java",
  "REST APIs",
  "GraphQL",
  "System Design",
];

const FOCUS_OPTIONS = [
  {
    id: "technical" as InterviewFocus,
    title: "Technical & Coding Mastery",
    subtitle: "Core syntax, data structures, algorithms, and framework internals",
    icon: Terminal,
  },
  {
    id: "system_design" as InterviewFocus,
    title: "System Design & Architecture",
    subtitle: "Scalability, caching, database modeling, and trade-offs",
    icon: ShieldCheck,
  },
  {
    id: "behavioral" as InterviewFocus,
    title: "Behavioral & Leadership",
    subtitle: "STAR method, conflict resolution, project delivery, and culture",
    icon: Compass,
  },
  {
    id: "comprehensive" as InterviewFocus,
    title: "Balanced Comprehensive Mock",
    subtitle: "Realistic blend of technical questions, live design, and behavioral",
    icon: Target,
  },
];

const TIMELINE_OPTIONS = [
  {
    id: "immediate" as PreparationTimeline,
    title: "Immediate (Next 1 - 2 Weeks)",
    subtitle: "Intensive drills, rapid brush-up for upcoming scheduled interviews",
    icon: Clock,
  },
  {
    id: "one_month" as PreparationTimeline,
    title: "1 Month (Structured)",
    subtitle: "Standard schedule, daily practice to master key domain topics",
    icon: Calendar,
  },
  {
    id: "long_term" as PreparationTimeline,
    title: "Long-term (2+ Months)",
    subtitle: "Comprehensive foundational learning and FAANG-style preparation",
    icon: Target,
  },
  {
    id: "exploring" as PreparationTimeline,
    title: "Exploring & Learning",
    subtitle: "Low pressure practice to evaluate skills and prepare at own pace",
    icon: Search,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  // Form State (5 questions)
  const [targetRole, setTargetRole] = useState<TargetRole>("fullstack");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("student");
  const [primarySkills, setPrimarySkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Next.js",
  ]);
  const [interviewFocus, setInterviewFocus] = useState<InterviewFocus>("comprehensive");
  const [preparationTimeline, setPreparationTimeline] = useState<PreparationTimeline>("one_month");

  // Load existing profile if already completed
  useEffect(() => {
    async function checkExisting() {
      if (!authLoading) {
        const { survey } = await getOnboardingData(user?.uid);
        if (survey) {
          setTargetRole(survey.targetRole || "fullstack");
          setExperienceLevel(survey.experienceLevel || "student");
          setPrimarySkills(survey.primarySkills || ["TypeScript", "React"]);
          setInterviewFocus(survey.interviewFocus || "comprehensive");
          setPreparationTimeline(survey.preparationTimeline || "one_month");
        }
      }
    }
    checkExisting();
  }, [user, authLoading]);

  const toggleSkill = (skill: string) => {
    if (primarySkills.includes(skill)) {
      if (primarySkills.length > 1) {
        setPrimarySkills(primarySkills.filter((s) => s !== skill));
      }
    } else {
      setPrimarySkills([...primarySkills, skill]);
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleCompleteSurvey();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCompleteSurvey = async () => {
    setSubmitting(true);
    setSavingStatus("Saving profile to Cloud Firestore & local storage...");

    const surveyData: OnboardingSurveyData = {
      targetRole,
      experienceLevel,
      primarySkills,
      interviewFocus,
      preparationTimeline,
      completedAt: new Date().toISOString(),
    };

    try {
      // 1. Save to Firestore & LocalStorage
      const { recommendations } = await saveOnboardingData(
        surveyData,
        user?.uid
      );

      // 2. Fetch AI advice from OpenRouter Gemma in background
      setSavingStatus("Generating personalized coaching advice with Gemma AI...");
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "onboarding_advice",
            params: {
              targetRole,
              experienceLevel,
              primarySkills,
              interviewFocus,
              categoryTitle: recommendations.categoryTitle,
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.advice) {
            recommendations.aiAdvice = data.advice;
            await saveOnboardingData(surveyData, user?.uid);
          }
        }
      } catch (aiErr) {
        console.warn("AI advice generation note:", aiErr);
      }

      // 3. Redirect to Dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Survey submission error:", err);
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white relative flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10 selection:bg-blue-100 selection:text-blue-900">
      <DecorativeBackground />

      <div className="w-full max-w-2xl mx-auto relative z-10 flex flex-col flex-1 justify-between">
        {/* Header Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-100 w-full mb-6">
          <InterviewPilotLogo size="sm" />
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Onboarding</span>
          </div>
        </header>

        {/* Survey Content */}
        <div className="flex-1 flex flex-col justify-center my-auto">
          {/* Progress Indicator */}
          <SurveyStepIndicator currentStep={step} totalSteps={5} />

          {/* QUESTION 1: TARGET ROLE */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What target role are you preparing for?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  We&apos;ll tailor your interview questions and rubric to this engineering domain.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ROLE_OPTIONS.map((role) => {
                  const Icon = role.icon;
                  const isSelected = targetRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setTargetRole(role.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">
                          {role.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {role.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 2: EXPERIENCE LEVEL */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What is your experience level?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Sets the initial baseline difficulty for your mock questions.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {EXPERIENCE_OPTIONS.map((exp) => {
                  const Icon = exp.icon;
                  const isSelected = experienceLevel === exp.id;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperienceLevel(exp.id)}
                      className={`w-full p-4.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">
                            {exp.title}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            {exp.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 3: PRIMARY TECHNICAL SKILLS */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Which technologies do you want to practice?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Select at least one skill. Selected:{" "}
                  <span className="font-bold text-blue-600">
                    {primarySkills.length} skills
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 max-h-72 overflow-y-auto">
                <div className="flex flex-wrap gap-2.5">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = primarySkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs scale-102"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                        }`}
                      >
                        {isSelected && <span>✓</span>}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 4: INTERVIEW FOCUS */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What type of interview questions do you prefer?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Choose how technical or behavioral you want your sessions to be.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {FOCUS_OPTIONS.map((focus) => {
                  const Icon = focus.icon;
                  const isSelected = interviewFocus === focus.id;
                  return (
                    <button
                      key={focus.id}
                      type="button"
                      onClick={() => setInterviewFocus(focus.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">
                            {focus.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {focus.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 5: TIMELINE & GOALS */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  What is your preparation timeframe?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Final question to personalize your dashboard recommendations.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {TIMELINE_OPTIONS.map((time) => {
                  const Icon = time.icon;
                  const isSelected = preparationTimeline === time.id;
                  return (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => setPreparationTimeline(time.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">
                            {time.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {time.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saving Status Modal / Overlay */}
          {submitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-900">
                  Customizing Your Dashboard
                </h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  {savingStatus}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between w-full mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || submitting}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
              step === 1
                ? "opacity-0 pointer-events-none"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={submitting || (step === 3 && primarySkills.length === 0)}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
          >
            {step === 5 ? (
              <>
                <span>Complete Onboarding</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
