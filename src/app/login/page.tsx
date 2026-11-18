"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  UserPlus,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { InterviewPilotLogo } from "@/components/InterviewPilotLogo";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { GoogleMascotsDoodle } from "@/components/GoogleMascotsDoodle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field focus tracking for Gemini Doodle
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null
  );
  const [emailBlurred, setEmailBlurred] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Email validation check for Angry Doodle state
  const isInvalidEmailFormat =
    email.length > 0 &&
    emailBlurred &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isEmailWrong = Boolean(
    isInvalidEmailFormat ||
      (error &&
        (error.toLowerCase().includes("email") ||
          error.toLowerCase().includes("credential") ||
          error.toLowerCase().includes("invalid")))
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email format before submitting
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      setEmailBlurred(true);
      return;
    }

    setLoading(true);

    try {
      // 1. Set persistence based on "Remember me"
      try {
        await setPersistence(
          auth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        );
      } catch (pErr) {
        console.warn("Could not set auth persistence:", pErr);
      }

      // 2. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // 3. Update Firestore users collection (connect to DB)
      try {
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(
          userRef,
          {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn("Firestore update error (proceeding with login):", dbErr);
      }

      // 4. Redirect to homepage/dashboard
      router.push("/");
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let message = "Failed to sign in. Please check your credentials.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        message = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again in a few minutes.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);
    setForgotLoading(true);

    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSuccess(
        `A password reset link has been sent to ${forgotEmail.trim()}. Please check your inbox.`
      );
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setForgotError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setForgotError("Please enter a valid email address.");
      } else {
        setForgotError(err.message || "Failed to send reset email.");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white relative flex flex-col justify-between items-center px-4 sm:px-8 py-6 sm:py-10 selection:bg-blue-100 selection:text-blue-900">
      {/* Top & Bottom Colorful Shapes */}
      <DecorativeBackground />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col flex-1 justify-between">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-6 sm:pb-8 w-full">
          <InterviewPilotLogo size="md" />

          {/* Prominent Sign Up Link in Top Header */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs sm:text-sm font-medium text-slate-500">
              New to InterviewPilot?
            </span>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 text-blue-700 text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span>Sign Up</span>
            </Link>
          </div>
        </header>

        {/* 2-Column Section */}
        <div className="my-auto py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* LEFT SIDE: Google Developer Mascots Doodle with Red Floor & Talking Sparky */}
          <div className="lg:col-span-6 flex items-center justify-center order-first">
            <div className="flex items-center justify-center p-2 sm:p-4 w-full">
              <GoogleMascotsDoodle
                focusedField={focusedField}
                isEmailWrong={isEmailWrong}
                isPasswordRevealed={showPassword}
                isLoading={loading}
                size={420}
                className="w-full max-w-[360px] sm:max-w-[420px]"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Login Form */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Welcome Back</span>
                <span className="text-2xl sm:text-3xl">👋</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-base font-normal">
                Sign in to continue your interview preparation.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => {
                      setFocusedField("email");
                    }}
                    onBlur={() => {
                      setFocusedField(null);
                      setEmailBlurred(true);
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none transition-all duration-200 shadow-xs ${
                      isEmailWrong
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {isInvalidEmailFormat && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>Please enter a valid email format (e.g. name@domain.com)</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="font-semibold text-slate-900 text-sm">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(null);
                    setForgotError(null);
                    setShowForgotModal(true);
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer text-sm"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base transition-all duration-200 shadow-md shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-600">
              <span>Don&apos;t have an account?</span>{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors ml-1"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 pb-2 text-center text-xs text-slate-400">
          InterviewPilot AI &copy; 2026 &bull; Secure Authentication powered by Google Cloud &amp; Firebase
        </footer>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
            <p className="text-slate-500 text-sm mt-1">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {forgotSuccess ? (
              <div className="mt-4 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>{forgotSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-5 space-y-4">
                {forgotError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
