"use client";

import { useEffect, useRef, useState } from "react";
import { MNDAFormData } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  fields: MNDAFormData;
  onFieldsUpdate: (partial: Partial<MNDAFormData>) => void;
}

function fieldsToFormData(raw: Record<string, string>): Partial<MNDAFormData> {
  const out: Partial<MNDAFormData> = {};
  if (raw.purpose !== undefined) out.purpose = raw.purpose;
  if (raw.effectiveDate !== undefined) out.effectiveDate = raw.effectiveDate;
  if (raw.mndaTermType !== undefined)
    out.mndaTermType = raw.mndaTermType as "expires" | "ongoing";
  if (raw.mndaTermYears !== undefined) out.mndaTermYears = raw.mndaTermYears;
  if (raw.confidentialityTermType !== undefined)
    out.confidentialityTermType = raw.confidentialityTermType as "fixed" | "perpetuity";
  if (raw.confidentialityTermYears !== undefined)
    out.confidentialityTermYears = raw.confidentialityTermYears;
  if (raw.governingLaw !== undefined) out.governingLaw = raw.governingLaw;
  if (raw.jurisdiction !== undefined) out.jurisdiction = raw.jurisdiction;

  const p1: Partial<MNDAFormData["party1"]> = {};
  if (raw.party1Name !== undefined) p1.name = raw.party1Name;
  if (raw.party1Title !== undefined) p1.title = raw.party1Title;
  if (raw.party1Company !== undefined) p1.company = raw.party1Company;
  if (raw.party1NoticeAddress !== undefined) p1.noticeAddress = raw.party1NoticeAddress;
  if (Object.keys(p1).length > 0) out.party1 = { ...({} as MNDAFormData["party1"]), ...p1 };

  const p2: Partial<MNDAFormData["party2"]> = {};
  if (raw.party2Name !== undefined) p2.name = raw.party2Name;
  if (raw.party2Title !== undefined) p2.title = raw.party2Title;
  if (raw.party2Company !== undefined) p2.company = raw.party2Company;
  if (raw.party2NoticeAddress !== undefined) p2.noticeAddress = raw.party2NoticeAddress;
  if (Object.keys(p2).length > 0) out.party2 = { ...({} as MNDAFormData["party2"]), ...p2 };

  return out;
}

export default function ChatPanel({ fields, onFieldsUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(userText: string, history: Message[]) {
    const allMessages = [...history, { role: "user" as const, content: userText }];
    setMessages(allMessages);
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          fields: flattenFields(fields),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6));

          if (payload.type === "text") {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + payload.delta,
              };
              return updated;
            });
          } else if (payload.type === "fields") {
            onFieldsUpdate(fieldsToFormData(payload.data));
          }
        }
      }
    } catch {
      // Replace the empty assistant placeholder with an error message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    setStarted(true);
    await sendMessage("Hello, I need help drafting an NDA.", []);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await sendMessage(text, messages);
  }

  function flattenFields(f: MNDAFormData): Record<string, string> {
    return {
      purpose: f.purpose,
      effectiveDate: f.effectiveDate,
      mndaTermType: f.mndaTermType,
      mndaTermYears: f.mndaTermYears,
      confidentialityTermType: f.confidentialityTermType,
      confidentialityTermYears: f.confidentialityTermYears,
      governingLaw: f.governingLaw,
      jurisdiction: f.jurisdiction,
      party1Name: f.party1.name,
      party1Title: f.party1.title,
      party1Company: f.party1.company,
      party1NoticeAddress: f.party1.noticeAddress,
      party2Name: f.party2.name,
      party2Title: f.party2.title,
      party2Company: f.party2.company,
      party2NoticeAddress: f.party2.noticeAddress,
    };
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#032147" }}>
            AI-Powered NDA Assistant
          </h2>
          <p className="text-sm" style={{ color: "#888888" }}>
            Chat with our AI to draft your Mutual NDA. The document will fill in
            automatically as we gather the details.
          </p>
        </div>
        <button
          onClick={handleStart}
          className="px-6 py-3 text-white font-semibold rounded-xl text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#753991" }}
        >
          Start Drafting
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
              }`}
              style={
                msg.role === "user" ? { backgroundColor: "#209dd7" } : undefined
              }
            >
              {msg.content || (
                <span className="animate-pulse text-gray-400">Thinking...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-2 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#753991" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
