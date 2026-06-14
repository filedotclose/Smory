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
  const [type, setType] = useState<"email" | "phone">("email");

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
        setType(res.type as "email" | "phone");
        setStep("otp");
        toast.success(`OTP sent to your ${res.type}`);
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
    <PixelCard className="w-full max-w-md mx-auto p-8 bg-[#0B0B0F]/90 backdrop-blur-md">
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
                  mode === "login" ? "text-[#4DA6FF] border-b-2 border-[#4DA6FF]" : "text-[#A1A1AA]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-bold tracking-widest uppercase transition-all ${
                  mode === "signup" ? "text-[#4DA6FF] border-b-2 border-[#4DA6FF]" : "text-[#A1A1AA]"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#A1A1AA] uppercase font-bold tracking-wider mb-1 block">
                  Email or Phone
                </label>
                <input
                  name="emailOrPhone"
                  type="text"
                  required
                  placeholder="name@example.com or +1234567890"
                  className="w-full bg-[#1D1D24] border-2 border-[#2D2D36] p-3 text-white focus:outline-none focus:border-[#4DA6FF] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-[#A1A1AA] uppercase font-bold tracking-wider mb-1 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#1D1D24] border-2 border-[#2D2D36] p-3 text-white focus:outline-none focus:border-[#4DA6FF] transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-4 w-full bg-[#4DA6FF] text-[#0B0B0F] font-bold p-3 uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] border-[2px] border-[#0B0B0F]"
            >
              {mode === "login" ? "Enter the Smory" : "Join the Smory"}
            </motion.button>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerify}
            className="flex flex-col gap-4"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Verify {type === "phone" ? "Phone" : "Email"}</h3>
              <p className="text-[#A1A1AA] text-sm">Enter the code sent to {identifier}</p>
            </div>

            <div>
              <label className="text-xs text-[#A1A1AA] uppercase font-bold tracking-wider mb-1 block">
                Verification Code
              </label>
              <input
                name="token"
                type="text"
                required
                placeholder="123456"
                className="w-full bg-[#1D1D24] border-2 border-[#2D2D36] p-3 text-white text-center tracking-[0.5em] focus:outline-none focus:border-[#4DA6FF] transition-colors text-xl"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-4 w-full bg-[#4DA6FF] text-[#0B0B0F] font-bold p-3 uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] border-[2px] border-[#0B0B0F]"
            >
              Verify & Enter
            </motion.button>
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="mt-2 text-xs text-[#A1A1AA] hover:text-white transition-colors uppercase tracking-widest font-bold"
            >
              Go Back
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </PixelCard>
  );
}
