"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MNDAFormData, defaultFormData, PartyDetails } from "@/lib/types";

function PartySection({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyDetails;
  onChange: (field: keyof PartyDetails, value: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-700 mb-3">{label}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Full Name / Signatory Name
          </label>
          <input
            type="text"
            value={party.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Jane Smith"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Title
          </label>
          <input
            type="text"
            value={party.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="CEO"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={party.company}
            onChange={(e) => onChange("company", e.target.value)}
            placeholder="Acme Corp"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Notice Address
          </label>
          <input
            type="text"
            value={party.noticeAddress}
            onChange={(e) => onChange("noticeAddress", e.target.value)}
            placeholder="123 Main St, City, State 12345"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState<MNDAFormData>(() => ({
    ...defaultFormData,
    effectiveDate: new Date().toISOString().split("T")[0],
  }));
  const [errors, setErrors] = useState<string[]>([]);

  function setField<K extends keyof MNDAFormData>(key: K, value: MNDAFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setPartyField(
    party: "party1" | "party2",
    field: keyof PartyDetails,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [party]: { ...prev[party], [field]: value },
    }));
  }

  function handlePreview() {
    const missing: string[] = [];
    if (!form.party1.name) missing.push("Party 1 name");
    if (!form.party1.company) missing.push("Party 1 company");
    if (!form.party2.name) missing.push("Party 2 name");
    if (!form.party2.company) missing.push("Party 2 company");
    if (!form.governingLaw) missing.push("Governing law");
    if (!form.jurisdiction) missing.push("Jurisdiction");
    if (missing.length) {
      setErrors(missing);
      return;
    }
    setErrors([]);
    try {
      localStorage.setItem("mndaFormData", JSON.stringify(form));
    } catch {
      // Storage unavailable — proceed anyway; preview will use in-memory data
      sessionStorage?.setItem("mndaFormData", JSON.stringify(form));
    }
    router.push("/preview");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mutual NDA Creator
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Fill in the details below to generate your Mutual Non-Disclosure
            Agreement based on the{" "}
            <a
              href="https://commonpaper.com/standards/mutual-nda/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Common Paper standard
            </a>
            .
          </p>
        </div>

        <div className="space-y-6">
          {/* Purpose */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Purpose</h2>
            <p className="text-xs text-gray-500 mb-2">
              How Confidential Information may be used
            </p>
            <textarea
              rows={3}
              value={form.purpose}
              onChange={(e) => setField("purpose", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </section>

          {/* Effective Date */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Effective Date</h2>
            <input
              type="date"
              value={form.effectiveDate}
              onChange={(e) => setField("effectiveDate", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          {/* MNDA Term */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-1">MNDA Term</h2>
            <p className="text-xs text-gray-500 mb-3">
              The length of this MNDA
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="mndaTermType"
                  value="expires"
                  checked={form.mndaTermType === "expires"}
                  onChange={() => setField("mndaTermType", "expires")}
                  className="accent-blue-600"
                />
                Expires after a fixed number of years
              </label>
              {form.mndaTermType === "expires" && (
                <div className="ml-6 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.mndaTermYears}
                    onChange={(e) => setField("mndaTermYears", e.target.value)}
                    className="w-20 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">year(s)</span>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="mndaTermType"
                  value="ongoing"
                  checked={form.mndaTermType === "ongoing"}
                  onChange={() => setField("mndaTermType", "ongoing")}
                  className="accent-blue-600"
                />
                Ongoing (until terminated)
              </label>
            </div>
          </section>

          {/* Term of Confidentiality */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-1">
              Term of Confidentiality
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              How long Confidential Information is protected
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="confidentialityTermType"
                  value="fixed"
                  checked={form.confidentialityTermType === "fixed"}
                  onChange={() => setField("confidentialityTermType", "fixed")}
                  className="accent-blue-600"
                />
                Fixed number of years from Effective Date
              </label>
              {form.confidentialityTermType === "fixed" && (
                <div className="ml-6 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.confidentialityTermYears}
                    onChange={(e) =>
                      setField("confidentialityTermYears", e.target.value)
                    }
                    className="w-20 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">year(s)</span>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="confidentialityTermType"
                  value="perpetuity"
                  checked={form.confidentialityTermType === "perpetuity"}
                  onChange={() =>
                    setField("confidentialityTermType", "perpetuity")
                  }
                  className="accent-blue-600"
                />
                In perpetuity
              </label>
            </div>
          </section>

          {/* Governing Law & Jurisdiction */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">
              Governing Law &amp; Jurisdiction
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Governing Law (State)
                </label>
                <input
                  type="text"
                  value={form.governingLaw}
                  onChange={(e) => setField("governingLaw", e.target.value)}
                  placeholder="e.g. Delaware"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Jurisdiction
                </label>
                <input
                  type="text"
                  value={form.jurisdiction}
                  onChange={(e) => setField("jurisdiction", e.target.value)}
                  placeholder="e.g. Wilmington, Delaware"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Parties */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Parties</h2>
            <div className="space-y-4">
              <PartySection
                label="Party 1"
                party={form.party1}
                onChange={(field, value) =>
                  setPartyField("party1", field, value)
                }
              />
              <PartySection
                label="Party 2"
                party={form.party2}
                onChange={(field, value) =>
                  setPartyField("party2", field, value)
                }
              />
            </div>
          </section>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <p className="font-medium mb-1">Please fill in the required fields:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handlePreview}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Preview &amp; Download NDA →
          </button>
        </div>
      </div>
    </main>
  );
}
