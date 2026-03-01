"use client";

import { DocTypeConfig } from "@/lib/docTypes";

interface Props {
  config: DocTypeConfig;
  onClick: () => void;
}

export default function DocTypeCard({ config, onClick }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex-1">
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#032147" }}>
          {config.name}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#888888" }}>
          {config.description}
        </p>
      </div>
      <button
        onClick={onClick}
        className="w-full py-2 text-white text-xs font-semibold rounded-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#209dd7" }}
      >
        Draft this
      </button>
    </div>
  );
}
