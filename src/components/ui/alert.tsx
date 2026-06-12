import type React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "warning" | "danger" | "success" }) {
  const variants = {
    default: "border-slate-200 bg-white",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900"
  };
  return <div className={cn("rounded-xl border p-4 text-sm", variants[variant], className)} {...props} />;
}
