import React from "react";
import { ChevronDown } from "lucide-react";

export default function Select({ options, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative group min-w-[160px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-border/60 hover:border-primary/50 px-4 py-2 pr-10 rounded-ui text-xs font-bold appearance-none cursor-pointer transition-all outline-none focus:ring-2 focus:ring-primary/20"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}
