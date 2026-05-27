import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// KpiCard
export const KpiCard = ({ label, value, subLabel, trend, details }: any) => (
  <div className="border border-border-default p-4 bg-white hover:bg-bg-secondary/30 transition-colors">
    <div className="all-caps-label text-[10px] mb-1">{label}</div>
    <div className="text-[28px] font-semibold tracking-tight text-text-primary tabular-nums leading-none mb-1">{value}</div>
    {subLabel && <div className="text-[11px] text-text-secondary">{subLabel}</div>}
    {details && (
      <div className="mt-4 space-y-2">
        {details.map((d: any, i: number) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />
              {d.label}
            </div>
            <div className="font-semibold text-text-primary tabular-nums">{d.value}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// StatusChip
export const StatusChip = ({ status }: { status: string }) => {
  const styles: any = {
    CRITICAL: "bg-[#FDECEC] text-[#E14B4B]",
    SUCCESS: "bg-[#E8F7EF] text-[#2FBF71]",
    WARNING: "bg-[#FCF3E0] text-[#E7A53A]",
    INFO: "bg-[#E8F1FC] text-[#4A90E2]",
    NEUTRAL: "bg-bg-secondary text-text-secondary",
    ACTIVE: "bg-[#E8F7EF] text-[#2FBF71]",
    OFFLINE: "bg-bg-secondary text-text-tertiary"
  };
  return (
    <span className={cn(
      "inline-flex items-center h-5 px-2 rounded-[2px] text-[10px] font-bold uppercase tracking-wider",
      styles[status] || styles.NEUTRAL
    )}>
      {status}
    </span>
  );
};

// Button
export const Button = ({ variant = 'primary', children, className, icon: Icon, ...props }: any) => {
  const v = {
    primary: "bg-bg-dark text-white hover:bg-bg-dark-2",
    secondary: "bg-white border border-border-default text-text-primary hover:bg-bg-hover",
    danger: "bg-status-critical text-white hover:opacity-90"
  };
  return (
    <button className={cn(
      "h-9 px-4 rounded-[4px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
      v[variant as keyof typeof v],
      className
    )} {...props}>
      {children}
      {Icon && <Icon size={14} />}
    </button>
  );
};

// SectionTitle
export const SectionTitle = ({ children, className }: any) => (
  <h3 className={cn("text-[12px] font-bold uppercase tracking-wider text-text-primary mb-3", className)}>
    {children}
  </h3>
);

// SummaryRow
export const SummaryRow = ({ label, value, color }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-border-default last:border-0 grow">
    <span className="text-[11px] text-text-secondary uppercase font-medium">{label}</span>
    <span className={cn("text-[12px] font-bold tabular-nums", color || "text-text-primary")}>{value}</span>
  </div>
);
