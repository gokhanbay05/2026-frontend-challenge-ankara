import React from "react";

export default function SummaryCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-background border border-border/60 p-5 rounded-ui shadow-soft hover:border-primary/40 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <Icon size={20} className={colorClass} />
      </div>
      <div className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
        {value || "---"}
      </div>
    </div>
  );
}
