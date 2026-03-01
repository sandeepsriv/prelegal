"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DocFields, DOC_TYPES } from "@/lib/docTypes";
import ChatPanel from "@/components/ChatPanel";
import DocPreview from "@/components/DocPreview";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDocType = searchParams.get("doc") ?? "mnda";

  const [fields, setFields] = useState<DocFields>({});
  const [activeDocType, setActiveDocType] = useState(initialDocType);

  const docConfig = DOC_TYPES.find((d) => d.key === activeDocType);
  const docName = docConfig?.name ?? "Document";

  function handleFieldsUpdate(partial: DocFields) {
    setFields((prev) => ({ ...prev, ...partial }));
  }

  function handleDocTypeDetected(detectedType: string) {
    setActiveDocType(detectedType);
    setFields({});
  }

  function handleDownload() {
    try {
      localStorage.setItem(
        "docSession",
        JSON.stringify({ docType: activeDocType, fields })
      );
    } catch {
      sessionStorage?.setItem(
        "docSession",
        JSON.stringify({ docType: activeDocType, fields })
      );
    }
    router.push("/preview");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#032147" }}>
            {activeDocType === "unknown" ? "Finding your document..." : docName}
          </h1>
          <p className="text-xs" style={{ color: "#888888" }}>
            Powered by Common Paper standard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/select")}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Change document
          </button>
          {activeDocType !== "unknown" && (
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#753991" }}
            >
              Preview &amp; Download PDF
            </button>
          )}
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
          <ChatPanel
            docType={activeDocType}
            fields={fields}
            onFieldsUpdate={handleFieldsUpdate}
            onDocTypeDetected={handleDocTypeDetected}
          />
        </div>

        {/* Live preview panel */}
        <div className="w-1/2 overflow-y-auto bg-white">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 z-10">
            <p className="text-xs font-medium" style={{ color: "#888888" }}>
              Live Document Preview
            </p>
          </div>
          <div className="p-6">
            {activeDocType === "unknown" ? (
              <div className="text-center py-12 text-sm" style={{ color: "#888888" }}>
                <p>Tell our AI what you need and the preview will appear here.</p>
              </div>
            ) : (
              <DocPreview docType={activeDocType} fields={fields} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
