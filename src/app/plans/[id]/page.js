import { notFound, redirect } from "next/navigation";
import getDb from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { askPlanQuestion } from "@/lib/actions";

const PATH_TYPE_LABELS = {
  traditional: "Traditional 4-year",
  accelerated: "Accelerated",
  transfer: "Transfer",
  double_major: "Double major",
  pre_med: "Pre-med track",
  other: "Other",
};

export default async function PlanDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const db = getDb();
  const plan = db
    .prepare(
      `SELECT plans.*, users.name AS author_name, users.role AS author_role, users.email AS author_email
       FROM plans JOIN users ON users.id = plans.user_id
       WHERE plans.id = ?`
    )
    .get(id);

  if (!plan || plan.school_domain !== user.school_domain) notFound();

  const terms = JSON.parse(plan.terms_json || "[]");
  const questions = db
    .prepare(
      `SELECT plan_questions.*, users.name AS author_name
       FROM plan_questions JOIN users ON users.id = plan_questions.user_id
       WHERE plan_id = ? ORDER BY created_at ASC`
    )
    .all(id);

  const boundAsk = askPlanQuestion.bind(null, plan.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge">{PATH_TYPE_LABELS[plan.path_type] || plan.path_type}</span>
          {plan.class_year && (
            <span className="text-xs text-zinc-500">Class of {plan.class_year}</span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">{plan.title}</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {plan.majors}
          {plan.minors ? ` · minor: ${plan.minors}` : ""}
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Posted by {plan.visibility === "anonymous" ? "an anonymous student" : plan.author_name}
        </p>
      </div>

      {plan.entry_credit && (
        <div className="card">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Entry credit</h2>
          <p className="text-sm text-zinc-600">{plan.entry_credit}</p>
        </div>
      )}

      {plan.summary && (
        <div className="card">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Why this path</h2>
          <p className="text-sm text-zinc-600 whitespace-pre-wrap">{plan.summary}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">Term by term</h2>
        {terms.length === 0 && <p className="text-sm text-zinc-500">No terms listed.</p>}
        {terms.map((term, i) => (
          <div key={i} className="card">
            <h3 className="font-medium text-zinc-900">{term.name || `Term ${i + 1}`}</h3>
            {term.courses && (
              <p className="mt-1 text-sm text-zinc-600">{term.courses}</p>
            )}
            {term.note && (
              <p className="mt-2 text-sm text-zinc-500 whitespace-pre-wrap">{term.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="card flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          Questions {questions.length > 0 && `(${questions.length})`}
        </h2>
        {questions.length === 0 && (
          <p className="text-sm text-zinc-500">No questions yet — ask the first one.</p>
        )}
        {questions.map((qq) => (
          <div key={qq.id} className="border-b border-zinc-100 pb-3 last:border-0">
            <p className="text-sm text-zinc-800">{qq.body}</p>
            <p className="mt-1 text-xs text-zinc-400">{qq.author_name}</p>
          </div>
        ))}
        <form action={boundAsk} className="flex gap-2">
          <input
            className="input"
            name="body"
            placeholder="Ask about this plan..."
            required
          />
          <button type="submit" className="btn-secondary shrink-0">
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
