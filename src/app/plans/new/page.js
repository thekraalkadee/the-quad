import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PlanForm from "@/components/PlanForm";

export default async function NewPlanPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  if (user.role !== "student") {
    return (
      <div className="mx-auto max-w-lg card">
        <p className="text-sm text-zinc-600">
          Only student accounts can post a 4-year plan. You're signed in as a{" "}
          <span className="font-medium capitalize">{user.role}</span> account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Post your plan</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Visible to {user.school_domain} students. Include the details you wish someone had told
        you.
      </p>
      <PlanForm error={params?.error} />
    </div>
  );
}
