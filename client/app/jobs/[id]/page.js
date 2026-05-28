"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getJob, updateStatus, deleteJob } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

const STATUSES = ["Open", "In Progress", "Closed"];

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function onStatusChange(e) {
    const next = e.target.value;
    setBusy(true);
    setMessage("");
    try {
      const updated = await updateStatus(id, next);
      setJob(updated);
      setMessage(`Status updated to "${next}"`);
    } catch (err) {
      setMessage("Failed to update status");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this request? This cannot be undone.")) return;
    setBusy(true);
    try {
      await deleteJob(id);
      router.push("/");
    } catch (err) {
      setMessage("Failed to delete");
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-400 py-12 text-center">Loading…</p>;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <Link href="/" className="text-teal-600 text-sm hover:underline">← Back to board</Link>
    </div>
  );
  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 inline-flex items-center gap-1 mb-4">
        ← Back to board
      </Link>

      <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <header className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
                {job.category && (
                  <span className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {job.category}
                  </span>
                )}
                {job.location && <span>📍 {job.location}</span>}
                <span>· Posted {new Date(job.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <StatusBadge status={job.status} />
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>

          {/* Contact info */}
          {(job.contactName || job.contactEmail) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Contact</p>
              {job.contactName && <p className="font-medium text-gray-800">{job.contactName}</p>}
              {job.contactEmail && (
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-teal-600 hover:underline"
                >
                  ✉ {job.contactEmail}
                </a>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-100 pt-5 flex flex-wrap items-end gap-4">
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Update status</span>
              <select
                value={job.status}
                onChange={onStatusChange}
                disabled={busy}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:opacity-60"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            {message && (
              <span className="text-xs text-gray-500 italic">{message}</span>
            )}

            <button
              onClick={onDelete}
              disabled={busy}
              className="ml-auto bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
