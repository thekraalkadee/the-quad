import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ListingForm from "@/components/ListingForm";

export default async function NewListingPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Post to The Exchange</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Visible only to verified students at {user.school_domain}.
      </p>
      <ListingForm error={params?.error} />
    </div>
  );
}
