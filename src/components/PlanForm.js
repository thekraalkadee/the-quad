"use client";

import { useState } from "react";
import { createPlan } from "@/lib/actions";

const PATH_TYPES = [
  { value: "traditional", label: "Traditional 4-year" },
  { value: "accelerated", label: "Accelerated (3-year)" },
  { value: "transfer", label: "Transfer" },
  { value: "double_major", label: "Double major" },
  { value: "pre_med", label: "Pre-med track" },
  { value: "other", label: "Other" },
];

export default function PlanForm({ error }) {
  const [terms, setTerms] = useState([{ name: "", courses: "", note: "" }]);

  function updateTerm(i, field, value) {
    setTerms((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  }

  function addTerm() {
    setTerms((prev) => [...prev, { name: "", courses: "", note: "" }]);
  }

  function removeTerm(i) {
    setTerms((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <form action={createPlan} className="flex flex-col gap-5">
      {error && <p className="alert-error">{error}</p>}

      <input type="hidden" name="terms_json" value={JSON.stringify(terms)} />

      <div className="card flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="title">
            Plan title
          </label>
          <input
            className="input"
            id="title"
            name="title"
            required
            placeholder="CS + Econ double major, came in with 24 AP credits"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="majors">
              Major(s)
            </label>
            <input className="input" id="majors" name="majors" required placeholder="Computer Science" />
          </div>
          <div>
            <label className="label" htmlFor="minors">
              Minor(s)
            </label>
            <input className="input" id="minors" name="minors" placeholder="Optional" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="path_type">
              Path type
            </label>
            <select className="input" id="path_type" name="path_type" required defaultValue="traditional">
              {PATH_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="class_year">
              Graduating class
            </label>
            <input className="input" id="class_year" name="class_year" type="number" placeholder="2027" />
          </div>
          <div>
            <label className="label" htmlFor="visibility">
              Visibility
            </label>
            <select className="input" id="visibility" name="visibility" defaultValue="public">
              <option value="public">Public, with my name</option>
              <option value="anonymous">Public, anonymous</option>
              <option value="school_only">My campus only</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="entry_credit">
            Entry credit
          </label>
          <input
            className="input"
            id="entry_credit"
            name="entry_credit"
            placeholder="e.g. 24 AP credits, 3 semesters of transfer credit from a community college"
          />
        </div>

        <div>
          <label className="label" htmlFor="summary">
            Quick summary / why this path
          </label>
          <textarea
            className="input"
            id="summary"
            name="summary"
            rows={3}
            placeholder="Why you chose this path, and what you'd tell someone starting where you started."
          />
        </div>
      </div>

      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900">Term by term</h3>
          <button type="button" onClick={addTerm} className="btn-ghost text-xs">
            + Add term
          </button>
        </div>

        {terms.map((term, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500">Term {i + 1}</span>
              {terms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTerm(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-3">
              <input
                className="input"
                placeholder="Term name, e.g. Fall 2024"
                value={term.name}
                onChange={(e) => updateTerm(i, "name", e.target.value)}
              />
              <input
                className="input"
                placeholder="Courses, comma separated, e.g. CS 111, MATH 220, ECON 201"
                value={term.courses}
                onChange={(e) => updateTerm(i, "courses", e.target.value)}
              />
              <textarea
                className="input"
                rows={2}
                placeholder="Notes — why this order, professor tips, substitutions that worked, etc."
                value={term.note}
                onChange={(e) => updateTerm(i, "note", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn-primary self-start">
        Post my plan
      </button>
    </form>
  );
}
