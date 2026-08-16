import Link from "next/link";
import { redirect } from "next/navigation";
import getDb from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const CATEGORY_LABELS = {
  furniture: "Furniture",
  electronics: "Electronics",
  textbooks: "Textbooks",
  clothes: "Clothes",
  free: "Free / giveaway",
  other: "Other",
};

export default async function ExchangePage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const q = (params?.q || "").trim();
  const kind = params?.kind || "";
  const category = params?.category || "";

  const db = getDb();
  let sql = `SELECT listings.*, users.name AS author_name
             FROM listings JOIN users ON users.id = listings.user_id
             WHERE listings.school_domain = @school_domain AND listings.status = 'available'`;
  const bind = { school_domain: user.school_domain };

  if (q) {
    sql += ` AND (listings.title LIKE @q OR listings.description LIKE @q)`;
    bind.q = `%${q}%`;
  }
  if (kind) {
    sql += ` AND listings.kind = @kind`;
    bind.kind = kind;
  }
  if (category) {
    sql += ` AND listings.category = @category`;
    bind.category = category;
  }
  sql += ` ORDER BY listings.created_at DESC`;

  const listings = db.prepare(sql).all(bind);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">The Exchange</h1>
          <p className="text-sm text-zinc-600">
            Buy, sell, give away, or sublet — {user.school_domain} only.
          </p>
        </div>
        <Link href="/exchange/new" className="btn-primary">
          + Post a listing
        </Link>
      </div>

      <form className="card flex flex-wrap items-end gap-3" method="GET">
        <div className="min-w-[200px] flex-1">
          <label className="label" htmlFor="q">
            Search
          </label>
          <input className="input" id="q" name="q" defaultValue={q} placeholder="e.g. desk" />
        </div>
        <div>
          <label className="label" htmlFor="kind">
            Type
          </label>
          <select className="input" id="kind" name="kind" defaultValue={kind}>
            <option value="">Any</option>
            <option value="item">Items</option>
            <option value="sublet">Sublets</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <select className="input" id="category" name="category" defaultValue={category}>
            <option value="">Any</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
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

      {listings.length === 0 ? (
        <p className="card text-sm text-zinc-500">Nothing listed yet — be the first to post.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/exchange/${l.id}`}
              className="card flex flex-col gap-2 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="badge">{l.kind === "sublet" ? "Sublet" : CATEGORY_LABELS[l.category] || "Item"}</span>
                {l.price && <span className="text-sm font-medium text-zinc-700">{l.price}</span>}
              </div>
              <h3 className="font-semibold text-zinc-900">{l.title}</h3>
              {l.description && (
                <p className="line-clamp-2 text-sm text-zinc-500">{l.description}</p>
              )}
              <p className="text-xs text-zinc-400">
                {l.kind === "sublet" ? l.date_range : l.condition} ·{" "}
                {l.pickup_area || "Area not listed"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
