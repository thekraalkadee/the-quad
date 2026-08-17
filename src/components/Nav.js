import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutUser } from "@/lib/actions";

export default async function Nav() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
            Q
          </span>
          The Quad
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 sm:flex">
          <Link href="/plans" className="hover:text-zinc-900">
            Plan Explorer
          </Link>
          <Link href="/opportunities" className="hover:text-zinc-900">
            Opportunity Board
          </Link>
          <Link href="/exchange" className="hover:text-zinc-900">
            The Exchange
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-zinc-500 sm:inline">
                {user.name} · <span className="capitalize">{user.role}</span> ·{" "}
                {user.school_domain}
              </span>
              <form action={logoutUser}>
                <button type="submit" className="btn-ghost">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600 sm:hidden">
        <Link href="/plans">Plan Explorer</Link>
        <Link href="/opportunities">Opportunity Board</Link>
        <Link href="/exchange">The Exchange</Link>
      </nav>
    </header>
  );
}
