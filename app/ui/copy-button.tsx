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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 border rounded-md"
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