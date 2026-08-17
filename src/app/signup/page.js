import SignupForm from "@/components/SignupForm";

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Join The Quad</h1>
      <p className="mb-6 text-sm text-zinc-600">
        One account, scoped to your campus by your school email.
      </p>
      <SignupForm error={params?.error} />
      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-indigo-600">
          Log in
        </a>
      </p>
    </div>
  );
}
