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
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <main className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Uncharted
          </h1>
          <p className="text-xl text-gray-500">Is your idea original?</p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your idea, question, or thought..."
              className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-butter focus:ring-2 focus:ring-butter/30"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full py-4 rounded-2xl bg-butter text-gray-900 font-semibold text-lg transition-all hover:bg-butter-dark disabled:opacity-40 disabled:cursor-not-allowed"
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
              className={`text-6xl font-bold mb-4 ${
                result.isOriginal ? "text-green-500" : "text-red-400"
              }`}
            >
              {result.isOriginal ? "Yes" : "No"}
            </div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
              {result.explanation}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center animate-fade-in">{error}</p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pb-8 pt-12 text-sm text-gray-400">
        Think first.
      </footer>
    </div>
  );
}
