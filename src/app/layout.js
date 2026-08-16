import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Commons — Campus Hub",
  description:
    "A campus-verified hub for peer 4-year plans, professor & org opportunities, and a student marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400">
          Built for the Stellic Pathfinders Challenge — a student project, not affiliated with
          any university's official systems.
        </footer>
      </body>
    </html>
  );
}
