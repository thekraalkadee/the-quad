"use client";

import { useState } from "react";
import { registerUser } from "@/lib/actions";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "professor", label: "Professor / Staff" },
  { value: "org", label: "Student Org" },
];

export default function SignupForm({ error }) {
  const [role, setRole] = useState("student");

  return (
    <form action={registerUser} className="card flex flex-col gap-4">
      {error && <p className="alert-error">{error}</p>}

      <div>
        <label className="label" htmlFor="name">
          Full name
        </label>
        <input className="input" id="name" name="name" required placeholder="Jordan Rivera" />
      </div>

      <div>
        <label className="label" htmlFor="email">
          School email
        </label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@u.northwestern.edu"
        />
        <p className="mt-1 text-xs text-zinc-500">
          The domain after the @ becomes your campus — it's what scopes what you see and can
          post to.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <span className="label">I am a...</span>
        <div className="flex gap-2">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium ${
                role === r.value
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-zinc-300 text-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      {role === "student" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="major">
              Major(s)
            </label>
            <input className="input" id="major" name="major" placeholder="Computer Science" />
          </div>
          <div>
            <label className="label" htmlFor="minor">
              Minor(s)
            </label>
            <input className="input" id="minor" name="minor" placeholder="Optional" />
          </div>
          <div>
            <label className="label" htmlFor="class_year">
              Class year
            </label>
            <input
              className="input"
              id="class_year"
              name="class_year"
              type="number"
              placeholder="2027"
            />
          </div>
        </div>
      )}

      {role === "professor" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="department">
              Department
            </label>
            <input
              className="input"
              id="department"
              name="department"
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="label" htmlFor="interests">
              Research interests
            </label>
            <input
              className="input"
              id="interests"
              name="interests"
              placeholder="ML, HCI, ..."
            />
          </div>
        </div>
      )}

      {role === "org" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="org_name">
              Organization name
            </label>
            <input
              className="input"
              id="org_name"
              name="org_name"
              placeholder="Data Science Club"
            />
          </div>
          <div>
            <label className="label" htmlFor="org_category">
              Category
            </label>
            <input
              className="input"
              id="org_category"
              name="org_category"
              placeholder="Academic / Cultural / Pre-professional"
            />
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary mt-2">
        Create account
      </button>
    </form>
  );
}
