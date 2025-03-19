"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ButtonWithFeedbackProps {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loadingText?: string;
  successText?: string;
  errorText?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function ButtonWithFeedback({
  children,
  onClick,
  className,
  variant = "default",
  size = "default",
  loadingText = "Processing...",
  successText = "Success!",
  errorText = "Error",
  disabled = false,
  type = "button",
}: ButtonWithFeedbackProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [animating, setAnimating] = useState(false);

  const handleClick = async () => {
    if (status === "loading") return;

    setStatus("loading");
    try {
      await onClick();
      setStatus("success");
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setTimeout(() => setStatus("idle"), 300);
      }, 1000);
    } catch (error) {
      setStatus("error");
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setTimeout(() => setStatus("idle"), 300);
      }, 1000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      type={type}
      className={cn(
        "relative overflow-hidden transition-all duration-200 active:scale-95",
        status === "loading" && "cursor-wait",
        status === "success" && "bg-green-600 hover:bg-green-700 text-white",
        status === "error" && "bg-red-600 hover:bg-red-700 text-white",
        animating && "animate-pulse",
        className,
      )}
      onClick={handleClick}
      disabled={disabled || status === "loading"}
    >
      {status === "idle" && children}
      {status === "loading" && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          {successText}
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          {errorText}
        </>
      )}
    </Button>
  );
}
