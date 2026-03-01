"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    router.push("/select");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold"
            style={{ color: "#032147" }}
          >
            Prelegal
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#888888" }}>
            Legal agreements, simplified
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2
            className="text-xl font-semibold mb-6"
            style={{ color: "#032147" }}
          >
            Sign in to your account
          </h2>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ focusRingColor: "#209dd7" } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white font-semibold py-2.5 rounded-lg text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#753991" }}
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-xs" style={{ color: "#888888" }}>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/select")}
              className="underline"
              style={{ color: "#209dd7" }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
