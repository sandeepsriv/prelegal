"use client";

import { useRouter } from "next/navigation";
import { DOC_TYPES } from "@/lib/docTypes";
import DocTypeCard from "@/components/DocTypeCard";

export default function SelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#032147" }}>
            Prelegal
          </h1>
          <p className="text-xs" style={{ color: "#888888" }}>
            Legal agreements, simplified
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Sign out
        </button>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#032147" }}>
            Choose your document
          </h2>
          <p className="text-sm" style={{ color: "#888888" }}>
            Select the type of legal agreement you want to draft. Our AI will guide you through the process.
          </p>
        </div>

        {/* Document type grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {DOC_TYPES.map((config) => (
            <DocTypeCard
              key={config.key}
              config={config}
              onClick={() => router.push(`/dashboard?doc=${config.key}`)}
            />
          ))}
        </div>

        {/* Not sure card */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-between gap-4 bg-white">
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "#032147" }}>
              Not sure which document you need?
            </h3>
            <p className="text-xs" style={{ color: "#888888" }}>
              Describe what you&apos;re trying to accomplish and our AI will identify the right agreement for you.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard?doc=unknown")}
            className="shrink-0 px-5 py-2 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#753991" }}
          >
            Get AI help
          </button>
        </div>
      </main>
    </div>
  );
}
