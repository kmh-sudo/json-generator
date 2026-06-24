"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CopyButton({
  text,
}: {
  text: string;
}) {
  const [copied, setCopied] =
    useState(false);
  const disabled = text.trim().length === 0;

  const handleCopy = async () => {
    if (disabled) return;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/10"
      aria-label={copied ? "Copied" : "Copy output"}
    >
      {copied ? (
        <Check size={16} />
      ) : (
        <Copy size={16} />
      )}

      {copied ? "Copied" : "Copy"}
    </button>
  );
}
