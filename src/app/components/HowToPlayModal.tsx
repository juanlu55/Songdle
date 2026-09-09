"use client";

import type { ReactNode } from "react";

export default function HowToPlayModal({
  title = "Cómo Jugar",
  children,
  onClose,
}: {
  title?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
          <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-2xl font-black hover:scale-110 transition-transform">
            ✕
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-black text-white border-4 border-black font-black uppercase tracking-wide hover:bg-black/90 transition-all"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
}
