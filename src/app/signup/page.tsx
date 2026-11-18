"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { InterviewPilotLogo } from "@/components/InterviewPilotLogo";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { GoogleMascotsDoodle } from "@/components/GoogleMascotsDoodle";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field focus tracking for Google Mascots Doodle
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null
  );
  const [emailBlurred, setEmailBlurred] = useState(false);

  // Email validation check for Angry Doodle state
  const isInvalidEmailFormat =
    email.length > 0 &&
    emailBlurred &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isEmailWrong = Boolean(
    isInvalidEmailFormat ||
      (error &&
        (error.toLowerCase().includes("email") ||
          error.toLowerCase().includes("invalid")))
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      setEmailBlurred(true);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // 2. Update display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      // 3. Connect & save user profile to Firestore Database
      try {
        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          displayName: fullName.trim(),
          email: email.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          role: "candidate",
          interviewsCompleted: 0,
        });
      } catch (dbErr) {
        console.warn("Firestore user creation note:", dbErr);
      }

      // 4. Redirect to home/dashboard
      router.push("/");
    } catch (err: any) {
      console.error("Firebase Sign Up Error:", err);
      let message = "Failed to create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Try signing in.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white relative flex flex-col justify-between items-center px-4 sm:px-8 py-6 sm:py-10 selection:bg-blue-100 selection:text-blue-900">
      {/* Top & Bottom Colorful Shapes */}
      <DecorativeBackground />

      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col flex-1 justify-between">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-6 sm:pb-8 w-full">
          <InterviewPilotLogo size="md" />

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs sm:text-sm font-medium text-slate-500">
              Already registered?
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 text-blue-700 text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Sign In</span>
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
                isPasswordRevealed={showPassword || showConfirmPassword}
                isLoading={loading}
                size={420}
                className="w-full max-w-[360px] sm:max-w-[420px]"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Sign Up Form */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Create Account</span>
                <span className="text-2xl sm:text-3xl">🚀</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-base font-normal">
                Sign up to start your interview preparation.
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
            <form onSubmit={handleSignUp} className="mt-6 space-y-4">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-xs"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => {
                      setFocusedField(null);
                      setEmailBlurred(true);
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-3 bg-white border rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none transition-all duration-200 shadow-xs ${
                      isEmailWrong
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {isInvalidEmailFormat && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>Please enter a valid email format</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password (min. 6 chars)"
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-xs"
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs sm:text-sm text-slate-600 leading-normal">
                    I agree to the{" "}
                    <a href="#" className="font-semibold text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base transition-all duration-200 shadow-md shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-600">
              <span>Already have an account?</span>{" "}
              <Link
                href="/login"
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 pb-2 text-center text-xs text-slate-400">
          InterviewPilot AI &copy; 2026 &bull; Secure Authentication powered by Google Cloud &amp; Firebase
        </footer>
      </div>
    </main>
  );
}
