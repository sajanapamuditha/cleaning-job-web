"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createJob } from "@/services/api";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery"];

const INITIAL = {
  title: "",
  description: "",
  category: "",
  location: "",
  contactName: "",
  contactEmail: "",
};

// Simple client-side validation
function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  else if (form.title.length > 140) errors.title = "Max 140 characters";
  if (!form.description.trim()) errors.description = "Description is required";
  else if (form.description.length > 2000) errors.description = "Max 2000 characters";
  if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
    errors.contactEmail = "Invalid email format";
  }
  return errors;
}

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError("");
    try {
      const job = await createJob(form);
      router.push(`/jobs/${job._id}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 inline-flex items-center gap-1 mb-4">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Post a service request</h1>
      <p className="text-sm text-gray-500 mb-6">Tell tradespeople what you need help with.</p>

      {serverError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {serverError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        {/* Title */}
        <Field label="Title" required error={errors.title}>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Need a plumber for a leaking kitchen tap"
            maxLength={140}
            className={input(errors.title)}
          />
        </Field>

        {/* Description */}
        <Field label="Description" required error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            maxLength={2000}
            className={input(errors.description)}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Category */}
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={input()}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* Location */}
          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Glasgow"
              className={input()}
            />
          </Field>

          {/* Contact name */}
          <Field label="Your name">
            <input
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              className={input()}
            />
          </Field>

          {/* Contact email */}
          <Field label="Email" error={errors.contactEmail}>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              className={input(errors.contactEmail)}
            />
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            {submitting ? "Posting…" : "Post request"}
          </button>
          <Link
            href="/"
            className="border border-gray-200 text-gray-500 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

// Tailwind class helper
function input(error) {
  const base =
    "w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2";
  return error
    ? `${base} border-red-400 focus:border-red-400 focus:ring-red-200`
    : `${base} border-gray-200 focus:border-teal-500 focus:ring-teal-200`;
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-500">{error}</span>}
    </label>
  );
}
