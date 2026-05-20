"use client";

import { useState } from "react";

export function EmbedCodeCopy({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      className="border border-black bg-uga-dark px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-uga-green"
      onClick={copyCode}
      type="button"
    >
      {copied ? "Copied" : "Copy code"}
    </button>
  );
}
