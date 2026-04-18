import React from "react";
import Button from "./Button";
import { MoveRight } from "lucide-react";

export default function Card({
  image,
  title,
  description,
  buttonText = "Detail",
  bVariant = "primary",
  onButtonClick,
  className = "",
}) {
  return (
    <div
      className={`group bg-background border border-border rounded-ui overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg flex flex-col h-full ${className}`}
    >
      <div className="relative aspect-video overflow-hidden bg-muted/20 flex-shrink-0 border-b border-border/50">
        <img
          src={
            image ||
            `https://placehold.co/600x400/252525/FFFFFF/png?text=No+Image`
          }
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="space-y-3 flex-grow">
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-border/50 flex justify-end">
          <Button
            variant={bVariant}
            className="py-2.5 text-sm min-w-[120px]"
            onClick={onButtonClick}
            animated={true}
            icon={MoveRight}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
