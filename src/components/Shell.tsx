import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-32 pt-6">
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
