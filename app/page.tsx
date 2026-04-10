"use client";

import { useState, FormEvent } from "react";

type Result = {
  isOriginal: boolean;
  explanation: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to check originality.");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-6 bg-light-blue">
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-6xl font-semibold tracking-wide text-navy italic">
            Uncharted
          </h1>
          <p className="text-2xl font-light text-navy/70 tracking-widest uppercase text-sm">
            Is your idea original?
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your idea, question, or thought..."
              className="w-full px-6 py-4 text-lg rounded-2xl border border-navy/20 bg-white/60 text-navy placeholder-navy/40 outline-none transition-all focus:border-navy/50 focus:ring-2 focus:ring-navy/10 backdrop-blur-sm"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full py-4 rounded-2xl bg-eggshell text-navy font-semibold text-lg tracking-wide transition-all hover:bg-eggshell-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Thinking...
              </span>
            ) : (
              "Find out"
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="w-full text-center animate-fade-in">
            <div
              className={`text-7xl font-semibold italic mb-4 ${
                result.isOriginal ? "text-green-600" : "text-navy"
              }`}
            >
              {result.isOriginal ? "Yes." : "No."}
            </div>
            <p className="text-lg font-light text-navy/80 leading-relaxed max-w-lg mx-auto">
              {result.explanation}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center animate-fade-in">{error}</p>
        )}
      </main>

      {/* Footer */}
      <footer className="pb-8 pt-12 text-sm text-navy/40 text-center">
        <p className="tracking-widest uppercase text-xs">Think first.</p>
        <p className="mt-1">© {new Date().getFullYear()} Charlotte Siller. All rights reserved.</p>
      </footer>
    </div>
  );
}
