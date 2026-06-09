'use client';
import { useState } from 'react';

export default function CopyField({ value }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="shrink-0 text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
    >
      {copied ? '✓ Copiado' : 'Copiar / Copy'}
    </button>
  );
}
