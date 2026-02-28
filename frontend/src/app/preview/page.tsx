"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MNDAFormData, defaultFormData } from "@/lib/types";
import MNDAPreview from "@/components/MNDAPreview";

function loadFromStorage(): MNDAFormData | null {
  try {
    const stored =
      localStorage.getItem("mndaFormData") ??
      sessionStorage?.getItem("mndaFormData");
    if (stored) return JSON.parse(stored) as MNDAFormData;
  } catch {}
  return null;
}

export default function PreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<MNDAFormData>(() => {
    // Runs only in the browser (this is a client component), so localStorage is safe here.
    return loadFromStorage() ?? defaultFormData;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored) {
      router.replace("/");
      return;
    }
    setData(stored);
    setReady(true);
  }, [router]);

  function handleDownload() {
    window.print();
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    );
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
      <div className="py-10 px-4 bg-gray-50 min-h-screen print:bg-white print:p-0">
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 max-w-3xl mx-auto print:shadow-none print:border-none print:rounded-none print:p-0">
          <MNDAPreview data={data} />
        </div>
      </div>
    </>
  );
}
