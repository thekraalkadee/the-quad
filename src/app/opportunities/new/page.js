import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createOpportunity } from "@/lib/actions";

export default async function NewOpportunityPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  if (user.role !== "professor" && user.role !== "org") {
    return (
      <div className="mx-auto max-w-lg card">
        <p className="text-sm text-zinc-600">
          Only professor or student org accounts can post opportunities. You're signed in as a{" "}
          <span className="font-medium capitalize">{user.role}</span> account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Post an opportunity</h1>
      <p className="mb-6 text-sm text-zinc-600">Visible to every student at {user.school_domain}.</p>

      <form action={createOpportunity} className="card flex flex-col gap-4">
        {params?.error && <p className="alert-error">{params.error}</p>}

        <div>
          <label className="label" htmlFor="title">
            Title
          </label>
          <input className="input" id="title" name="title" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="type">
              Type
            </label>
            <select className="input" id="type" name="type" required defaultValue="talk">
              <option value="competition">Competition</option>
              <option value="conference">Conference</option>
              <option value="talk">Talk</option>
              <option value="meeting">Meeting</option>
              <option value="session">Session</option>
              <option value="research">Research opening</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="level">
              Level
            </label>
            <select className="input" id="level" name="level" defaultValue="no_prereq">
              <option value="no_prereq">No prereq</option>
              <option value="intro">Intro</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <input className="input" id="category" name="category" placeholder="e.g. AI, Policy" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="target_majors">
            Target majors
          </label>
          <input
            className="input"
            id="target_majors"
            name="target_majors"
            placeholder="e.g. Computer Science, Data Science (leave blank for all majors)"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="event_date">
              Event date
            </label>
            <input className="input" id="event_date" name="event_date" placeholder="e.g. Oct 12, 2026" />
          </div>
          <div>
            <label className="label" htmlFor="deadline">
              Application deadline
            </label>
            <input className="input" id="deadline" name="deadline" placeholder="e.g. Sep 30, 2026" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea className="input" id="description" name="description" rows={3} />
        </div>

        <div>
          <label className="label" htmlFor="apply_link">
            Application link (if one exists)
          </label>
          <input className="input" id="apply_link" name="apply_link" placeholder="https://..." />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="apply_instructions">
              How to apply (if no link)
            </label>
            <textarea className="input" id="apply_instructions" name="apply_instructions" rows={2} />
          </div>
          <div>
            <label className="label" htmlFor="contact">
              Contact
            </label>
            <input className="input" id="contact" name="contact" placeholder="email or office hours" />
          </div>
        </div>

        <button type="submit" className="btn-primary self-start">
          Post opportunity
        </button>
      </form>
    </div>
  );
}
