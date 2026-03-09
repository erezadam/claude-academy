"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 left-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
    >
      {copied ? "הועתק!" : "העתק"}
    </button>
  );
}
