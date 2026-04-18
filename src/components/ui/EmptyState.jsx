import React from "react";
import { SearchX, Database } from "lucide-react";

export default function EmptyState({
  title = "No results found",
  message,
  type = "search",
  className = "",
}) {
  const Icon = type === "search" ? SearchX : Database;

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
        <div className="relative p-6 bg-muted/30 border border-border/50 rounded-full text-muted-foreground/60 group-hover:text-primary transition-colors">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      </div>

      <div className="max-w-xs space-y-2">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message ||
            (type === "search"
              ? "We couldn't find what you're looking for. Please check your spelling or try different keywords."
              : "There is currently no data to display in this section.")}
        </p>
      </div>
    </div>
  );
}
