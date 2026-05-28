import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-teal-600 text-lg tracking-tight">
          🔧 Service Board
        </Link>
        <Link
          href="/jobs/new"
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New request
        </Link>
      </div>
    </nav>
  );
}
