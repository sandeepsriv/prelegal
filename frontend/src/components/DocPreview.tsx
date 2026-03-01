"use client";

import { useEffect, useState } from "react";
import { DocFields } from "@/lib/docTypes";

interface Props {
  docType: string;
  fields: DocFields;
}

export default function DocPreview({ docType, fields }: Props) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doc_type: docType, fields }),
        });
        if (!res.ok) throw new Error("Preview fetch failed");
        const data = await res.json();
        setHtml(data.html);
      } catch {
        setHtml("<p><em>Preview unavailable. Please try again.</em></p>");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [docType, fields]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-2">
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>
    );
  }

  return (
    <div
      className="doc-preview prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
