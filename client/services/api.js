const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// GET /api/jobs  (optional ?category=&status= filters)
export async function listJobs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  const res = await fetch(`${BASE}/api/jobs?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

// GET /api/jobs/:id
export async function getJob(id) {
  const res = await fetch(`${BASE}/api/jobs/${id}`, { cache: "no-store" });
  if (res.status === 404) throw new Error("Job not found");
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
}

// POST /api/jobs
export async function createJob(data) {
  const res = await fetch(`${BASE}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      body.errors?.[0]?.msg || body.error || "Failed to create job";
    throw new Error(msg);
  }
  return res.json();
}

// PATCH /api/jobs/:id  (status only)
export async function updateStatus(id, status) {
  const res = await fetch(`${BASE}/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

// DELETE /api/jobs/:id
export async function deleteJob(id) {
  const res = await fetch(`${BASE}/api/jobs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete job");
}
