"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginView() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setCompany("");
    setPhone("");
    setError("");
    setSuccess("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields are filled
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !company.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("All fields are required. Please fill in every detail.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[+]?[\d\s()-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          company: company.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Account created successfully! You can now sign in.");
    setLoading(false);
    setTimeout(() => {
      setIsSignUp(false);
      resetForm();
    }, 2000);
  };

  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-border focus:ring-2 focus:ring-brand outline-none transition-all text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2 p-6">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-border">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">FF</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Create your account" : "Welcome to FleetFlow"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp
              ? "Fill in all details to get started"
              : "Sign in to manage your fleet operations"}
          </p>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
            {success}
          </div>
        )}

        {/* ─── SIGN IN FORM ─── */}
        {!isSignUp && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ─── SIGN UP FORM ─── */}
        {isSignUp && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="Daksh Sharma"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="signupEmail">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="signupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="company">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
                placeholder="FleetFlow Logistics Pvt Ltd"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="signupPassword">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="signupPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Min 6 chars"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="confirmPassword"
                >
                  Confirm <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Re-enter"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Toggle between Sign In / Sign Up */}
        <div className="text-center text-sm">
          {isSignUp ? (
            <>
              <span className="text-muted-foreground">
                Already have an account?
              </span>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  resetForm();
                }}
                className="text-brand font-medium hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">New to FleetFlow?</span>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  resetForm();
                }}
                className="text-brand font-medium hover:underline"
              >
                Create an Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
