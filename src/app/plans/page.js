import Link from "next/link";
import { redirect } from "next/navigation";
import getDb from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const PATH_TYPE_LABELS = {
  traditional: "Traditional 4-year",
  accelerated: "Accelerated",
  transfer: "Transfer",
  double_major: "Double major",
  pre_med: "Pre-med track",
  other: "Other",
};

export default async function PlansPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const q = (params?.q || "").trim();
  const pathType = params?.path_type || "";
  const classYear = params?.class_year || "";

  const db = getDb();
  let sql = `SELECT plans.*, users.name AS author_name, users.role AS author_role
             FROM plans JOIN users ON users.id = plans.user_id
             WHERE plans.school_domain = @school_domain`;
  const bind = { school_domain: user.school_domain };

  if (q) {
    sql += ` AND (plans.majors LIKE @q OR plans.minors LIKE @q OR plans.title LIKE @q)`;
    bind.q = `%${q}%`;
  }
  if (pathType) {
    sql += ` AND plans.path_type = @path_type`;
    bind.path_type = pathType;
  }
  if (classYear) {
    sql += ` AND plans.class_year = @class_year`;
    bind.class_year = Number(classYear);
  }
  sql += ` ORDER BY plans.created_at DESC`;

  const plans = db.prepare(sql).all(bind);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Plan Explorer</h1>
          <p className="text-sm text-zinc-600">
            Real paths from {user.school_domain} students — not just the default template.
          </p>
        </div>
        <Link href="/plans/new" className="btn-primary">
          + Post your plan
        </Link>
      </div>

      <form className="card flex flex-wrap items-end gap-3" method="GET">
        <div className="min-w-[200px] flex-1">
          <label className="label" htmlFor="q">
            Major, minor, or keyword
          </label>
          <input className="input" id="q" name="q" defaultValue={q} placeholder="e.g. Economics" />
        </div>
        <div>
          <label className="label" htmlFor="path_type">
            Path type
          </label>
          <select className="input" id="path_type" name="path_type" defaultValue={pathType}>
            <option value="">Any</option>
            {Object.entries(PATH_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="class_year">
            Class year
          </label>
          <input
            className="input w-28"
            id="class_year"
            name="class_year"
            type="number"
            defaultValue={classYear}
            placeholder="2027"
          />
        </div>
        <button type="submit" className="btn-secondary">
          Filter
        </button>
      </form>

      {plans.length === 0 ? (
        <p className="card text-sm text-zinc-500">
          No plans match yet — be the first to post one for {user.school_domain}.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="card flex flex-col gap-2 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="badge">{PATH_TYPE_LABELS[plan.path_type] || plan.path_type}</span>
                {plan.class_year && (
                  <span className="text-xs text-zinc-500">Class of {plan.class_year}</span>
                )}
              </div>
              <h3 className="font-semibold text-zinc-900">{plan.title}</h3>
              <p className="text-sm text-zinc-600">
                {plan.majors}
                {plan.minors ? ` · minor: ${plan.minors}` : ""}
              </p>
              {plan.summary && (
                <p className="line-clamp-2 text-sm text-zinc-500">{plan.summary}</p>
              )}
              <p className="mt-1 text-xs text-zinc-400">
                {plan.visibility === "anonymous" ? "Anonymous" : plan.author_name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
