"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MNDAFormData, defaultFormData } from "@/lib/types";
import ChatPanel from "@/components/ChatPanel";
import MNDAPreview from "@/components/MNDAPreview";

export default function DashboardPage() {
  const router = useRouter();
  const [form, setForm] = useState<MNDAFormData>({
    ...defaultFormData,
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  function handleFieldsUpdate(partial: Partial<MNDAFormData>) {
    setForm((prev) => {
      const next = { ...prev, ...partial };
      if (partial.party1) next.party1 = { ...prev.party1, ...partial.party1 };
      if (partial.party2) next.party2 = { ...prev.party2, ...partial.party2 };
      return next;
    });
  }

  function handleDownload() {
    try {
      localStorage.setItem("mndaFormData", JSON.stringify(form));
    } catch {
      sessionStorage?.setItem("mndaFormData", JSON.stringify(form));
    }
    router.push("/preview");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#032147" }}>
            Mutual NDA Creator
          </h1>
          <p className="text-xs" style={{ color: "#888888" }}>
            Powered by Common Paper standard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#753991" }}
          >
            Preview &amp; Download PDF
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-gray-50">
          <ChatPanel fields={form} onFieldsUpdate={handleFieldsUpdate} />
        </div>

        {/* Live preview panel */}
        <div className="w-1/2 overflow-y-auto bg-white">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 z-10">
            <p className="text-xs font-medium" style={{ color: "#888888" }}>
              Live Document Preview
            </p>
          </div>
          <div className="p-6">
            <MNDAPreview data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
