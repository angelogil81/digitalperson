import { Link, useLocation } from "@tanstack/react-router";
import { Home, Dumbbell, Apple, TrendingUp, User } from "lucide-react";

const items = [
  { to: "/app", label: "Início", icon: Home, exact: true },
  { to: "/app/workout", label: "Treino", icon: Dumbbell },
  { to: "/app/nutrition", label: "Dieta", icon: Apple },
  { to: "/app/progress", label: "Evolução", icon: TrendingUp },
  { to: "/app/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md px-4 pb-4 pt-2">
      <div className="glass flex items-center justify-between rounded-3xl px-2 py-2 shadow-elevated">
        {items.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-all ${
                active ? "bg-primary text-primary-foreground shadow-lime" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "" : ""}`} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
