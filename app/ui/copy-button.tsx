"use client";

import { AlertCircle, Check, Copy, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
    "idle"
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disabled = text.trim().length === 0;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (disabled || status === "copying") return;

    setStatus("copying");

    try {
      await copyToClipboard(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const buttonLabel =
    status === "copied" ? copiedLabel : status === "error" ? "Copy failed" : label;

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled || status === "copying"}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/10"
        aria-label={buttonLabel}
      >
        {status === "copying" ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : status === "copied" ? (
          <Check size={16} />
        ) : status === "error" ? (
          <AlertCircle size={16} />
        ) : (
          <Copy size={16} />
        )}

        {buttonLabel}
      </button>

      {(status === "copied" || status === "error") && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/95 px-4 py-2 text-sm font-medium text-slate-100 shadow-2xl shadow-black/50 backdrop-blur"
        >
          {status === "copied"
            ? "Copied to clipboard"
            : "Clipboard unavailable. Select and copy manually."}
        </div>
      )}
    </>
  );
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy failed");
  }
}
