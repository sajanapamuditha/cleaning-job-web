import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Service Board",
  description: "Mini service request board — GlobalTNA assessment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-6">
          Built for the GlobalTNA Full-Stack Developer Intern assessment
        </footer>
      </body>
    </html>
  );
}
