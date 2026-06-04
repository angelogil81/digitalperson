import type { ReactNode } from "react";
import { useStore } from "@/lib/pd-store";

export function Shell({ children }: { children: ReactNode }) {
  const { plan } = useStore();
  const isBasic = plan?.tier !== "premium";
  // Extra bottom padding when the 320x50 ad footer is visible
  const pad = isBasic ? "pb-48" : "pb-32";
  return (
    <div className={`mx-auto min-h-screen max-w-md px-5 pt-6 ${pad}`}>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-gradient-card rounded-3xl border border-border/60 p-5 shadow-elevated ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}
