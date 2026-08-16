import Link from "next/link";
import { redirect } from "next/navigation";
import getDb from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const TYPE_LABELS = {
  competition: "Competition",
  conference: "Conference",
  talk: "Talk",
  meeting: "Meeting",
  session: "Session",
  research: "Research opening",
  other: "Other",
};

const LEVEL_LABELS = {
  no_prereq: "No prereq",
  intro: "Intro",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function OpportunitiesPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const q = (params?.q || "").trim();
  const type = params?.type || "";
  const level = params?.level || "";

  const db = getDb();
  let sql = `SELECT opportunities.*, users.name AS author_name, users.role AS author_role, users.org_name AS org_name
             FROM opportunities JOIN users ON users.id = opportunities.user_id
             WHERE opportunities.school_domain = @school_domain`;
  const bind = { school_domain: user.school_domain };

  if (q) {
    sql += ` AND (opportunities.title LIKE @q OR opportunities.target_majors LIKE @q OR opportunities.category LIKE @q)`;
    bind.q = `%${q}%`;
  }
  if (type) {
    sql += ` AND opportunities.type = @type`;
    bind.type = type;
  }
  if (level) {
    sql += ` AND opportunities.level = @level`;
    bind.level = level;
  }
  sql += ` ORDER BY opportunities.created_at DESC`;

  const opportunities = db.prepare(sql).all(bind);
  const canPost = user.role === "professor" || user.role === "org";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Opportunity Board</h1>
          <p className="text-sm text-zinc-600">
            Conferences, competitions, research, and events at {user.school_domain}.
          </p>
        </div>
        {canPost ? (
          <Link href="/opportunities/new" className="btn-primary">
            + Post an opportunity
          </Link>
        ) : (
          <span className="text-xs text-zinc-400">
            Only professor / org accounts can post here
          </span>
        )}
      </div>

      <form className="card flex flex-wrap items-end gap-3" method="GET">
        <div className="min-w-[200px] flex-1">
          <label className="label" htmlFor="q">
            Keyword or major
          </label>
          <input className="input" id="q" name="q" defaultValue={q} placeholder="e.g. Biology" />
        </div>
        <div>
          <label className="label" htmlFor="type">
            Type
          </label>
          <select className="input" id="type" name="type" defaultValue={type}>
            <option value="">Any</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="level">
            Level
          </label>
          <select className="input" id="level" name="level" defaultValue={level}>
            <option value="">Any</option>
            {Object.entries(LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-secondary">
          Filter
        </button>
      </form>

      {opportunities.length === 0 ? (
        <p className="card text-sm text-zinc-500">Nothing posted yet — check back soon.</p>
      ) : (
        <div className="grid gap-4">
          {opportunities.map((op) => (
            <div key={op.id} className="card flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{TYPE_LABELS[op.type] || op.type}</span>
                <span className="text-xs text-zinc-500">{LEVEL_LABELS[op.level] || op.level}</span>
                {op.deadline && (
                  <span className="text-xs text-red-500">Apply by {op.deadline}</span>
                )}
              </div>
              <h3 className="font-semibold text-zinc-900">{op.title}</h3>
              {op.description && <p className="text-sm text-zinc-600">{op.description}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                {op.target_majors && <span>Majors: {op.target_majors}</span>}
                {op.event_date && <span>Date: {op.event_date}</span>}
              </div>
              <p className="text-xs text-zinc-400">
                Posted by {op.org_name || op.author_name} ({op.author_role})
              </p>
              {op.apply_link ? (
                <a
                  href={op.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost self-start text-xs"
                >
                  Apply / learn more →
                </a>
              ) : (
                <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">
                  <p className="font-medium text-zinc-700">How to apply:</p>
                  <p>{op.apply_instructions}</p>
                  {op.contact && <p className="mt-1">Contact: {op.contact}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
