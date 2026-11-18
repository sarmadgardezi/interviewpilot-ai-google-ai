"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  User as UserIcon,
  Sparkles,
  Send,
  Loader2,
  Search,
  Building2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  HelpCircle,
  RefreshCw,
  Globe,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InterviewPilotLogo } from "@/components/InterviewPilotLogo";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { HangingDoodle } from "@/components/HangingDoodle";
import { RunningDoodle } from "@/components/RunningDoodle";
import { TypewriterMessage } from "@/components/TypewriterMessage";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { CompanyInterviewData, CompanyQuestion } from "@/types/interview";
import { getOnboardingData } from "@/lib/storage/onboarding";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  companyData?: CompanyInterviewData;
}

const POPULAR_COMPANIES = [
  { name: "Google", tag: "FAANG / Distributed Scale", icon: "🌐" },
  { name: "Careem", tag: "🇵🇰 Geospatial / Microservices", icon: "🚗" },
  { name: "Arbisoft", tag: "🇵🇰 Python / React / CS", icon: "💻" },
  { name: "Systems Limited", tag: "🇵🇰 Enterprise Cloud & Banking", icon: "🏢" },
  { name: "Stripe", tag: "Fintech / High-Concurrency", icon: "💳" },
  { name: "Meta", tag: "React / Scale / Infrastructure", icon: "⚡" },
  { name: "SadaPay", tag: "🇵🇰 Fintech / Event Streams", icon: "📱" },
  { name: "Amazon", tag: "Cloud / Distributed Systems", icon: "📦" },
];

export default function InterviewPage() {
  const { user, loading: authLoading } = useAuth();

  // Candidate personalization
  const [candidateName, setCandidateName] = useState("Friend");
  const [targetRole, setTargetRole] = useState("Full Stack Software Engineer");

  // Company Search state
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [isSearchingCompany, setIsSearchingCompany] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState<CompanyInterviewData | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(1);

  // Chat conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Voice Input (Speech-to-Text) state
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Audio Output (Text-to-Speech) state
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const [copiedAnswerId, setCopiedAnswerId] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize greeting & candidate info
  useEffect(() => {
    async function initUser() {
      let name = "Friend";
      if (user?.displayName) {
        name = user.displayName.split(" ")[0];
      } else if (user?.email) {
        name = user.email.split("@")[0];
      }

      const { recommendations } = await getOnboardingData(user?.uid);
      if (recommendations?.targetRoleLabel) {
        setTargetRole(recommendations.targetRoleLabel);
      }

      setCandidateName(name);

      // Initial AI greeting message
      const initialGreeting: Message = {
        id: "initial_welcome",
        role: "assistant",
        content: `Hey **${name}**! I'm your Google-powered **AI Interview Pilot** 🚀.\n\nWhat company are you preparing for today? You can:\n- 🔍 **Search any company** above (like Google, Careem, Arbisoft, Systems Limited, Stripe) to see their **Top 5 Best Interview Questions** with complete model answers.\n- 🎙️ Tap the **Microphone** to speak your questions.\n- 💬 Ask me anything about architecture, coding, or how interviewers evaluate candidates!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: false,
      };

      setMessages([initialGreeting]);
    }

    if (!authLoading) {
      initUser();
    }
  }, [user, authLoading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);

  // Search company for Top 5 Best Questions & Model Answers
  const handleSearchCompany = async (companyName: string) => {
    const query = companyName.trim() || companySearchQuery.trim();
    if (!query || isSearchingCompany) return;

    setIsSearchingCompany(true);
    setVoiceError(null);

    // Add user search as chat message
    const userSearchMsg: Message = {
      id: `user_search_${Date.now()}`,
      role: "user",
      content: `Show me the Top 5 interview questions and model answers for **${query}**`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userSearchMsg]);
    setCompanySearchQuery("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "company_search",
          params: {
            companyName: query,
            targetRole,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.companyData) {
          setSelectedCompanyData(data.companyData);
          setExpandedQuestionId(1);

          const aiReplyMsg: Message = {
            id: `company_reply_${Date.now()}`,
            role: "assistant",
            content: `Here are the **Top 5 Most Asked Interview Questions** for **${data.companyData.company}**!\n\n> 🏢 **Engineering Culture:** ${data.companyData.engineeringCulture}\n\nReview the accurate model answers below, and tap **🔊 Listen** to hear the breakdown aloud!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isStreaming: true,
            companyData: data.companyData,
          };

          setMessages((prev) => [...prev, aiReplyMsg]);
        }
      }
    } catch (err) {
      console.error("Company search error:", err);
    } finally {
      setIsSearchingCompany(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Send Conversational Chat Message to AI Agent
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isAiResponding) return;

    // Stop ongoing speech
    stopSpeaking();

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputMessage("");
    setIsAiResponding(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_conversation",
          params: {
            userMessage: text,
            candidateName,
            targetCompany: selectedCompanyData?.company || "Tech Leaders",
            chatHistory: updatedMessages.slice(-8).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const aiMsg: Message = {
            id: `msg_ai_${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isStreaming: true,
          };

          setMessages((prev) => [...prev, aiMsg]);
        }
      }
    } catch (err) {
      console.error("Chat conversation error:", err);
    } finally {
      setIsAiResponding(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Voice Input: Speech-to-Text via Web Speech API
  const handleToggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          // Auto send spoken query
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setVoiceError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setVoiceError(err.message || "Failed to start microphone");
      setIsListening(false);
    }
  };

  // Audio Playback: Text-to-Speech via SpeechSynthesis
  const handleSpeakText = (messageId: string, textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMessageId === messageId) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for natural voice reading
    const clean = textToSpeak
      .replace(/```[\s\S]*?```/g, "Code example available in text.")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/#{1,6}\s+/g, "")
      .replace(/>\s+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find(
        (v) =>
          (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha")) &&
          v.lang.startsWith("en")
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  const copyAnswer = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswerId(id);
    setTimeout(() => setCopiedAnswerId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50/70 relative flex flex-col selection:bg-blue-100 selection:text-blue-900 pb-16">
      <DecorativeBackground />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <InterviewPilotLogo size="sm" />
        </div>

        {/* Candidate Identity Pill */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Pilot for: {candidateName}</span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 hidden sm:inline"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5 flex-1 flex flex-col relative z-10 space-y-4">
        {/* ======================================================== */}
        {/* 1. GOOGLE-STYLE COMPANY INTERVIEW SEARCH BAR             */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Search Any Company &bull; 5 Best Interview Questions &amp; Answers</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Global &amp; Pakistan hiring intelligence
            </span>
          </div>

          {/* Search Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchCompany(companySearchQuery);
            }}
            className="relative flex items-center"
          >
            <div className="absolute left-4 text-slate-400">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <input
              type="text"
              value={companySearchQuery}
              onChange={(e) => setCompanySearchQuery(e.target.value)}
              placeholder="Search company (e.g. Google, Careem, Arbisoft, Systems Limited, Stripe, Meta, SadaPay)..."
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!companySearchQuery.trim() || isSearchingCompany}
              className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {isSearchingCompany ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Search</span>
                  <Search className="w-3 h-3" />
                </>
              )}
            </button>
          </form>

          {/* Popular Company Quick Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Top Trending:
            </span>
            {POPULAR_COMPANIES.map((comp) => (
              <button
                key={comp.name}
                onClick={() => handleSearchCompany(comp.name)}
                disabled={isSearchingCompany}
                className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span>{comp.icon}</span>
                <span>{comp.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice error toast */}
        {voiceError && (
          <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between animate-fadeIn">
            <span>{voiceError}</span>
            <button
              onClick={() => setVoiceError(null)}
              className="text-amber-600 font-bold hover:underline cursor-pointer text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. CHAT BOT WINDOW WITH RUNNING DOODLE & STREAMING WORDS  */}
        {/* ======================================================== */}
        <div className="relative pt-6">
          {/* Top Hanging Doodle */}
          <HangingDoodle
            mood={isAiResponding || isSearchingCompany ? "thinking" : isListening ? "peeking" : "happy"}
            character="android"
            className="absolute -top-6 right-8 sm:right-14 z-20"
          />

          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 relative z-10 overflow-hidden flex flex-col min-h-[580px]">
            {/* Window Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-linear-to-r from-blue-50/60 via-white to-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>InterviewPilot AI Coach</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live Scout &bull; Google Studio Gemini + Gemma AI
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {isAiResponding && <RunningDoodle state="running" />}
                {speakingMessageId && <RunningDoodle state="speaking" />}
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="p-4 sm:p-6 flex-1 space-y-5 overflow-y-auto max-h-[620px]">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const isSpeakingThis = speakingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}

                    <div className="max-w-2xl w-full space-y-3">
                      {/* Message Bubble */}
                      <div
                        className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                          isUser
                            ? "bg-blue-600 text-white rounded-tr-xs ml-auto max-w-lg whitespace-pre-line"
                            : "bg-white text-slate-800 rounded-tl-xs border border-slate-200/80"
                        }`}
                      >
                        {/* Audio Listen & Action Bar for AI Messages */}
                        {!isUser && (
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span>AI Answer</span>
                            </span>

                            <button
                              onClick={() => handleSpeakText(msg.id, msg.content)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                isSpeakingThis
                                  ? "bg-emerald-500 text-white shadow-xs"
                                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                              }`}
                              title={isSpeakingThis ? "Stop Audio" : "Listen in Audio"}
                            >
                              {isSpeakingThis ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5" />
                                  <span>Stop Audio</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                                  <span>🔊 Listen</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Text / Markdown Render */}
                        {isUser ? (
                          msg.content
                        ) : msg.isStreaming ? (
                          <TypewriterMessage content={msg.content} isStreaming={true} />
                        ) : (
                          <MarkdownMessage content={msg.content} />
                        )}

                        {/* Timestamp */}
                        <div
                          className={`text-[10px] mt-2 pt-1 font-medium ${
                            isUser ? "text-blue-200 text-right" : "text-slate-400"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {/* ======================================================== */}
                      {/* TOP 5 QUESTIONS ACCORDION CARD (WHEN COMPANY SEARCHED)   */}
                      {/* ======================================================== */}
                      {msg.companyData && (
                        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-lg space-y-3.5 border border-slate-800">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-xs">
                                5Q
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-white">
                                  Top 5 Best Questions for {msg.companyData.company}
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Tap any question to reveal its accurate model answer
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {msg.companyData.questions.map((q) => {
                              const isExpanded = expandedQuestionId === q.id;
                              const compName = msg.companyData?.company || "Company";
                              return (
                                <div
                                  key={q.id}
                                  className="rounded-2xl bg-slate-950/80 border border-slate-800/90 overflow-hidden transition-all"
                                >
                                  {/* Question Header */}
                                  <button
                                    onClick={() =>
                                      setExpandedQuestionId(isExpanded ? null : q.id)
                                    }
                                    className="w-full p-3.5 flex items-start justify-between text-left hover:bg-slate-900/60 transition-colors cursor-pointer gap-3"
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                        {q.id}
                                      </span>
                                      <div>
                                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                                          {q.topic}
                                        </div>
                                        <h5 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                                          {q.question}
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="shrink-0 text-slate-400 mt-1">
                                      {isExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4" />
                                      )}
                                    </div>
                                  </button>

                                  {/* Accurate Model Answer (Expanded) */}
                                  {isExpanded && (
                                    <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-900/40 space-y-3 animate-fadeIn text-xs">
                                      {/* Why Asked */}
                                      <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-900/50 text-[11px] text-blue-200 flex items-start gap-2">
                                        <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                        <div>
                                          <span className="font-bold text-blue-300">
                                            Why {compName} Tests This:
                                          </span>{" "}
                                          {q.whyAsked}
                                        </div>
                                      </div>

                                      {/* Accurate Answer Box */}
                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                                          <div className="flex items-center gap-1.5">
                                            <Lightbulb className="w-3.5 h-3.5" />
                                            <span>Accurate Model Answer:</span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() =>
                                                handleSpeakText(
                                                  `audio_q_${q.id}`,
                                                  q.accurateAnswer
                                                )
                                              }
                                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                              <Volume2 className="w-3 h-3 text-emerald-400" />
                                              <span>Listen Answer</span>
                                            </button>

                                            <button
                                              onClick={() => copyAnswer(q.id, q.accurateAnswer)}
                                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                              {copiedAnswerId === q.id ? (
                                                <>
                                                  <Check className="w-3 h-3 text-emerald-400" />
                                                  <span>Copied!</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3" />
                                                  <span>Copy</span>
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                                          <MarkdownMessage content={q.accurateAnswer} />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <UserIcon className="w-4.5 h-4.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={chatBottomRef} />
            </div>

            {/* ======================================================== */}
            {/* CHAT INPUT BAR WITH VOICE MIC & AUDIO CONTROLS           */}
            {/* ======================================================== */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input (Speech-to-Text) Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`p-3 rounded-2xl transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-xs ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                  title={isListening ? "Listening... Tap to stop" : "Speak question with voice"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 animate-bounce" />
                  ) : (
                    <Mic className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                {/* Text Message Input */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening to your voice... Speak now!"
                      : "Type your question or speak via mic..."
                  }
                  className={`flex-1 px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-4 transition-all shadow-inner ${
                    isListening
                      ? "border-red-400 ring-4 ring-red-100 bg-red-50/30 text-red-900 font-semibold"
                      : "border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-blue-100 bg-white"
                  }`}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiResponding}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
                >
                  {isAiResponding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Send</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Prompt Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-400">Quick prompts:</span>
                <button
                  onClick={() =>
                    handleSendMessage("Give me a mock interview question on Next.js 15 App Router Server Actions")
                  }
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Next.js Question
                </button>
                <button
                  onClick={() =>
                    handleSendMessage("How do engineering interview rounds work at Arbisoft and Systems Limited?")
                  }
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Arbisoft &amp; Systems Rounds
                </button>
                <button
                  onClick={() =>
                    handleSendMessage("Explain distributed rate limiting in simple terms with Redis")
                  }
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Distributed Rate Limiting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
