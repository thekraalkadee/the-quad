import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-14 text-white sm:px-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-100">
          Campus Connection · Pathfinders Challenge
        </p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          The people who know how to navigate your college are the students who already did.
        </h1>
        <p className="mt-4 max-w-2xl text-indigo-100">
          The Quad is a campus-verified hub where students share real 4-year plans instead of the
          generic one, professors and orgs put opportunities in front of the students who'd
          actually want them, and the end-of-year furniture scramble has one home instead of
          three group chats.
        </p>
        {!user && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary bg-white text-indigo-700 hover:bg-indigo-50">
              Join with your school email
            </Link>
            <Link href="/login" className="btn-ghost border-white/40 text-white hover:bg-white/10">
              Log in
            </Link>
          </div>
        )}
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <ModuleCard
          href="/plans"
          eyebrow="Platform 01"
          title="Plan Explorer"
          description="Browse real 4-year plans from students who've navigated your major, minor, or transfer path — filtered by what matters to you."
          cta="Explore plans"
        />
        <ModuleCard
          href="/opportunities"
          eyebrow="Platform 02"
          title="Opportunity Board"
          description="Conferences, competitions, research openings, and talks from professors and student orgs, filtered by major and level."
          cta="Browse opportunities"
        />
        <ModuleCard
          href="/exchange"
          eyebrow="Platform 03"
          title="The Exchange"
          description="Buy, sell, give away, or sublet — scoped to your campus only. Move-out season, solved."
          cta="Browse the exchange"
        />
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-zinc-900">How verification works</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Signing up requires a school email address — that's what scopes Plan Explorer,
          Opportunity Board, and The Exchange to your campus community, and what tells everyone
          else you're a real, current student, professor, or student org. No directory lookups,
          no third-party data — just your own email and whatever you choose to share about
          yourself.
        </p>
      </section>
    </div>
  );
}

function ModuleCard({ href, eyebrow, title, description, cta }) {
  return (
    <Link href={href} className="card flex flex-col gap-2 transition-shadow hover:shadow-md">
      <span className="badge w-fit">{eyebrow}</span>
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="flex-1 text-sm text-zinc-600">{description}</p>
      <span className="mt-2 text-sm font-medium text-indigo-600">{cta} →</span>
    </Link>
  );
}
