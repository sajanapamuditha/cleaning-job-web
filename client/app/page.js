"use client";

import { useEffect, useState } from "react";
import { listJobs } from "@/services/api";
import JobCard from "@/components/JobCard";
import Link from "next/link";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery"];
const STATUSES = ["Open", "In Progress", "Closed"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    listJobs({ category, status })
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, status]);

  return (
    <div>
      {/* Hero banner */}
      <section className="bg-teal-600 rounded-3xl p-8 sm:p-12 text-white mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="relative max-w-xl">
          <p className="text-teal-200 text-sm font-medium mb-2">⚡ Local trades, on demand</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Find help, fast.</h1>
          <p className="text-teal-100 mb-6">
            Browse open jobs from homeowners in your area — from leaking taps to fitted wardrobes.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end shadow-sm">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          >
            <option value="">Any status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setCategory(""); setStatus(""); }}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>

      {/* Job list */}
      {loading && (
        <p className="text-sm text-gray-400 text-center py-12">Loading…</p>
      )}
      {error && (
        <p className="text-sm text-red-500 text-center py-12">Error: {error}</p>
      )}
      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">No requests match your filters.</p>
          <Link href="/jobs/new" className="text-teal-600 text-sm font-medium hover:underline">
            Post the first one →
          </Link>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}
