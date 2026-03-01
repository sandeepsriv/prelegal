"use client";

import { useEffect, useRef, useState } from "react";
import { DocFields } from "@/lib/docTypes";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  docType: string;
  fields: DocFields;
  onFieldsUpdate: (partial: DocFields) => void;
  onDocTypeDetected?: (docType: string) => void;
}

function welcomeText(docType: string): string {
  if (docType === "unknown") {
    return "Tell me what kind of legal agreement you need and I'll identify the right document for you.";
  }
  return "Chat with our AI to draft your document. The preview will fill in automatically as we gather the details.";
}

function startMessage(docType: string): string {
  if (docType === "unknown") {
    return "Hello, I need help figuring out which legal document I need.";
  }
  return "Hello, I need help drafting a legal document.";
}

export default function ChatPanel({ docType, fields, onFieldsUpdate, onDocTypeDetected }: Props) {
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
          fields,
          doc_type: docType,
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
            onFieldsUpdate(payload.data);
          } else if (payload.type === "doc_type") {
            onDocTypeDetected?.(payload.data);
          }
        }
      }
    } catch {
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
    await sendMessage(startMessage(docType), []);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await sendMessage(text, messages);
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#032147" }}>
            AI Legal Assistant
          </h2>
          <p className="text-sm" style={{ color: "#888888" }}>
            {welcomeText(docType)}
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
