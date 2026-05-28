import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-semibold text-gray-900 text-base leading-snug">{job.title}</h2>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {job.category && (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {job.category}
            </span>
          )}
          {job.location && <span>📍 {job.location}</span>}
          <span className="ml-auto">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
