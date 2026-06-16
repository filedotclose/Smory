"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup, verifyOTP } from "@/server/auth/actions";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { PixelLoading } from "@/components/ui/pixel/PixelLoading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"credentials" | "otp" | "loading">("credentials");
  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState<"email">("email");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("loading");
    
    const formData = new FormData(e.currentTarget);
    
    if (mode === "login") {
      const res = await login(formData);
      if (res?.error) {
        toast.error(res.error);
        setStep("credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/");
      }
    } else {
      const res = await signup(formData);
      if (res?.error) {
        toast.error(res.error);
        setStep("credentials");
      } else if (res?.requireOtp) {
        setIdentifier(res.identifier as string);
        setType("email");
        setStep("otp");
        toast.success(`OTP sent to your email`);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("loading");
    
    const formData = new FormData(e.currentTarget);
    formData.append("identifier", identifier);
    formData.append("type", type);

    const res = await verifyOTP(formData);
    if (res?.error) {
      toast.error(res.error);
      setStep("otp");
    } else {
      toast.success("Account verified successfully!");
      router.push("/");
    }
  };

  return (
    <PixelCard className="w-full max-w-md mx-auto p-8 bg-paper-white shadow-[8px_8px_0px_0px_rgba(11,11,15,1)]">
      <AnimatePresence mode="wait">
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PixelLoading message="Authenticating..." />
          </motion.div>
        )}

        {step === "credentials" && (
          <motion.form
            key="credentials"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-sm font-bold tracking-widest uppercase transition-all ${
                  mode === "login" ? "text-marlboro-red border-b-4 border-marlboro-red" : "text-ash-gray border-b-4 border-transparent hover:text-ink-black"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-bold tracking-widest uppercase transition-all ${
                  mode === "signup" ? "text-marlboro-red border-b-4 border-marlboro-red" : "text-ash-gray border-b-4 border-transparent hover:text-ink-black"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-ash-gray uppercase font-bold tracking-wider mb-1 block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-paper-white border-[3px] border-ink-black p-3 text-ink-black focus:outline-none focus:border-marlboro-red focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.2)] transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-xs text-ash-gray uppercase font-bold tracking-wider mb-1 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  pattern={mode === "signup" ? "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" : undefined}
                  title={mode === "signup" ? "Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters" : undefined}
                  placeholder="••••••••"
                  className="w-full bg-paper-white border-[3px] border-ink-black p-3 text-ink-black focus:outline-none focus:border-marlboro-red focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.2)] transition-all font-medium"
                />
                {mode === "signup" && (
                  <p className="text-[10px] text-ash-gray mt-1 font-medium">
                    Must contain at least 1 uppercase, 1 lowercase, and 1 number.
                  </p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-4 w-full bg-marlboro-red text-paper-white font-bold p-3 uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] border-[3px] border-ink-black active:shadow-none active:translate-y-1 transition-all"
            >
              {mode === "login" ? "Enter the Smory" : "Join the Smory"}
            </motion.button>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 text-center py-6"
          >
            <div className="mb-2">
              <div className="w-16 h-16 bg-filter-gold rounded-full mx-auto flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] border-[3px] border-ink-black">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-2xl font-black text-ink-black mb-2 uppercase tracking-tight">Check your email</h3>
              <p className="text-ink-black font-medium text-sm leading-relaxed">
                We've sent a magic verification link to<br/>
                <strong className="text-marlboro-red">{identifier}</strong>
              </p>
            </div>
            
            <p className="text-xs text-ash-gray font-medium mt-2">
              (Supabase requires you to click the link in your email since we haven't set up custom SMTP for OTP codes yet)
            </p>

            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="mt-6 text-xs text-ash-gray hover:text-marlboro-red transition-colors uppercase tracking-widest font-bold"
            >
              Go Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PixelCard>
  );
}
