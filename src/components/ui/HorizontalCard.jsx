import React from "react";
import Button from "./Button";

export default function HorizontalCard({
  title,
  description,
  buttonText = "Detail",
  bVariant = "outline",
  onButtonClick,
  isCompact = false,
  className = "",
}) {
  return (
    <div
      className={`group bg-background border border-border rounded-ui transition-all duration-200 hover:border-primary/50 flex items-center p-4 gap-4 hover:shadow-lg ${className}`}
    >
      <div
        className={`${isCompact ? "flex-1" : "w-24 sm:w-40"} shrink-0 min-w-0`}
      >
        <h3 className="text-sm font-bold text-foreground truncate">{title}</h3>
      </div>

      {!isCompact && (
        <>
          <div className="hidden sm:block h-6 w-px bg-border/60 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-sm truncate">
              {description}
            </p>
          </div>
        </>
      )}

      <div className="shrink-0 ml-auto">
        <Button
          variant={bVariant}
          className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs rounded-md"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
