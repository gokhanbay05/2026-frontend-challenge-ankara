import React from "react";
import Button from "../ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorPage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-6">
      <div className="p-4 bg-destructive/10 text-destructive rounded-full">
        <AlertCircle size={48} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {message || "Something went wrong. Try again"}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="ghost"
          onClick={onRetry}
          className="p-2 h-10 w-10 shrink-0"
        >
          <RefreshCw size={18} />
        </Button>
      )}
    </div>
  );
}
