import React, { useEffect } from "react";
import useModalStore from "../../store/useModalStore";
import { X } from "lucide-react";
import Button from "../ui/Button";

export default function Modal() {
  const { isOpen, content, title, closeModal } = useModalStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={closeModal}
      />

      <div
        className="relative bg-background border border-border w-full max-w-lg rounded-ui shadow-2xl overflow-hidden 
      animate-in fade-in zoom-in-90 slide-in-from-bottom-10 duration-300 ease-out"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-bold text-lg leading-none tracking-tight">
            {title}
          </h3>
          <Button
            variant="ghost"
            onClick={closeModal}
            className="p-1 h-8 w-8 min-w-0 rounded-full hover:bg-muted"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
          {content}
        </div>
      </div>
    </div>
  );
}
