import { loginUser } from "@/lib/actions";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Log in</h1>
      <p className="mb-6 text-sm text-zinc-600">Welcome back to The Quad.</p>

      <form action={loginUser} className="card flex flex-col gap-4">
        {params?.error && <p className="alert-error">{params.error}</p>}
        <div>
          <label className="label" htmlFor="email">
            School email
          </label>
          <input className="input" id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input className="input" id="password" name="password" type="password" required />
        </div>
        <button type="submit" className="btn-primary mt-2">
          Log in
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-500">
        New here?{" "}
        <a href="/signup" className="font-medium text-indigo-600">
          Create an account
        </a>
      </p>
    </div>
  );
}
