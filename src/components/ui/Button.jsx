import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  animated = false,
  ...props
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-soft",
    secondary:
      "bg-secondary text-secondary-foreground hover:opacity-90 shadow-soft",
    outline:
      "border-2 border-primary text-foreground hover:text-primary-foreground hover:bg-primary bg-transparent",
    outlineSecondary:
      "border-2 border-secondary text-foreground hover:text-secondary-foreground hover:bg-secondary bg-transparent",
    ghost: "text-foreground hover:bg-muted bg-transparent",
  };

  const defaultStyles = `${!className.includes("rounded") ? "rounded-ui" : ""} 
                           ${!className.includes("p-") ? "px-6 py-2" : ""}`;

  const baseStyles = `relative transition-all duration-300 cursor-pointer font-medium active:scale-95 flex items-center justify-center select-none transform-gpu will-change-transform 
                        ${animated ? "overflow-hidden group/btn" : ""}`;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${defaultStyles} ${className}`}
      {...props}
    >
      {animated && Icon ? (
        <>
          <span className="inline-flex items-center transition-all duration-300 group-hover/btn:translate-x-10 group-hover/btn:opacity-0">
            {children}
          </span>
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 -translate-x-10 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
            <Icon className="w-5 h-5" />
          </div>
        </>
      ) : (
        <>
          {children}
          {Icon && <Icon className="ml-2 w-4 h-4" />}
        </>
      )}
    </button>
  );
}
