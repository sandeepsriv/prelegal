"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DocFields } from "@/lib/docTypes";
import DocPreview from "@/components/DocPreview";

interface DocSession {
  docType: string;
  fields: DocFields;
}

function loadFromStorage(): DocSession | null {
  try {
    const stored =
      localStorage.getItem("docSession") ??
      sessionStorage?.getItem("docSession");
    if (stored) return JSON.parse(stored) as DocSession;
  } catch {}
  return null;
}

export default function PreviewPage() {
  const router = useRouter();
  const initial = loadFromStorage();
  const [session, setSession] = useState<DocSession | null>(initial);
  const [ready, setReady] = useState(!!initial);

  useEffect(() => {
    if (!session) {
      router.replace("/select");
    }
  }, [router, session]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Toolbar — hidden when printing */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push(`/dashboard?doc=${session!.docType}`)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          ← Back to document
        </button>
        <button
          onClick={() => window.print()}
          className="text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: "#209dd7" }}
        >
          Download PDF
        </button>
      </div>

      {/* Document */}
      <div className="py-10 px-4 bg-gray-50 min-h-screen print:bg-white print:p-0">
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 max-w-3xl mx-auto print:shadow-none print:border-none print:rounded-none print:p-0">
          <DocPreview docType={session!.docType} fields={session!.fields} />
        </div>
      </div>
    </>
  );
}
