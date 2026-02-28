"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MNDAFormData, defaultFormData } from "@/lib/types";
import MNDAPreview from "@/components/MNDAPreview";

export default function PreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<MNDAFormData>(defaultFormData);

  useEffect(() => {
    const stored = localStorage.getItem("mndaFormData");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // fall back to defaults
      }
    }
  }, []);

  function handleDownload() {
    window.print();
  }

  return (
    <>
      {/* Toolbar — hidden when printing */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          ← Back to form
        </button>
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* Document */}
      <div className="py-10 px-4 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 max-w-3xl mx-auto">
          <MNDAPreview data={data} />
        </div>
      </div>
    </>
  );
}
