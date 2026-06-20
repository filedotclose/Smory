"use client";

import { useEffect, useState } from "react";
import { Joyride, STATUS, Step } from "react-joyride";
import { completeOnboarding } from "@/server/profile/actions";

interface Props {
  hasCompletedOnboarding: boolean;
  children: React.ReactNode;
}

export function OnboardingProvider({ hasCompletedOnboarding, children }: Props) {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    // Determine if we are on desktop or mobile for correct element targeting
    const isDesktop = window.innerWidth >= 1024;
    const prefix = isDesktop ? "#tour-nav-desktop-" : "#tour-nav-";

    setSteps([
      {
        target: "body",
        content: "Welcome to Smory! Let's take a quick 10-second tour to get you started.",
        placement: "center",
        disableBeacon: true,
      },
      {
        target: `${prefix}log`,
        content: "This is your main tool. Tap here anytime you have a craving or a smoke to log your triggers and intensity.",
        disableBeacon: true,
      },
      {
        target: `${prefix}insights`,
        content: "Check your Insights daily. The more you log, the more behavioral nodes you will unlock in the Discovery Tree.",
        disableBeacon: true,
      },
      {
        target: `${prefix}communities`,
        content: "Join anonymous groups to find support or chat with people sharing similar struggles.",
        disableBeacon: true,
      },
      {
        target: `${prefix}profile`,
        content: "Track your streaks and view your custom avatar here. You're ready to go!",
        disableBeacon: true,
      }
    ]);

    if (!hasCompletedOnboarding) {
      // Client-side fallback to absolutely guarantee it only runs once per browser
      const hasRunLocally = localStorage.getItem("smory_tour_completed");
      if (!hasRunLocally) {
        const timer = setTimeout(() => {
          setRun(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasCompletedOnboarding]);

  const handleJoyrideCallback = async (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("smory_tour_completed", "true");
      await completeOnboarding();
    }
  };

  return (
    <>
      <Joyride
        {...({
          steps,
          run,
          continuous: true,
          showSkipButton: true,
          showProgress: true,
          callback: handleJoyrideCallback,
          tooltipComponent: Tooltip,
          styles: {
            options: {
              overlayColor: "rgba(11, 11, 15, 0.85)",
              zIndex: 10000,
            }
          }
        } as any)}
      />
      {children}
    </>
  );
}

// Custom Tooltip Component for strict Neo-Brutalist styling
function Tooltip({
  index,
  step,
  tooltipProps,
  primaryProps,
  backProps,
  skipProps,
  isLastStep,
}: any) {
  return (
    <div
      {...tooltipProps}
      className="bg-paper-white border-[4px] border-ink-black shadow-[8px_8px_0px_0px_rgba(11,11,15,1)] p-6 max-w-sm rounded-none font-sans"
    >
      <div className="text-lg font-black text-ink-black mb-2 uppercase tracking-tight">
        {index === 0 ? "Welcome" : "Tour"}
      </div>
      <div className="text-ink-black font-medium text-sm leading-relaxed mb-6">
        {step.content}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        {index > 0 ? (
          <button
            {...backProps}
            className="text-xs font-bold uppercase tracking-widest text-ash-gray hover:text-ink-black transition-colors"
          >
            Back
          </button>
        ) : (
          <div /> // Spacer
        )}
        
        <div className="flex items-center gap-4">
          {!isLastStep && (
            <button
              {...skipProps}
              className="text-xs font-bold uppercase tracking-widest text-marlboro-red hover:text-ink-black transition-colors"
            >
              Skip
            </button>
          )}
          <button
            {...primaryProps}
            className="bg-marlboro-red text-paper-white font-bold px-4 py-2 uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] border-[3px] border-ink-black active:translate-y-1 active:shadow-none transition-all"
          >
            {isLastStep ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
