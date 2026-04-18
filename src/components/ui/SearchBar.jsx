import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  containerClassName = "",

  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const defaultDefaultStyles = `
        ${!className.includes("rounded") ? "rounded-ui" : ""}
        ${!className.includes("p-") ? "pl-11 pr-4 py-2.5" : ""}
    `;

  const inputBaseStyles =
    "w-full bg-muted/30 text-foreground placeholder:text-muted-foreground border border-border/60 transition-all duration-300 ease-in-out focus:bg-background focus:border-primary focus:ring-2 focus:ring-ring outline-none font-medium";

  return (
    <div className={`relative flex items-center group ${containerClassName}`}>
      <div
        className={`absolute left-4 transition-all duration-300 ease-in-out ${isFocused ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"}`}
      >
        <Search size={18} strokeWidth={2.5} />
      </div>

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`${inputBaseStyles} ${defaultDefaultStyles} ${className}`}
        {...props}
      />

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ease-in-out ${isFocused ? "w-[90%]" : "w-0"}`}
      />
    </div>
  );
}
