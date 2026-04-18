import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Button from "../ui/Button";
import LoadingSpinner from "./LoadingSpinner";
import ErrorPage from "./ErrorPage";

export default function PageLayout({
  children,
  title,
  description,
  showBackButton = false,
  loading = false,
  error = null,
  onRetry,
  actions,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 ${className}`}>
      {(title || showBackButton || actions) && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="p-2 h-10 w-10 shrink-0"
                  disabled={loading}
                >
                  <ArrowLeft size={20} />
                </Button>
              )}

              {title && (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-none">
                      {title}
                    </h1>
                  </div>
                  {description && (
                    <p className="text-muted-foreground text-sm">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-auto min-w-[300px]">{actions}</div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      )}

      <main className="relative min-h-[400px]">
        {error ? (
          <div className="py-12">
            <ErrorPage message={error} onRetry={onRetry} />
          </div>
        ) : loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
